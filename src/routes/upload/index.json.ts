import type { RequestHandler } from '@sveltejs/kit';
import { getWebsite, setWebsite, getCookieUserId } from '$lib/serverUtils';

// POST /upload.json
export const post: RequestHandler = async (event) => {
	const data = await event.request.formData();

	if (!data.has('file') || !data.has('id')) {
		console.error('No file or id found', Array.from(data.entries()));
		return {
			status: 500,
			body: 'Need a file and a page id'
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
	const file = data.get('file') as File;

	const contents = await file.text();

	const current = await getWebsite(id);

	if (current && current !== `lock-${userId}`) {
		return {
			status: 403,
			body: {
				error: { code: 'page_taken', message: 'argh that site is taken try again thx' }
			}
		};
	}

	await setWebsite(id, contents);

	return {
		status: 200,
		body: { result: 'ok' }
	};
};

// PUT /upload.json
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
	const contents = data.get('contents') as File;

	await setWebsite(id, contents);

	return {
		status: 200,
		body: { result: 'ok' }
	};
};
