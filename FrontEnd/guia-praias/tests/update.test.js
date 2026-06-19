/**
 * update.test.js
 * Testes unitários para operações de atualização (UPDATE) — CoastalAPI / Guia de Praias
 *
 * Cobre:
 *  - CT-015  Atualização de dados do usuário com sucesso
 *  - CT-016  Tentativa de salvar configurações sem estar logado
 *  - CT-017  Erro de API ao salvar configurações
 *  - CT-018  Validação de senha obrigatória no formulário de configurações
 *  - CT-019  Campos do formulário pré-preenchidos com dados do usuário logado
 *  - CT-020  Botão desabilitado durante o salvamento
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks globais ──────────────────────────────────────────────────────────────

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => null,
}));

jest.mock("../src/components/DashboardLayout", () =>
  ({ children, title, subtitle }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  )
);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// ── Fixtures ───────────────────────────────────────────────────────────────────

const usuarioLogado = {
  id: 3,
  nome: "Pedro Surf",
  email: "pedro@praias.com",
};

function renderConfiguracoes() {
  const Configuracoes = require("../src/pages/Configuracoes").default;
  return render(
    <MemoryRouter>
      <Configuracoes />
    </MemoryRouter>
  );
}

// ── CT-015: Atualização com sucesso ───────────────────────────────────────────

describe("CT-015 — Atualização de dados do usuário com sucesso", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar PUT /usuarios/:id e exibir toast de sucesso", async () => {
    const { toast } = require("react-toastify");
    const authUtils = require("../src/utils/auth");

    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);
    const setUsuarioSpy = jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    const usuarioAtualizado = { ...usuarioLogado, nome: "Pedro Atualizado" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => usuarioAtualizado,
    });

    renderConfiguracoes();

    const inputNome = screen.getByPlaceholderText("Digite seu nome");
    fireEvent.change(inputNome, { target: { value: "Pedro Atualizado" } });

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(inputSenha, { target: { value: "novaSenha123" } });

    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/usuarios/${usuarioLogado.id}`,
        expect.objectContaining({
          method: "PUT",
          body: expect.stringContaining("Pedro Atualizado"),
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Configurações atualizadas com sucesso!"
      );
      expect(setUsuarioSpy).toHaveBeenCalledWith(usuarioAtualizado);
    });
  });

  it("deve limpar o campo senha após salvar com sucesso", async () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);
    jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => usuarioLogado,
    });

    renderConfiguracoes();

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(inputSenha, { target: { value: "senha123" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(inputSenha.value).toBe("");
    });
  });
});

// ── CT-016: Sem usuário logado ────────────────────────────────────────────────

describe("CT-016 — Acesso a configurações sem autenticação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir mensagem de acesso negado quando não há usuário logado", () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(null);

    renderConfiguracoes();

    expect(
      screen.getByText(/você precisa estar logado para acessar as configurações/i)
    ).toBeInTheDocument();
  });

  it("deve exibir link para /login quando não autenticado", () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(null);

    renderConfiguracoes();

    const link = screen.getByRole("link", { name: /fazer login/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});

// ── CT-017: Erro de API ao salvar ─────────────────────────────────────────────

describe("CT-017 — Erro de API ao salvar configurações", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore?.();
  });

  it("deve exibir toast.error quando a API retorna resposta não-ok", async () => {
    const { toast } = require("react-toastify");
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ erro: "E-mail já em uso" }),
    });

    renderConfiguracoes();

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(inputSenha, { target: { value: "qualquerSenha" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível salvar as configurações."
      );
    });
  });

  it("deve exibir toast.error quando fetch lança exceção de rede", async () => {
    const { toast } = require("react-toastify");
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);

    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));

    renderConfiguracoes();

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(inputSenha, { target: { value: "qualquerSenha" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível salvar as configurações."
      );
    });
  });
});

// ── CT-018: Validação de senha obrigatória ────────────────────────────────────

describe("CT-018 — Validação do campo senha obrigatório", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("campo senha deve ter atributo required", () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);

    renderConfiguracoes();

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    expect(inputSenha).toBeRequired();
  });
});

// ── CT-019: Campos pré-preenchidos ────────────────────────────────────────────

describe("CT-019 — Campos do formulário pré-preenchidos com dados do usuário", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve preencher nome e email com os dados do usuário logado", () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);

    renderConfiguracoes();

    expect(screen.getByPlaceholderText("Digite seu nome").value).toBe(
      usuarioLogado.nome
    );
    expect(screen.getByPlaceholderText("Digite seu email").value).toBe(
      usuarioLogado.email
    );
  });
});

// ── CT-020: Botão desabilitado durante salvamento ─────────────────────────────

describe("CT-020 — Botão de salvar fica desabilitado durante requisição", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve desabilitar o botão enquanto a requisição está em andamento", async () => {
    const authUtils = require("../src/utils/auth");
    jest.spyOn(authUtils, "getUsuario").mockReturnValue(usuarioLogado);
    jest.spyOn(authUtils, "setUsuario").mockImplementation(() => {});

    let resolveFetch;
    global.fetch = jest.fn().mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    renderConfiguracoes();

    const inputSenha = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.change(inputSenha, { target: { value: "senha123" } });

    const btnSalvar = screen.getByRole("button", { name: /salvar alterações/i });
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /salvando/i })).toBeDisabled();
    });

    resolveFetch({ ok: true, json: async () => usuarioLogado });
  });
});
