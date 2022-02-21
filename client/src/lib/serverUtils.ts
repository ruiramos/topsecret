/* global SITE_STORE */

import { dev } from '$app/env';
import cookie from 'cookie';

export async function getWebsite(id: string) {
	if (dev) {
		global.websites = global.websites || {};
		return Promise.resolve(global.websites[id]);
	} else {
		return SITE_STORE.get(id);
	}
}

export function getWebsiteKey(id: string) {
	if (dev) {
		global.websites = global.websites || {};
		return Promise.resolve(global.websites[id + ':key']);
	} else {
		return SITE_STORE.get(id + ':key');
	}
}

export async function setWebsite(id: string, html: string, key: string) {
	if (dev) {
		global.websites = global.websites || {};
		global.websites[id] = html;
		if (key) {
			global.websites[id + ':key'] = key;
		}
		return Promise.resolve(html);
	} else if (key) {
		return Promise.all([SITE_STORE.put(id + ':key', key), SITE_STORE.put(id, html)]);
	} else {
		return SITE_STORE.put(id, html);
	}
}

export function getCookieUserId(request: Request) {
	const cookies = cookie.parse(request.headers.get('cookie'));
	return cookies['userid'];
}

export function generateKey() {
	return (
		Math.random().toString(36).substring(2) +
		'-' +
		Math.random().toString(36).substring(2) +
		'-' +
		Math.random().toString(36).substring(2)
	);
}
