/**
 * Auth service — handles all authentication API calls.
 */
import apiClient from './apiClient';

/**
 * Log in with email and password.
 */
const login = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login/', { email, password });
        return response.data;
    } catch (err) {
        if (!err.response) {
            // Network error — server unreachable
            throw new Error(
                'Cannot reach server. Make sure Django is running with:\n' +
                'python manage.py runserver 0.0.0.0:8000'
            );
        }
        throw err;
    }
};

/**
 * Register a new account.
 */
const register = async (fullName, email, password) => {
    try {
        const response = await apiClient.post('/auth/register/', {
            full_name: fullName,
            email,
            password,
        });
        return response.data;
    } catch (err) {
        if (!err.response) {
            throw new Error(
                'Cannot reach server. Make sure Django is running with:\n' +
                'python manage.py runserver 0.0.0.0:8000'
            );
        }
        throw err;
    }
};

export default { login, register };
