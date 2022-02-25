import { getWebsite } from '$lib/serverUtils';
/** @type {import('@sveltejs/kit').RequestHandler} */

export async function get({ params, url }) {
	const id = params.id;
	const raw = !!url.searchParams.get('raw');

	const page = (content) => `<html>
	<head>
			<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>
	<body style="margin: 0; padding: 0">
	<iframe 
		style="width: 100%; height: 100vh; border: 0" 
		sandbox="allow-scripts allow-pointer-lock allow-popups allow-forms"></iframe>
	<script type="text/javascript">
		document.querySelector('iframe').srcdoc = decodeURIComponent("${content}");
		try {
			const sites = JSON.parse(window.localStorage.getItem("sites") || '{}');
			if(sites["${encodeURIComponent(id)}"]){
				const container = document.createElement('div');
				container.style.position = 'absolute';
				container.style.top = '10px';
				container.style.right = '10px';
				container.style.padding = '5px 10px';
				container.style.backgroundColor = 'gray';

				const a = document.createElement('button');
				a.innerHTML = 'edit';
				a.addEventListener('click', () => {
					window.location.assign(window.location.href+'/edit')
				})
				container.appendChild(a);

				document.body.appendChild(container);
			}

		} catch (e){ console.error(e)}
	</script>
	</body></html>
	`;
	const site = await getWebsite(id);

	if (site && site.indexOf('lock-') !== 0) {
		return {
			body: raw ? site : page(encodeURIComponent(site)),
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
