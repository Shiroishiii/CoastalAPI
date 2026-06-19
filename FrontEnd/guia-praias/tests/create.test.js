/**
 * create.test.js
 * Testes unitários — CREATE (CoastalAPI / Guia de Praias)
 * Local: guia-praias/tests/create.test.js
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks de módulos (sem referências a variáveis externas) ───────────────────

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => null,
}));

jest.mock("../src/components/Header", () => () => <header data-testid="header" />);
jest.mock("../src/components/Footer", () => () => <footer data-testid="footer" />);

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function renderRegister() {
  const Register = require("../src/pages/Register").default;
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

function preencherCadastro({ nome = "Maria Praia", email = "maria@teste.com", senha = "senha123" } = {}) {
  fireEvent.change(screen.getByPlaceholderText("Digite seu nome"), { target: { value: nome } });
  fireEvent.change(screen.getByPlaceholderText("Digite seu email"), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), { target: { value: senha } });
}

// ── CT-001: Cadastro válido ────────────────────────────────────────────────────

describe("CT-001 — Cadastro de usuário com dados válidos", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deve salvar usuário no localStorage e redirecionar para /home", async () => {
    const novoUsuario = { id: 1, nome: "Maria Praia", email: "maria@teste.com" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => novoUsuario,
    });

    const authUtils = require("../src/utils/auth");
    const setUsuarioSpy = jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    renderRegister();
    preencherCadastro();
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/usuarios",
        expect.objectContaining({ method: "POST" })
      );
      expect(setUsuarioSpy).toHaveBeenCalledWith(novoUsuario);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    setUsuarioSpy.mockRestore();
  });

  it("deve enviar nome, email e senha no corpo da requisição", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, nome: "João", email: "joao@teste.com" }),
    });

    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    renderRegister();
    preencherCadastro({ nome: "João", email: "joao@teste.com", senha: "abc123" });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body).toEqual({ nome: "João", email: "joao@teste.com", senha: "abc123" });
    });
  });
});

// ── CT-002: E-mail duplicado / resposta não-ok ────────────────────────────────

describe("CT-002 / CT-003 — Cadastro com erro da API", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deve exibir toast.error quando a API retorna resposta não-ok (e-mail duplicado)", async () => {
    const { toast } = require("react-toastify");
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "E-mail já cadastrado" }),
    });

    renderRegister();
    preencherCadastro({ email: "existente@teste.com" });
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao cadastrar usuário.");
    });
  });
});

// ── CT-007: Erro de rede ──────────────────────────────────────────────────────

describe("CT-007 — Erro de rede ao cadastrar", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deve exibir toast.error quando fetch lança exceção de rede", async () => {
    const { toast } = require("react-toastify");
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    renderRegister();
    preencherCadastro();
    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao cadastrar usuário.");
    });
  });
});

// ── CT-004: Login com usuário existente ───────────────────────────────────────

describe("CT-004 — Login com e-mail existente", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("deve salvar usuário e redirecionar após login válido", async () => {
    const usuarioExistente = { id: 5, nome: "Pedro", email: "pedro@mar.com" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [usuarioExistente],
    });

    const authUtils = require("../src/utils/auth");
    const setUsuarioSpy = jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    const Login = require("../src/pages/Login").default;
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
      target: { value: "pedro@mar.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "qualquersenha" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(setUsuarioSpy).toHaveBeenCalledWith(usuarioExistente);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    setUsuarioSpy.mockRestore();
  });

  it("deve exibir toast.error quando e-mail não é encontrado", async () => {
    const { toast } = require("react-toastify");
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const Login = require("../src/pages/Login").default;
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
      target: { value: "naoexiste@teste.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
      target: { value: "senha" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Usuário não encontrado.");
    });
  });
});

// ── CT-005/006: Avaliação e favorito (integração via fetch) ───────────────────

describe("CT-005 — Envio de avaliação sem login exibe alerta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseParams.mockReturnValue({ id: "1" });
    mockFetchApi
      .mockResolvedValueOnce({ id: 1, nome: "Solidão", regiao: "Sul", descricao: "...", nivel_perigo: "Verde", surf: false })
      .mockResolvedValueOnce([]);
    global.fetch = jest.fn();
  });

  it("deve exibir alerta ao tentar avaliar sem usuarioId no localStorage", async () => {
    const windowAlertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    const DetalhePraiaPage = require("../src/pages/DetalhePraia").default;
    render(<MemoryRouter initialEntries={["/praias/1"]}><DetalhePraiaPage /></MemoryRouter>);

    await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /enviar avaliação/i }));

    await waitFor(() => {
      expect(windowAlertSpy).toHaveBeenCalledWith("Faça login para avaliar.");
    });

    windowAlertSpy.mockRestore();
  });
});

describe("CT-006 — Favoritar praia sem login exibe alerta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseParams.mockReturnValue({ id: "2" });
    mockFetchApi
      .mockResolvedValueOnce({ id: 2, nome: "Campeche", regiao: "Sul", descricao: "...", nivel_perigo: "Vermelha", surf: true })
      .mockResolvedValueOnce([]);
    global.fetch = jest.fn();
  });

  it("deve exibir alerta ao tentar favoritar sem usuarioId", async () => {
    const windowAlertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    const DetalhePraiaPage = require("../src/pages/DetalhePraia").default;
    render(<MemoryRouter initialEntries={["/praias/2"]}><DetalhePraiaPage /></MemoryRouter>);

    await waitFor(() => expect(screen.queryByText("Carregando...")).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /favoritar/i }));

    await waitFor(() => {
      expect(windowAlertSpy).toHaveBeenCalledWith("Faça login para favoritar.");
    });

    windowAlertSpy.mockRestore();
  });
});