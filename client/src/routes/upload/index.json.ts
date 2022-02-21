import type { RequestHandler } from '@sveltejs/kit';
import {
	getWebsite,
	getWebsiteKey,
	setWebsite,
	getCookieUserId,
	generateKey
} from '$lib/serverUtils';

// POST /upload.json
// creates a new site
export const post: RequestHandler = async (event) => {
	const data = await event.request.formData();

	if (!data.has('contents') || !data.has('id')) {
		console.error('No contents or id found', Array.from(data.entries()));
		return {
			status: 500,
			body: 'Need some contents and a page id'
		};
	}

	const userId = getCookieUserId(event.request);

	if (!userId) {
		return {
			status: 400,
			body: { error: { message: 'couldnt find your user' } }
		};
	}

	const id = data.get('id') as string;
	const contents = data.get('contents') as string;

	const current = await getWebsite(id);

	if (current && current !== `lock-${userId}`) {
		return {
			status: 403,
			body: {
				error: { code: 'page_taken', message: 'argh that site is taken try again thx' }
			}
		};
	}

	const key = generateKey();
	await setWebsite(id, contents, key);

	return {
		status: 200,
		body: { key, id }
	};
};

// PUT /upload.json
// updates a site
export const put: RequestHandler = async (event) => {
	const data = await event.request.formData();

	if (!data.has('contents') || !data.has('id')) {
		console.error('No content or id found', Array.from(data.entries()));
		return {
			status: 500,
			body: 'Need new content and a page id'
		};
	}

	const id = data.get('id') as string;
	const contents = data.get('contents') as string;
	const key = data.get('key') as string;

	const siteKey = await getWebsiteKey(id);

	if (siteKey === key || !siteKey) {
		await setWebsite(id, contents, key);
		return {
			status: 200,
			body: { result: 'ok' }
		};
	} else {
		return {
			status: 403,
			body: { error: { message: 'forbidden - site needs a key' } }
		};
	}
};
