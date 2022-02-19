import { dev } from '$app/env';
import cookie from 'cookie';

export async function getWebsite(key: string) {
	if (dev) {
		global.websites = global.websites || {};
		return Promise.resolve(global.websites[key]);
	} else {
		return SITE_STORE.get(key);
	}
}

export async function setWebsite(key: string, html: string) {
	if (dev) {
		global.websites = global.websites || {};
		global.websites[key] = html;
		return Promise.resolve(html);
	} else {
		return SITE_STORE.put(key, html);
	}
}

export function getCookieUserId(request: Request) {
	const cookies = cookie.parse(request.headers.get('cookie'));
	return cookies['userid'];
}
