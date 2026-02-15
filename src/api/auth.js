async function request(path, options = {}) {
    const res = await fetch(path, {
        credentials: "include", // Passing Cookies
        ...options,
        headers: {
            "Content-Type" : "application/json",
            ...(options.headers || {}),
        },
    });

    const data = await res.json().catch(() => null);

    // Error messages from backend
    if (!res.ok) {
        const message = data?.error || `Request failed (${res.status})`;
        throw new Error(message);

    }

    return data;

}

// CRUD Ops from backend
export const authApi = {
    register: (username, email, password) =>
        request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        }),

    login: (email, password) =>
        request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),
    
    me: () => request ("/api/auth/me"),

    logout: () =>
        request("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({}),
        }),
};
