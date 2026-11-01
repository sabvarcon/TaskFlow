
const API_URL = '/api';

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('taskflow_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.mensaje || data.error || 'Ocurrió un error'
        );
    }

    return data;
}
