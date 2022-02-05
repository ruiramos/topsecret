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

export async function uploadFile(file: File, id: string) {
	const data = new FormData();
	data.append('file', file);
	data.append('id', id);

	return fetch('/upload.json', {
		method: 'POST',
		body: data
	});
}
