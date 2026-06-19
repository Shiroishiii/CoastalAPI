/**
 * read.test.js
 * Testes unitários — READ (CoastalAPI / Guia de Praias)
 * Local: guia-praias/tests/read.test.js
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// ── Mocks estáticos ───────────────────────────────────────────────────────────

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => null,
}));

jest.mock("../src/components/Header", () => () => <header data-testid="header" />);
jest.mock("../src/components/Footer", () => () => <footer data-testid="footer" />);
jest.mock("../src/components/DashboardLayout", () =>
  ({ children, title }) => <div><h1>{title}</h1>{children}</div>
);

const mockFetchApi = jest.fn();
jest.mock("../src/utils/api", () => ({
  fetchApi: (...args) => mockFetchApi(...args),
  API_URL: "/api",
}));

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const praiasMock = [
  { id: 1, nome: "Jurerê Internacional", regiao: "Norte", descricao: "Praia sofisticada.", nivel_perigo: "Verde", surf: false },
  { id: 2, nome: "Campeche", regiao: "Sul", descricao: "Praia extensa.", nivel_perigo: "Vermelha", surf: true },
  { id: 3, nome: "Joaquina", regiao: "Leste", descricao: "Famosa pelas dunas.", nivel_perigo: "Amarela", surf: true },
];

const usuariosMock = [
  { id: 1, nome: "João", email: "joao@praia.com" },
  { id: 2, nome: "Maria", email: "maria@praia.com" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderPraiasPage() {
  const PraiasPage = require("../src/pages/PraiasPage").default;
  return render(<MemoryRouter><PraiasPage /></MemoryRouter>);
}

function renderDetalhePraia(id) {
  mockUseParams.mockReturnValue({ id: String(id) });
  const DetalhePraiaPage = require("../src/pages/DetalhePraia").default;
  return render(
    <MemoryRouter initialEntries={[`/praias/${id}`]}>
      <DetalhePraiaPage />
    </MemoryRouter>
  );
}

// ── CT-008: Listagem de praias com sucesso ────────────────────────────────────

describe("CT-008 — Listagem de praias retorna registros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchApi.mockResolvedValue(praiasMock);
  });

  it("deve renderizar os cards de praias retornadas pela API", async () => {
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText("Jurerê Internacional")).toBeInTheDocument();
      expect(screen.getByText("Campeche")).toBeInTheDocument();
      expect(screen.getByText("Joaquina")).toBeInTheDocument();
    });
  });

  it("deve exibir o contador de praias encontradas", async () => {
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText(/3 praias encontradas/i)).toBeInTheDocument();
    });
  });
});

// ── CT-009: Lista vazia ───────────────────────────────────────────────────────

describe("CT-009 — Listagem retorna array vazio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchApi.mockResolvedValue([]);
  });

  it("deve exibir 'Nenhuma praia encontrada' quando API retorna []", async () => {
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText(/nenhuma praia encontrada/i)).toBeInTheDocument();
    });
  });
});

// ── CT-010: Erro ao carregar ──────────────────────────────────────────────────

describe("CT-010 — Erro ao carregar praias da API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  it("deve exibir mensagem de erro quando fetchApi lança exceção", async () => {
    mockFetchApi.mockRejectedValue(new Error("Erro ao buscar dados da API"));
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText(/erro ao buscar dados da api/i)).toBeInTheDocument();
    });
  });

  it("deve exibir dica sobre o backend quando houver erro", async () => {
    mockFetchApi.mockRejectedValue(new Error("fetch failed"));
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText(/verifique se o backend está rodando/i)).toBeInTheDocument();
    });
  });
});

// ── CT-011: Filtragem por nome ────────────────────────────────────────────────

describe("CT-011 — Busca/filtragem de praias por nome", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchApi.mockResolvedValue(praiasMock);
  });

  it("deve filtrar resultados conforme texto digitado", async () => {
    renderPraiasPage();

    await waitFor(() => {
      expect(screen.getByText("Jurerê Internacional")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Buscar praia...");
    await userEvent.type(input, "cam");

    await waitFor(() => {
      expect(screen.getByText("Campeche")).toBeInTheDocument();
      expect(screen.queryByText("Jurerê Internacional")).not.toBeInTheDocument();
      expect(screen.queryByText("Joaquina")).not.toBeInTheDocument();
    });
  });

  it("deve exibir 'Nenhuma praia encontrada' quando busca não tem resultado", async () => {
    renderPraiasPage();

    await waitFor(() => expect(screen.getByText("Campeche")).toBeInTheDocument());

    const input = screen.getByPlaceholderText("Buscar praia...");
    await userEvent.type(input, "zzz");

    await waitFor(() => {
      expect(screen.getByText(/nenhuma praia encontrada/i)).toBeInTheDocument();
    });
  });
});

// ── CT-012: Dashboard com estatísticas ───────────────────────────────────────

describe("CT-012 — Dashboard exibe estatísticas corretas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchApi
      .mockResolvedValueOnce(praiasMock)
      .mockResolvedValueOnce(usuariosMock);
  });

  it("deve exibir o total de praias e usuários", async () => {
    const Dashboard = require("../src/pages/Dashboard").default;
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await waitFor(() => {
      const cardPraias = screen.getByText("Total de praias").closest("div");
      const cardUsuarios = screen.getByText("Usuários").closest("div");

      expect(within(cardPraias).getByText("3")).toBeInTheDocument();
      expect(within(cardUsuarios).getByText("2")).toBeInTheDocument();
    });
  });
});

// ── CT-013: Detalhe de praia ──────────────────────────────────────────────────

describe("CT-013 — Detalhe de praia exibe informações e avaliações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("usuarioId", "1");
  });

  afterEach(() => localStorage.clear());

  it("deve exibir nome, região e nível de perigo da praia", async () => {
    mockFetchApi
      .mockResolvedValueOnce({ id: 1, nome: "Joaquina", regiao: "Leste", descricao: "Famosa.", nivel_perigo: "Amarela", surf: true })
      .mockResolvedValueOnce([{ id: 10, nota: 5, comentario: "Incrível!", usuario: "João" }])
      .mockResolvedValueOnce({ favoritado: false });

    renderDetalhePraia(1);

    await waitFor(() => {
      expect(screen.getByText("Joaquina")).toBeInTheDocument();
      expect(screen.getAllByText("Leste").length).toBeGreaterThan(0);
      expect(screen.getByText("Amarela")).toBeInTheDocument();
    });
  });

  it("deve exibir avaliações carregadas da API", async () => {
    mockFetchApi
      .mockResolvedValueOnce({ id: 1, nome: "Joaquina", regiao: "Leste", descricao: "...", nivel_perigo: "Amarela", surf: true })
      .mockResolvedValueOnce([{ id: 10, nota: 5, comentario: "Incrível!", usuario: "João" }])
      .mockResolvedValueOnce({ favoritado: false });

    renderDetalhePraia(1);

    await waitFor(() => {
      expect(screen.getByText("Incrível!")).toBeInTheDocument();
      expect(screen.getByText("João")).toBeInTheDocument();
    });
  });

  it("deve exibir 'Nenhuma avaliação ainda' quando não há avaliações", async () => {
    mockFetchApi
      .mockResolvedValueOnce({ id: 2, nome: "Solidão", regiao: "Sul", descricao: "...", nivel_perigo: "Verde", surf: false })
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ favoritado: false });

    renderDetalhePraia(2);

    await waitFor(() => {
      expect(screen.getByText(/nenhuma avaliação ainda/i)).toBeInTheDocument();
    });
  });
});

// ── CT-014: Listagem de favoritos ────────────────────────────────────────────

describe("CT-014 — Listagem de favoritos do usuário", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir praias favoritas quando usuário está logado", async () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue({ id: 7, nome: "Surfista", email: "surf@praia.com" });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, nome: "Jurerê Internacional", regiao: "Norte", nivel_perigo: "Verde" },
        { id: 2, nome: "Campeche", regiao: "Sul", nivel_perigo: "Vermelha" },
      ],
    });

    const Favoritos = require("../src/pages/Favoritos").default;
    render(<MemoryRouter><Favoritos /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText("Jurerê Internacional")).toBeInTheDocument();
      expect(screen.getByText("Campeche")).toBeInTheDocument();
    });
  });

  it("deve pedir login quando não há usuário autenticado", () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(null);

    const Favoritos = require("../src/pages/Favoritos").default;
    render(<MemoryRouter><Favoritos /></MemoryRouter>);

    expect(
      screen.getByText(/faça login para ver e gerenciar seus favoritos/i)
    ).toBeInTheDocument();
  });

  it("deve exibir mensagem quando lista de favoritos está vazia", async () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue({ id: 7, nome: "Surfista", email: "surf@praia.com" });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const Favoritos = require("../src/pages/Favoritos").default;
    render(<MemoryRouter><Favoritos /></MemoryRouter>);

    await waitFor(() => {
      expect(
        screen.getByText(/você ainda não salvou nenhuma praia nos favoritos/i)
      ).toBeInTheDocument();
    });
  });
});
