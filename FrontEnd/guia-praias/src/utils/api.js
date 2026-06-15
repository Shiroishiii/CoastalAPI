export const API_URL = import.meta.env.DEV
    ? "/api"
    : "http://localhost:3000";

export async function fetchApi(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.erro ?? "Erro ao buscar dados da API");
    }

    const data = await response.json();

    if (!Array.isArray(data) && data?.erro) {
        throw new Error(data.erro);
    }

    return data;
}
