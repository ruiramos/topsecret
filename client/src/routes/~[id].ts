import { getWebsite } from '$lib/serverUtils';
/** @type {import('@sveltejs/kit').RequestHandler} */

export async function get({ params }) {
	const id = params.id;

	const injected_script = `
	<script type="text/javascript">
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
	`;

	const site = await getWebsite(id);

	if (site && site.indexOf('lock-') !== 0) {
		return {
			body: site + '\n' + injected_script,
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
