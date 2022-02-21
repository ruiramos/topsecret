export function validateDrop(ev: DragEvent): File {
	if (!ev.dataTransfer.items) {
		throw new Error('No files found');
	}

	if (ev.dataTransfer.items.length !== 1) {
		throw new Error('Sorry we can only take 1 file');
	}

	const item = ev.dataTransfer.items[0];

	if (item.kind !== 'file') {
		throw new Error('Whatever you dragged in was not a file');
	}

	const file = item.getAsFile();
	console.log(file);

	const ext = file.name.slice(file.name.lastIndexOf('.') + 1);

	if (ext !== 'html' || file.type !== 'text/html') {
		throw new Error(
			`We can only take html files! (got name: ${file.name}, type: ${file.type || '?'})`
		);
	}

	return file;
}

export async function uploadSite(contents: File, id: string) {
	const data = new FormData();
	data.append('contents', contents);
	data.append('id', id);

	return fetch('/upload.json', {
		method: 'POST',
		body: data
	});
}

export async function validateLockSiteId(siteId: string) {
	return fetch('/lock.json', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ siteId })
	});
}

export async function updateSite(contents: string, id: string) {
	const data = new FormData();
	data.append('contents', contents);
	data.append('id', id);

	const key = getLocalWebsiteKey(id);

	if (key) {
		data.append('key', key);
	}

	return fetch('/upload.json', {
		method: 'PUT',
		body: data
	});
}

export async function generateSiteId() {
	const newId = Math.random().toString(36).substring(2, 9);
	return validateLockSiteId(newId).then((res) => {
		if (res.status === 200) return newId;
		return generateSiteId();
	});
}

export function updateLocalStorage(id, key) {
	let sites;
	try {
		sites = JSON.parse(window.localStorage.getItem('sites')) || {};
	} catch (e) {
		sites = {};
	}
	sites[id] = { key };

	console.log(sites);

	window.localStorage.setItem('sites', JSON.stringify(sites));
}

export function getLocalWebsiteKey(id: string) {
	let sites;
	try {
		sites = JSON.parse(window.localStorage.getItem('sites')) || {};
	} catch (e) {
		sites = {};
	}

	return sites[id] && sites[id].key;
}
