import { browserGetJwt } from '$lib/utils/requests';
import { writable } from 'svelte/store';
// import rangeItems from './range-items';

export const 
jwtStore = writable(browserGetJwt()),
userStore = writable({}),
giftshopStore = writable({}),
productModalOpen = writable({ open: false, id: 0 });

/**
 *
 * @param {KeyboardEvent} 	e
 * @param {function}		closeFunc
 */
 export const closeOnEscape = (e, closeFunc) => {
	if (e.key === 'Escape') {
		closeFunc();
	}
};
