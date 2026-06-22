/**
 * tests/update.spec.js
 * Testes E2E (Playwright) — UPDATE (CoastalAPI / Guia de Praias)
 *
 * Convertido a partir de tests/update.test.js (Jest + Testing Library).
 *
 * Cobre:
 *  - CT-015  Atualização de dados do usuário com sucesso
 *  - CT-016  Tentativa de acessar configurações sem estar logado
 *  - CT-017  Erro de API ao salvar configurações
 *  - CT-018  Validação de senha obrigatória no formulário de configurações
 *  - CT-019  Campos do formulário pré-preenchidos com dados do usuário logado
 *  - CT-020  Botão desabilitado durante o salvamento
 */

import { test, expect } from "@playwright/test";
import {
    mockJson,
    mockNetworkError,
    captureRequest,
    setUsuarioLogado,
    readLocalStorage,
} from "./helpers/mock-api.js";

const usuarioLogado = {
    id: 3,
    nome: "Pedro Surf",
    email: "pedro@praias.com",
};

// ── CT-015: Atualização com sucesso ─────────────────────────────────────────

test("CT-015: Atualização com sucesso - deve chamar PUT /usuarios/:id e exibir toast de sucesso", async ({ page }) => {
    await setUsuarioLogado(page, usuarioLogado);

    const usuarioAtualizado = {
        ...usuarioLogado,
        nome: "Pedro Atualizado",
    };

    await page.route(
        `http://localhost:3000/usuarios/${usuarioLogado.id}`,
        async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(usuarioAtualizado),
            });
        }
    );

    await page.goto("/configuracoes");

    await page.getByPlaceholder("Digite seu nome").fill("Pedro Atualizado");
    await page.getByPlaceholder("Digite sua senha").fill("novaSenha123");

    const requestPromise = page.waitForRequest(
        `http://localhost:3000/usuarios/${usuarioLogado.id}`
    );

    await page.getByRole("button", { name: "Salvar alterações" }).click();

    const request = await requestPromise;

    expect(request.method()).toBe("PUT");

    await expect(
        page.getByText("Configurações atualizadas com sucesso!")
    ).toBeVisible();

    const usuarioSalvo = await readLocalStorage(
        page,
        "coastalapi_usuario"
    );

    expect(JSON.parse(usuarioSalvo)).toEqual(usuarioAtualizado);
});

// ── CT-016: Sem usuário logado ───────────────────────────────────────────────

test.describe("CT-016 — Acesso a configurações sem autenticação", () => {
    test("deve exibir mensagem de acesso negado quando não há usuário logado", async ({ page }) => {
        await page.goto("/configuracoes");

        await expect(
            page.getByText(/você precisa estar logado para acessar as configurações/i)
        ).toBeVisible();
    });

    test("deve exibir link para /login quando não autenticado", async ({ page }) => {
        await page.goto("/configuracoes");

        const link = page.getByRole("link", { name: "Fazer login" });
        await expect(link).toHaveAttribute("href", "/login");
    });
});

// ── CT-017: Erro de API ao salvar ───────────────────────────────────────────

test.describe("CT-017 — Erro de API ao salvar configurações", () => {
    test("deve exibir toast de erro quando a API retorna resposta não-ok", async ({ page }) => {
        await setUsuarioLogado(page, usuarioLogado);
        await mockJson(
            page,
            `http://localhost:3000/usuarios/${usuarioLogado.id}`,
            { erro: "E-mail já em uso" },
            { status: 400 }
        );

        await page.goto("/configuracoes");
        await page.getByPlaceholder("Digite sua senha").fill("qualquerSenha");
        await page.getByRole("button", { name: "Salvar alterações" }).click();

        await expect(page.getByText("Não foi possível salvar as configurações.")).toBeVisible();
    });

    test("deve exibir toast de erro quando a requisição falha por erro de rede", async ({ page }) => {
        await setUsuarioLogado(page, usuarioLogado);
        await mockNetworkError(page, `http://localhost:3000/usuarios/${usuarioLogado.id}`);

        await page.goto("/configuracoes");
        await page.getByPlaceholder("Digite sua senha").fill("qualquerSenha");
        await page.getByRole("button", { name: "Salvar alterações" }).click();

        await expect(page.getByText("Não foi possível salvar as configurações.")).toBeVisible();
    });
});

// ── CT-018: Validação de senha obrigatória ──────────────────────────────────

test.describe("CT-018 — Validação do campo senha obrigatório", () => {
    test("campo senha deve ter atributo required", async ({ page }) => {
        await setUsuarioLogado(page, usuarioLogado);

        await page.goto("/configuracoes");

        await expect(page.getByPlaceholder("Digite sua senha")).toHaveAttribute("required", "");
    });
});

// ── CT-019: Campos pré-preenchidos ──────────────────────────────────────────

test.describe("CT-019 — Campos do formulário pré-preenchidos com dados do usuário", () => {
    test("deve preencher nome e email com os dados do usuário logado", async ({ page }) => {
        await setUsuarioLogado(page, usuarioLogado);

        await page.goto("/configuracoes");

        await expect(page.getByPlaceholder("Digite seu nome")).toHaveValue(usuarioLogado.nome);
        await expect(page.getByPlaceholder("Digite seu email")).toHaveValue(usuarioLogado.email);
    });
});

// ── CT-020: Botão desabilitado durante salvamento ───────────────────────────

test.describe("CT-020 — Botão de salvar fica desabilitado durante a requisição", () => {
    test("deve desabilitar o botão enquanto a requisição está em andamento", async ({ page }) => {
        await setUsuarioLogado(page, usuarioLogado);

        // Atrasa a resposta propositalmente para conseguir observar o estado
        // intermediário de "salvando", algo equivalente a manter a Promise do
        // fetch pendente no teste com Jest.
        await page.route(`http://localhost:3000/usuarios/${usuarioLogado.id}`, async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(usuarioLogado),
            });
        });

        await page.goto("/configuracoes");
        await page.getByPlaceholder("Digite sua senha").fill("senha123");
        await page.getByRole("button", { name: "Salvar alterações" }).click();

        const botaoSalvando = page.getByRole("button", { name: "Salvando..." });
        await expect(botaoSalvando).toBeVisible();
        await expect(botaoSalvando).toBeDisabled();
    });
});
