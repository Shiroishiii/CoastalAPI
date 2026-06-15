const STORAGE_KEY = "coastalapi_usuario";

export function getUsuario() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function setUsuario(usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
}
