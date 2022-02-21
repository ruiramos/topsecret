import type { RequestHandler } from '@sveltejs/kit';
import { getWebsite, setWebsite, getCookieUserId } from '$lib/serverUtils';

// POST /lock.json
export const post: RequestHandler = async (event) => {
	const { siteId } = await event.request.json();
	const userId = getCookieUserId(event.request);

	if (!siteId) {
		return {
			status: 400,
			body: { error: { message: 'no siteId sent' } }
		};
	}

	if (!userId) {
		return {
			status: 400,
			body: { error: { message: 'couldnt find your user' } }
		};
	}

	const content = await getWebsite(siteId);

	if (content && content !== `lock-${userId}`) {
		return {
			status: 403,
			body: { error: { message: 'argh that site is taken try again thx' } }
		};
	}

	await setWebsite(siteId, `lock-${userId}`);

	return {
		status: 200,
		body: { result: 'ok' }
	};
};
