<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	//import Counter from '$lib/Counter.svelte';
	import { validateDrop, uploadFile } from '$lib/utils';
	const default_message = 'drop your index.html here';
	let dropping = false;
	let message = default_message;
	let errorMessage = '';

	let htmlFile;
	let siteId = Math.random().toString(36).substring(2, 9); //TODO

	function handleDrop(ev) {
		ev.preventDefault();
		dropping = false;
		errorMessage = '';

		try {
			const file = validateDrop(ev);
			message = 'got it!';
			htmlFile = file;
		} catch (err) {
			errorMessage = err.message;
			message = default_message;
		}
	}

	function handleDragOver(ev) {
		ev.preventDefault();
		console.log('handleDragOver', ev);
		dropping = true;
		message = 'let it gooo';
	}

	function handleDragLeave(ev) {
		console.log('handleDragLeave', ev);
		dropping = false;
		message = default_message;
	}

	function handleUpload() {
		uploadFile(htmlFile, siteId)
			.then((res) => {
				if (res.status === 200) {
					window.location.assign(`/~${siteId}`);
				} else if (res.status >= 400) {
					const body = res.json();
					body.then((body) => {
						errorMessage = body.error.message;
					});
				}
			})
			.catch((e) => {
				if (e.message) {
					errorMessage = 'Error uploading: ' + e.message;
				} else {
					errorMessage = 'Something when wrong';
				}
			});
	}
</script>

<svelte:head>
	<title>index.html.club</title>
</svelte:head>

<section>
	<div
		class="dropzone"
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		class:dropping
	>
		{message}
	</div>

	{#if htmlFile}
		<div class="site-id">
			<form on:submit={handleUpload}>
				looks great! where would you like it to live? https://index.html.club/~<input
					type="text"
					bind:value={siteId}
					autofocus
				/>
				<button type="submit">go!</button>
			</form>
		</div>
	{/if}

	<p class="error-container">{errorMessage}</p>

	<p>
		need a head start? download a sample <a href="/sample-index.html" download>index.html here</a> and
		get building
	</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.dropzone {
		width: 100%;
		height: 300px;
		background: var(--secondary-color);
		transition: background 150ms ease-out;
		border: 1px solid var(--primary-color);
		border-radius: 2px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dropzone.dropping {
		background: var(--primary-color);
	}

	.site-id {
		padding: 1em 0;
	}

	.error-container {
		color: red;
	}
</style>
