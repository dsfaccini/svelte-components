// @ts-nocheck
export const objectEmpty = (o) => {
	if (o) {
		try {
			return Object.keys(o).length === 0;
		} catch (err) {
			return true;
		}
	} else {
		return true;
	}
};

export const oe = (o) => Object.entries(o);
export const ov = (o) => Object.values(o);
export const oK = (o) => Object.keys(o);

/**
 *
 * @param {string} x
 */
export const lower_no_spaces = (x) =>
	typeof x === 'string' ? x.toLowerCase().replace(' ', '') : x;
