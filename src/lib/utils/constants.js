import { dev } from '$app/env';

export const BASE_API_URL = dev ? 'http://localhost:1337' : 'https://productionapi.com';
export const refreshToken = 'refreshToken';

export const registerEndpoint = '/api/auth/local/register';
export const loginEndpoint = '/api/auth/local';
export const ME_ENDPOINT = '/api/users/me';

/**
 *
 * @param {string} imgUrl
 * @returns
 */
export const imgSource = (imgUrl) => (dev ? BASE_API_URL + imgUrl : imgUrl);
