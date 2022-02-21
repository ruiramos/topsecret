import { getWebsite } from '$lib/serverUtils';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
	const id = params.id;

	const site = await getWebsite(id);

	if (site && site.indexOf('lock-') !== 0) {
		return {
			body: { site: encodeURIComponent(site) }
		};
	} else {
		return {
			status: 404
		};
	}
}
