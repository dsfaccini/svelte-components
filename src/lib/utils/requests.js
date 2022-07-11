/* eslint-disable no-unused-vars */
import { browser } from '$app/env';
import { BASE_API_URL, refreshToken } from './constants';
import { objectEmpty } from './lodash';

// https://axios-http.com/docs/req_config
// https://www.sitepoint.com/axios-beginner-guide/
import axios from 'axios';

/**
 *
 * @param {string} key
 * @returns
 */
const browserGet = (key) => {
	if (browser) {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : false;
	} else return null;
};

/**
 *
 * @param {string} key
 * @returns
 */
export const browserClear = (key) => (browser ? localStorage.removeItem(key) : false);
export const browserClearJwt = () => browserClear(refreshToken);

export const browserGetJwt = () => browserGet(refreshToken);

/**
 *
 * @param {string} key
 * @param {string} value
 * @returns
 */
export const browserSet = (key, value) =>
	browser ? localStorage.setItem(key, JSON.stringify(value)) : false;

/**
 *
 * @param {string} jwtValue
 * @returns
 */
export const browserSetJwt = (jwtValue) => browserSet(refreshToken, jwtValue);

/* property with spaces
https://github.com/jsdoc/jsdoc/issues/1468 */
/**
 * @typedef 	Headers
 * @property	{string}	[Authorization]
 * @property	{string}	[`Content-Type`]
 */

/**
 *
 * @returns {Headers}
 */
const getHeaders = () => {
	const token = browserGetJwt();
	return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * @typedef     StrapiErrorResponseError
 * @property    {number}                	status
 * @property    {string}                	name
 * @property    {string}                	message
 * @property    {StrapiErrorDetails}    	details
 *
 * @typedef     StrapiErrorDetails
 * @property    {StrapiErrorDetailsError[]} errors
 *
 * @typedef     StrapiErrorDetailsError
 * @property    {string}                    message
 * @property    {string}                    name
 * @property    {string[]}                  path
 *
 * @typedef     ProcessedResponse
 * @property    {boolean}                   success
 * @property    {object}					[data]
 * @property    {StrapiErrorResponseError}  [error]
 */

/**
 * Generic post function with authentication if found
 * @param   {string}    endpoint
 * @param   {object}    body
 * @returns {Promise<ProcessedResponse>}
 */
export const post = async (endpoint, body) => {
	const url = `${BASE_API_URL}${endpoint}`;

	const headers = getHeaders();
	if (!(body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
		let response = axios.post(url, body, { headers });
		return axiosResponse(response);
	} else {
		throw new Error('body posted is form data\n TODO handle form data');
	}
};

/**
 * Generic get function with authentication if found
 * @param   {string} 	endpoint
 * @returns {Promise<ProcessedResponse>}
 */
export const get = async (endpoint) => {
	const url = `${BASE_API_URL}${endpoint}`;
	const headers = getHeaders();
	if (objectEmpty(headers)) {
		let axiosPromise = axios.get(url);
		return axiosResponse(axiosPromise);
	} else {
		return axiosResponse(axios.get(url, { headers }));
	}
};

/**
 * Generic axios request and handling of response
 * @param   {Promise<import('axios').AxiosResponse<any,any>>} 	axiosPromise
 * @returns {Promise<ProcessedResponse>}
 */
const axiosResponse = async (axiosPromise) => {
	try {
		const { data, status, statusText, headers, config, request } = await axiosPromise;
		return { success: true, data };
	} catch (error) {
		// if error is caused by a status code we still get some kind of response
		console.log(error);
		// @ts-ignore
		const { message: axiosMessage, response, request, config } = error;
		if (response) {
			const { data, status, statusText, headers } = response;
			// strapi message
			const { name, details, message: strapiMessage } = data?.error || {};
			return {
				success: false,
				error: { status, message: strapiMessage || axiosMessage, name, details }
			};
		} else {
			// if error doesn't come from status code it's a real axios error and we should throw it for the client to tell
			// @ts-ignore
			throw new Error(error);
		}
	}
};
