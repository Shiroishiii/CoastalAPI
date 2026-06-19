/**
 * delete.test.js
 * Testes unitários para operações de exclusão (DELETE) — CoastalAPI / Guia de Praias
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks globais ──────────────────────────────────────────────────────────────

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => null,
}));

jest.mock("../src/components/Header", () => () => <header />);
jest.mock("../src/components/Footer", () => () => <footer />);

const mockFetchApi = jest.fn();
jest.mock("../src/utils/api", () => ({
  fetchApi: (...args) => mockFetchApi(...args),
  API_URL: "/api",
}));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: "5" }));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

const praiaData = {
  id: 5,
  nome: "Barra da Lagoa",
  regiao: "Leste",
  descricao: "Praia com canal.",
  nivel_perigo: "Verde",
  surf: false,
};

function renderDetalhePraia(mockFavoritado = true) {
  mockUseParams.mockReturnValue({ id: "5" });
  mockFetchApi
    .mockResolvedValueOnce(praiaData)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce({ favoritado: mockFavoritado });

  const DetalhePraiaPage = require("../src/pages/DetalhePraia").default;
  return render(
    <MemoryRouter initialEntries={["/praias/5"]}>
      <DetalhePraiaPage />
    </MemoryRouter>
  );
}

// ── CT-021: Remoção de favorito com sucesso ───────────────────────────────────

describe("CT-021 — Remoção de favorito com sucesso", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("usuarioId", "10");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve chamar DELETE /api/favoritos quando praia está favoritada e usuário clica no botão", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderDetalhePraia(true);

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnFavorito = await screen.findByRole("button", { name: /favoritada/i });
    fireEvent.click(btnFavorito);

    await waitFor(() => {
      const deleteCall = global.fetch.mock.calls.find(
        (c) => c[0] === "/api/favoritos" && c[1]?.method === "DELETE"
      );
      expect(deleteCall).toBeDefined();
    });
  });

  it("deve enviar usuario_id e praia_id corretos no corpo do DELETE", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderDetalhePraia(true);

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnFavorito = await screen.findByRole("button", { name: /favoritada/i });
    fireEvent.click(btnFavorito);

    await waitFor(() => {
      const deleteCall = global.fetch.mock.calls.find(
        (c) => c[0] === "/api/favoritos" && c[1]?.method === "DELETE"
      );
      const body = JSON.parse(deleteCall[1].body);
      expect(body.usuario_id).toBe(10);
      expect(body.praia_id).toBe(5);
    });
  });
});

// ── CT-022: Desfavoritar sem login ───────────────────────────────────────────

describe("CT-022 — Tentativa de alterar favorito sem usuário logado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("deve exibir alerta pedindo login ao tentar favoritar sem autenticação", async () => {
    mockUseParams.mockReturnValue({ id: "5" });
    mockFetchApi
      .mockResolvedValueOnce({
        id: 5, nome: "Solidão", regiao: "Sul",
        descricao: "Praia isolada.", nivel_perigo: "Verde", surf: false,
      })
      .mockResolvedValueOnce([]);

    global.fetch = jest.fn();
    const windowAlertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    const DetalhePraiaPage = require("../src/pages/DetalhePraia").default;
    render(
      <MemoryRouter initialEntries={["/praias/5"]}>
        <DetalhePraiaPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnFavoritar = await screen.findByRole("button", { name: /favoritar/i });
    fireEvent.click(btnFavoritar);

    await waitFor(() => {
      expect(windowAlertSpy).toHaveBeenCalledWith("Faça login para favoritar.");
    });

    windowAlertSpy.mockRestore();
  });
});

// ── CT-023: Erro de API ao remover favorito ───────────────────────────────────

describe("CT-023 — Erro de API ao tentar remover favorito", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("usuarioId", "10");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve lidar com erro silenciosamente (sem crash) quando DELETE falha", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    renderDetalhePraia(true);

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnFavorito = await screen.findByRole("button", { name: /favoritada/i });
    expect(() => fireEvent.click(btnFavorito)).not.toThrow();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });

    console.error.mockRestore?.();
  });
});

// ── CT-024: Toggle favorito ───────────────────────────────────────────────────

describe("CT-024 — Toggle de favorito: de favoritado para não-favoritado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("usuarioId", "10");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve alterar texto do botão de 'Favoritada' para 'Favoritar' após remover", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderDetalhePraia(true);

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnAntes = await screen.findByRole("button", { name: /favoritada/i });
    fireEvent.click(btnAntes);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^favoritar$/i })).toBeInTheDocument();
    });
  });
});

// ── CT-025: Toggle favorito (adição) ─────────────────────────────────────────

describe("CT-025 — Toggle de favorito: de não-favoritado para favoritado", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("usuarioId", "10");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve alterar texto do botão de 'Favoritar' para 'Favoritada' após adicionar", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderDetalhePraia(false);

    await waitFor(() =>
      expect(screen.queryByText("Carregando...")).not.toBeInTheDocument()
    );

    const btnAntes = await screen.findByRole("button", { name: /^favoritar$/i });
    fireEvent.click(btnAntes);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /favoritada/i })).toBeInTheDocument();
    });
  });
});
