
const fetchWithToken = async (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem('token');
    const headers = new Headers(init?.headers);
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    headers.append('Accept', 'application/json');
    const requestInit: RequestInit = {
        ...init,
        headers,
    };
    return fetch(input, requestInit);
}

export default fetchWithToken;

