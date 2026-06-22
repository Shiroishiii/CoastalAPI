/**
 * tests/create.spec.js
 * Testes E2E (Playwright) — CREATE (CoastalAPI / Guia de Praias)
 *
 * Convertido a partir de tests/create.test.js (Jest + Testing Library).
 * Em vez de mockar módulos (jest.mock), a API é simulada interceptando as
 * requisições de rede com `page.route`, e a aplicação roda de verdade no
 * navegador.
 */

import { test, expect } from "@playwright/test";
import {
    mockJson,
    mockNetworkError,
    captureRequest,
    readLocalStorage,
} from "./helpers/mock-api.js";

// ── CT-001: Cadastro válido ────────────────────────────────────────────────

test.describe("CT-001 — Cadastro de usuário com dados válidos", () => {
    test("deve salvar usuário no localStorage e redirecionar para /home", async ({ page }) => {
        const novoUsuario = { id: 1, nome: "Maria Praia", email: "maria@teste.com" };
        await mockJson(page, "http://localhost:3000/usuarios", novoUsuario);

        await page.goto("/cadastro");
        await page.getByPlaceholder("Digite seu nome").fill("Maria Praia");
        await page.getByPlaceholder("Digite seu email").fill("maria@teste.com");
        await page.getByPlaceholder("Digite sua senha").fill("senha123");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        await expect(page).toHaveURL(/\/home$/);
        const usuarioSalvo = await readLocalStorage(page, "coastalapi_usuario");
        expect(JSON.parse(usuarioSalvo)).toEqual(novoUsuario);
    });

    test("deve enviar nome, email e senha no corpo da requisição", async ({ page }) => {
        const requisicao = await captureRequest(page, "http://localhost:3000/usuarios", {
            id: 2,
            nome: "João",
            email: "joao@teste.com",
        });

        await page.goto("/cadastro");
        await page.getByPlaceholder("Digite seu nome").fill("João");
        await page.getByPlaceholder("Digite seu email").fill("joao@teste.com");
        await page.getByPlaceholder("Digite sua senha").fill("abc123");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        await expect(page).toHaveURL(/\/home$/);
        expect(requisicao.method).toBe("POST");
        expect(requisicao.body).toEqual({
            nome: "João",
            email: "joao@teste.com",
            senha: "abc123",
        });
    });
});

// ── CT-002 / CT-003: E-mail duplicado / resposta não-ok ────────────────────

test.describe("CT-002 / CT-003 — Cadastro com erro da API", () => {
    test("deve exibir toast de erro quando a API retorna resposta não-ok (e-mail duplicado)", async ({ page }) => {
        await mockJson(
            page,
            "http://localhost:3000/usuarios",
            { message: "E-mail já cadastrado" },
            { status: 400 }
        );

        await page.goto("/cadastro");
        await page.getByPlaceholder("Digite seu nome").fill("Maria Praia");
        await page.getByPlaceholder("Digite seu email").fill("existente@teste.com");
        await page.getByPlaceholder("Digite sua senha").fill("senha123");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        await expect(page.getByText("Erro ao cadastrar usuário.")).toBeVisible();
        await expect(page).toHaveURL(/\/cadastro$/);
    });
});

// ── CT-007: Erro de rede ────────────────────────────────────────────────────

test.describe("CT-007 — Erro de rede ao cadastrar", () => {
    test("deve exibir toast de erro quando a requisição falha por erro de rede", async ({ page }) => {
        await mockNetworkError(page, "http://localhost:3000/usuarios");

        await page.goto("/cadastro");
        await page.getByPlaceholder("Digite seu nome").fill("Maria Praia");
        await page.getByPlaceholder("Digite seu email").fill("maria@teste.com");
        await page.getByPlaceholder("Digite sua senha").fill("senha123");
        await page.getByRole("button", { name: "Cadastrar" }).click();

        await expect(page.getByText("Erro ao cadastrar usuário.")).toBeVisible();
    });
});

// ── CT-004: Login com e-mail existente ──────────────────────────────────────

test.describe("CT-004 — Login com e-mail existente", () => {
    test("deve salvar usuário e redirecionar após login válido", async ({ page }) => {
        const usuarioExistente = { id: 5, nome: "Pedro", email: "pedro@mar.com" };
        await mockJson(page, "http://localhost:3000/usuarios", [usuarioExistente]);

        await page.goto("/login");
        await page.getByPlaceholder("Digite seu email").fill("pedro@mar.com");
        await page.getByPlaceholder("Digite sua senha").fill("qualquersenha");
        await page.getByRole("button", { name: "Entrar" }).click();

        await expect(page).toHaveURL(/\/home$/);
        const usuarioSalvo = await readLocalStorage(page, "coastalapi_usuario");
        expect(JSON.parse(usuarioSalvo)).toEqual(usuarioExistente);
        expect(await readLocalStorage(page, "usuarioId")).toBe(String(usuarioExistente.id));
    });

    test("deve exibir toast de erro quando e-mail não é encontrado", async ({ page }) => {
        await mockJson(page, "http://localhost:3000/usuarios", []);

        await page.goto("/login");
        await page.getByPlaceholder("Digite seu email").fill("naoexiste@teste.com");
        await page.getByPlaceholder("Digite sua senha").fill("senha");
        await page.getByRole("button", { name: "Entrar" }).click();

        await expect(page.getByText("Usuário não encontrado.")).toBeVisible();
        await expect(page).toHaveURL(/\/login$/);
    });
});

// ── CT-005 / CT-006: Ações que exigem login (avaliar / favoritar) ──────────

test.describe("CT-005 — Envio de avaliação sem login exibe alerta", () => {
    test("deve exibir alerta ao tentar avaliar sem usuário logado", async ({ page }) => {
        await mockJson(page, "**/api/praias/1", {
            id: 1,
            nome: "Solidão",
            regiao: "Sul",
            descricao: "...",
            nivel_perigo: "Verde",
            surf: false,
        });
        await mockJson(page, "**/api/avaliacoes/praia/1", []);

        let mensagemAlerta = null;
        page.once("dialog", async (dialog) => {
            mensagemAlerta = dialog.message();
            await dialog.dismiss();
        });

        await page.goto("/praias/1");
        await expect(page.getByText("Solidão")).toBeVisible();

        await page.getByRole("button", { name: "Enviar Avaliação" }).click();

        await expect.poll(() => mensagemAlerta).toBe("Faça login para avaliar.");
    });
});

test.describe("CT-006 — Favoritar praia sem login exibe alerta", () => {
    test("deve exibir alerta ao tentar favoritar sem usuário logado", async ({ page }) => {
        await mockJson(page, "**/api/praias/2", {
            id: 2,
            nome: "Campeche",
            regiao: "Sul",
            descricao: "...",
            nivel_perigo: "Vermelha",
            surf: true,
        });
        await mockJson(page, "**/api/avaliacoes/praia/2", []);

        let mensagemAlerta = null;
        page.once("dialog", async (dialog) => {
            mensagemAlerta = dialog.message();
            await dialog.dismiss();
        });

        await page.goto("/praias/2");
        await expect(page.getByText("Campeche")).toBeVisible();

        await page.getByRole("button", { name: "Favoritar" }).click();

        await expect.poll(() => mensagemAlerta).toBe("Faça login para favoritar.");
    });
});
