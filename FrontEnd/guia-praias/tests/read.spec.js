/**
 * tests/read.spec.js
 * Testes E2E (Playwright) — READ (CoastalAPI / Guia de Praias)
 *
 * Convertido a partir de tests/read.test.js (Jest + Testing Library).
 */

import { test, expect } from "@playwright/test";
import { mockJson, setUsuarioLogado, setUsuarioId } from "./helpers/mock-api.js";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const praiasMock = [
    { id: 1, nome: "Jurerê Internacional", regiao: "Norte", descricao: "Praia sofisticada.", nivel_perigo: "Verde", surf: false },
    { id: 2, nome: "Campeche", regiao: "Sul", descricao: "Praia extensa.", nivel_perigo: "Vermelha", surf: true },
    { id: 3, nome: "Joaquina", regiao: "Leste", descricao: "Famosa pelas dunas.", nivel_perigo: "Amarela", surf: true },
];

const usuariosMock = [
    { id: 1, nome: "João", email: "joao@praia.com" },
    { id: 2, nome: "Maria", email: "maria@praia.com" },
];

// ── CT-008: Listagem de praias com sucesso ──────────────────────────────────

test.describe("CT-008 — Listagem de praias retorna registros", () => {
    test.beforeEach(async ({ page }) => {
        await mockJson(page, "**/api/praias", praiasMock);
    });

    test("deve renderizar os cards de praias retornadas pela API", async ({ page }) => {
        await page.goto("/praias");

        await expect(page.getByText("Jurerê Internacional")).toBeVisible();
        await expect(page.getByText("Campeche")).toBeVisible();
        await expect(page.getByText("Joaquina")).toBeVisible();
    });

    test("deve exibir o contador de praias encontradas", async ({ page }) => {
        await page.goto("/praias");

        await expect(page.getByText(/3 praias encontradas/i)).toBeVisible();
    });
});

// ── CT-009: Lista vazia ──────────────────────────────────────────────────────

test.describe("CT-009 — Listagem retorna array vazio", () => {
    test("deve exibir 'Nenhuma praia encontrada' quando API retorna []", async ({ page }) => {
        await mockJson(page, "**/api/praias", []);

        await page.goto("/praias");

        await expect(page.getByText(/nenhuma praia encontrada/i)).toBeVisible();
    });
});

// ── CT-010: Erro ao carregar ─────────────────────────────────────────────────

test.describe("CT-010 — Erro ao carregar praias da API", () => {
    test("deve exibir mensagem de erro quando a API responde com falha", async ({ page }) => {
        await mockJson(page, "**/api/praias", {}, { status: 500 });

        await page.goto("/praias");

        await expect(page.getByText(/erro ao buscar dados da api/i)).toBeVisible();
    });

    test("deve exibir dica sobre o backend quando houver erro", async ({ page }) => {
        await mockJson(page, "**/api/praias", {}, { status: 500 });

        await page.goto("/praias");

        await expect(page.getByText(/verifique se o backend está rodando/i)).toBeVisible();
    });
});

// ── CT-011: Filtragem por nome ───────────────────────────────────────────────

test.describe("CT-011 — Busca/filtragem de praias por nome", () => {
    test.beforeEach(async ({ page }) => {
        await mockJson(page, "**/api/praias", praiasMock);
    });

    test("deve filtrar resultados conforme texto digitado", async ({ page }) => {
        await page.goto("/praias");
        await expect(page.getByText("Jurerê Internacional")).toBeVisible();

        await page.getByPlaceholder("Buscar praia...").fill("cam");

        await expect(page.getByText("Campeche")).toBeVisible();
        await expect(page.getByText("Jurerê Internacional")).not.toBeVisible();
        await expect(page.getByText("Joaquina")).not.toBeVisible();
    });

    test("deve exibir 'Nenhuma praia encontrada' quando busca não tem resultado", async ({ page }) => {
        await page.goto("/praias");
        await expect(page.getByText("Campeche")).toBeVisible();

        await page.getByPlaceholder("Buscar praia...").fill("zzz");

        await expect(page.getByText(/nenhuma praia encontrada/i)).toBeVisible();
    });
});

// ── CT-012: Dashboard com estatísticas ──────────────────────────────────────

test.describe("CT-012 — Dashboard exibe estatísticas corretas", () => {
    test("deve exibir o total de praias e usuários", async ({ page }) => {
        await mockJson(page, "**/api/praias", praiasMock);
        await mockJson(page, "**/api/usuarios", usuariosMock);

        await page.goto("/dashboard");

        const cardPraias = page.getByText("Total de praias", { exact: true }).locator("xpath=..");
        const cardUsuarios = page.getByText("Usuários", { exact: true }).locator("xpath=..");

        await expect(cardPraias.getByText("3", { exact: true })).toBeVisible();
        await expect(cardUsuarios.getByText("2", { exact: true })).toBeVisible();
    });
});

// ── CT-013: Detalhe de praia ─────────────────────────────────────────────────

test.describe("CT-013 — Detalhe de praia exibe informações e avaliações", () => {
    test.beforeEach(async ({ page }) => {
        await setUsuarioId(page, "1");
    });

    test("deve exibir nome, região e nível de perigo da praia", async ({ page }) => {
        await mockJson(page, "**/api/praias/1", {
            id: 1, nome: "Joaquina", regiao: "Leste", descricao: "Famosa.", nivel_perigo: "Amarela", surf: true,
        });
        await mockJson(page, "**/api/avaliacoes/praia/1", [
            { id: 10, nota: 5, comentario: "Incrível!", usuario: "João" },
        ]);
        await mockJson(page, "**/api/favoritos/verificar/1/1", { favoritado: false });

        await page.goto("/praias/1");

        await expect(page.getByRole("heading", { name: "Joaquina", level: 1 })).toBeVisible();
        await expect(page.getByText("Leste").first()).toBeVisible();
        await expect(page.getByText("Amarela")).toBeVisible();
    });

    test("deve exibir avaliações carregadas da API", async ({ page }) => {
        await mockJson(page, "**/api/praias/1", {
            id: 1, nome: "Joaquina", regiao: "Leste", descricao: "...", nivel_perigo: "Amarela", surf: true,
        });
        await mockJson(page, "**/api/avaliacoes/praia/1", [
            { id: 10, nota: 5, comentario: "Incrível!", usuario: "João" },
        ]);
        await mockJson(page, "**/api/favoritos/verificar/1/1", { favoritado: false });

        await page.goto("/praias/1");

        await expect(page.getByText("Incrível!")).toBeVisible();
        await expect(page.getByText("João")).toBeVisible();
    });

    test("deve exibir 'Nenhuma avaliação ainda' quando não há avaliações", async ({ page }) => {
        await mockJson(page, "**/api/praias/2", {
            id: 2, nome: "Solidão", regiao: "Sul", descricao: "...", nivel_perigo: "Verde", surf: false,
        });
        await mockJson(page, "**/api/avaliacoes/praia/2", []);
        await mockJson(page, "**/api/favoritos/verificar/1/2", { favoritado: false });

        await page.goto("/praias/2");

        await expect(page.getByText(/nenhuma avaliação ainda/i)).toBeVisible();
    });
});

// ── CT-014: Listagem de favoritos ────────────────────────────────────────────

test.describe("CT-014 — Listagem de favoritos do usuário", () => {
    test("deve exibir praias favoritas quando usuário está logado", async ({ page }) => {
        const usuario = { id: 7, nome: "Surfista", email: "surf@praia.com" };
        await setUsuarioLogado(page, usuario);
        await mockJson(page, `http://localhost:3000/favoritos/usuario/${usuario.id}`, [
            { id: 1, nome: "Jurerê Internacional", regiao: "Norte", nivel_perigo: "Verde" },
            { id: 2, nome: "Campeche", regiao: "Sul", nivel_perigo: "Vermelha" },
        ]);

        await page.goto("/favoritos");

        await expect(page.getByText("Jurerê Internacional")).toBeVisible();
        await expect(page.getByText("Campeche")).toBeVisible();
    });

    test("deve pedir login quando não há usuário autenticado", async ({ page }) => {
        await page.goto("/favoritos");

        await expect(
            page.getByText(/faça login para ver e gerenciar seus favoritos/i)
        ).toBeVisible();
    });

    test("deve exibir mensagem quando lista de favoritos está vazia", async ({ page }) => {
        const usuario = { id: 7, nome: "Surfista", email: "surf@praia.com" };
        await setUsuarioLogado(page, usuario);
        await mockJson(page, `http://localhost:3000/favoritos/usuario/${usuario.id}`, []);

        await page.goto("/favoritos");

        await expect(
            page.getByText(/você ainda não salvou nenhuma praia nos favoritos/i)
        ).toBeVisible();
    });
});
