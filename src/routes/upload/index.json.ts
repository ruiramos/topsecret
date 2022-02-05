import type { RequestHandler } from '@sveltejs/kit';

const baseUrl = 'http://localhost:3000';

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

	const id = data.get('id') as string;
	const file = data.get('file') as File;

	const contents = await file.text();

	console.log(contents, id);

	global.websites = global.websites || {};

	if (global.websites[id]) {
		return {
			status: 403,
			body: {
				error: { code: 'page_taken', message: 'argh that site is taken try again thx' }
			}
		};
	}

	global.websites[id] = contents;

	return {
		status: 200,
		body: { result: 'ok' }
	};
};
