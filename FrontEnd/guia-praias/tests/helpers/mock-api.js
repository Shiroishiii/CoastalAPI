/**
 * tests/helpers/mock-api.js
 *
 * Helpers para os testes E2E (Playwright) do Guia de Praias.
 *
 * Nos testes antigos (Jest + Testing Library) o backend era simulado com
 * `jest.mock("../src/utils/api")`, `global.fetch = jest.fn()` e
 * `jest.spyOn(authUtils, ...)`. Em Playwright não mockamos módulos JS: a
 * aplicação roda de verdade no navegador, então simulamos a API
 * interceptando as requisições de rede (`page.route`) e simulamos o usuário
 * logado escrevendo diretamente no localStorage antes da página carregar
 * (`page.addInitScript`), que é o mesmo storage usado por `src/utils/auth.js`.
 */

const AUTH_STORAGE_KEY = "coastalapi_usuario";

/**
 * Intercepta uma rota e responde sempre com o mesmo corpo JSON.
 * Equivalente a `mockFetchApi.mockResolvedValue(data)` / `global.fetch = jest.fn().mockResolvedValueOnce(...)`.
 */
export async function mockJson(page, urlPattern, body, { status = 200 } = {}) {
    await page.route(urlPattern, async (route) => {
        await route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify(body),
        });
    });
}

/**
 * Intercepta uma rota e força uma falha de rede (equivalente a
 * `global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"))`).
 */
export async function mockNetworkError(page, urlPattern) {
    await page.route(urlPattern, (route) => route.abort("failed"));
}

/**
 * Intercepta uma rota, guarda o corpo (JSON) enviado na requisição e responde
 * com `responseBody`. Use `capture.body` depois da ação para validar o que
 * foi enviado (equivalente a inspecionar `global.fetch.mock.calls`).
 */
export async function captureRequest(page, urlPattern, responseBody = {}, { status = 200 } = {}) {
    const capture = { body: undefined, method: undefined, url: undefined };

    await page.route(urlPattern, async (route) => {
        const request = route.request();
        capture.method = request.method();
        capture.url = request.url();
        capture.body = request.postDataJSON();

        await route.fulfill({
            status,
            contentType: "application/json",
            body: JSON.stringify(responseBody),
        });
    });

    return capture;
}

/**
 * Simula um usuário já autenticado, como `setUsuario(usuario)` faria.
 * Precisa ser chamado ANTES de `page.goto`.
 */
export async function setUsuarioLogado(page, usuario) {
    await page.addInitScript(
        ([key, usuarioJson]) => window.localStorage.setItem(key, usuarioJson),
        [AUTH_STORAGE_KEY, JSON.stringify(usuario)]
    );
}

/**
 * Simula o "usuarioId" salvo separadamente no localStorage (usado por
 * DetalhePraia e Header para saber se há alguém logado).
 * Precisa ser chamado ANTES de `page.goto`.
 */
export async function setUsuarioId(page, id) {
    await page.addInitScript(
        (idStr) => window.localStorage.setItem("usuarioId", idStr),
        String(id)
    );
}

/** Lê um valor do localStorage da página já carregada. */
export function readLocalStorage(page, key) {
    return page.evaluate((k) => window.localStorage.getItem(k), key);
}

export { AUTH_STORAGE_KEY };
