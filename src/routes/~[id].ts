import { getWebsite } from '$lib/utils';
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
	const id = params.id;

	const site = await getWebsite(id);

	if (site) {
		return {
			body: site,
			headers: {
				'content-type': 'text/html'
			}
		};
	} else {
		return {
			status: 404,
			body: 'Not found',
			headers: {
				'content-type': 'text/html'
			}
		};
	}
}
