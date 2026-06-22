/**
 * tests/delete.spec.js
 * Testes E2E (Playwright) — DELETE (CoastalAPI / Guia de Praias)
 *
 * Convertido a partir de tests/delete.test.js (Jest + Testing Library).
 */

import { test, expect } from "@playwright/test";
import { mockJson, mockNetworkError, captureRequest, setUsuarioId } from "./helpers/mock-api.js";

const praiaData = {
    id: 5,
    nome: "Barra da Lagoa",
    regiao: "Leste",
    descricao: "Praia com canal.",
    nivel_perigo: "Verde",
    surf: false,
};

async function mockDetalhePraia(page, { favoritado, usuarioId = "10" } = {}) {
    await mockJson(page, "**/api/praias/5", praiaData);
    await mockJson(page, "**/api/avaliacoes/praia/5", []);
    if (favoritado !== undefined) {
        await mockJson(page, `**/api/favoritos/verificar/${usuarioId}/5`, { favoritado });
    }
}

// ── CT-021: Remoção de favorito com sucesso ─────────────────────────────────

test.describe("CT-021 — Remoção de favorito com sucesso", () => {
    test.beforeEach(async ({ page }) => {
        await setUsuarioId(page, "10");
    });

    test("deve chamar DELETE /api/favoritos quando praia está favoritada e usuário clica no botão", async ({ page }) => {
        await mockDetalhePraia(page, { favoritado: true });
        const requisicao = await captureRequest(page, "**/api/favoritos", {});

        await page.goto("/praias/5");
        await page.getByRole("button", { name: "Favoritada" }).click();

        await expect.poll(() => requisicao.method).toBe("DELETE");
    });

    test("deve enviar usuario_id e praia_id corretos no corpo do DELETE", async ({ page }) => {
        await mockDetalhePraia(page, { favoritado: true });
        const requisicao = await captureRequest(page, "**/api/favoritos", {});

        await page.goto("/praias/5");
        await page.getByRole("button", { name: "Favoritada" }).click();

        await expect.poll(() => requisicao.body).toEqual({ usuario_id: 10, praia_id: 5 });
    });
});

// ── CT-022: Desfavoritar sem login ──────────────────────────────────────────

test.describe("CT-022 — Tentativa de alterar favorito sem usuário logado", () => {
    test("deve exibir alerta pedindo login ao tentar favoritar sem autenticação", async ({ page }) => {
        await mockJson(page, "**/api/praias/5", {
            id: 5, nome: "Solidão", regiao: "Sul", descricao: "Praia isolada.", nivel_perigo: "Verde", surf: false,
        });
        await mockJson(page, "**/api/avaliacoes/praia/5", []);

        let mensagemAlerta = null;
        page.once("dialog", async (dialog) => {
            mensagemAlerta = dialog.message();
            await dialog.dismiss();
        });

        await page.goto("/praias/5");
        await page.getByRole("button", { name: "Favoritar" }).click();

        await expect.poll(() => mensagemAlerta).toBe("Faça login para favoritar.");
    });
});

// ── CT-023: Erro de API ao remover favorito ─────────────────────────────────

test.describe("CT-023 — Erro de API ao tentar remover favorito", () => {
    test.beforeEach(async ({ page }) => {
        await setUsuarioId(page, "10");
    });

    test("deve lidar com erro silenciosamente (sem crash) quando DELETE falha", async ({ page }) => {
        await mockDetalhePraia(page, { favoritado: true });
        await mockNetworkError(page, "**/api/favoritos");

        const consoleErrors = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
        });
        const errosPagina = [];
        page.on("pageerror", (err) => errosPagina.push(err));

        await page.goto("/praias/5");
        const botaoFavorito = page.getByRole("button", { name: "Favoritada" });
        await botaoFavorito.click();

        await expect.poll(() => consoleErrors.length).toBeGreaterThan(0);
        expect(errosPagina).toHaveLength(0);
        // a aplicação não deve travar: o botão continua visível e renderizado
        await expect(botaoFavorito).toBeVisible();
    });
});

// ── CT-024: Toggle de favorito (remoção) ────────────────────────────────────

test.describe("CT-024 — Toggle de favorito: de favoritado para não-favoritado", () => {
    test.beforeEach(async ({ page }) => {
        await setUsuarioId(page, "10");
    });

    test("deve alterar texto do botão de 'Favoritada' para 'Favoritar' após remover", async ({ page }) => {
        await mockDetalhePraia(page, { favoritado: true });
        await mockJson(page, "**/api/favoritos", {});

        await page.goto("/praias/5");
        await page.getByRole("button", { name: "Favoritada" }).click();

        await expect(page.getByRole("button", { name: "Favoritar", exact: true })).toBeVisible();
    });
});

// ── CT-025: Toggle de favorito (adição) ─────────────────────────────────────

test.describe("CT-025 — Toggle de favorito: de não-favoritado para favoritado", () => {
    test.beforeEach(async ({ page }) => {
        await setUsuarioId(page, "10");
    });

    test("deve alterar texto do botão de 'Favoritar' para 'Favoritada' após adicionar", async ({ page }) => {
        await mockDetalhePraia(page, { favoritado: false });
        await mockJson(page, "**/api/favoritos", {});

        await page.goto("/praias/5");
        await page.getByRole("button", { name: "Favoritar", exact: true }).click();

        await expect(page.getByRole("button", { name: "Favoritada" })).toBeVisible();
    });
});
