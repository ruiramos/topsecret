<script context="module" lang="ts">
	import '../app.css';
	export const prerender = true;
</script>

<script lang="ts">
	//import Counter from '$lib/Counter.svelte';
	import { validateDrop, uploadSite, validateLockSiteId } from '$lib/utils';
	import Dropzone from '$lib/Dropzone.svelte';
	import SiteIdForm from '$lib/SiteIdForm.svelte';
	import Preview from '$lib/Preview.svelte';
	//import { autofocus } from '$lib/autofocus';

	let initialSiteId = Math.random().toString(36).substring(2, 9); //TODO
	let siteId;

	let errorMessage = '';
	let htmlFile;
	let htmlContent;
	let redirectToEdit = false;

	async function handleDrop({ detail }) {
		if (detail.error) {
			errorMessage = detail.error.message;
		} else {
			errorMessage = '';
			htmlFile = detail.file;
			htmlContent = await htmlFile.text();
		}
	}

	function handleSetSiteId({ detail }) {
		if (!detail.siteId) return;
		errorMessage = '';
		validateLockSiteId(detail.siteId)
			.then((res) => {
				if (res.status === 200) {
					siteId = detail.siteId;
					handleUpload();
				} else if (res.status >= 400) {
					const body = res.json();
					body.then((body) => {
						console.log(body.error.message);
						errorMessage = body.error.message;
					});
				}
			})
			.catch((err) => {
				siteIdError = err.message;
			});
	}

	function handleUpload() {
		uploadSite(htmlContent, siteId)
			.then((res) => {
				if (res.status === 200) {
					window.location.assign(`/~${siteId}${redirectToEdit ? '/edit' : ''}`);
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

	async function handleTemplateStart(e) {
		e.preventDefault();
		const resp = await fetch('/sample-index.html');
		htmlContent = await resp.text();
		redirectToEdit = true;
	}
</script>

<svelte:head>
	<title>index.html.club</title>
</svelte:head>

<section>
	<p>community of creators for the simple web / static hosting for index.html-only websites</p>

	<Dropzone {validateDrop} on:drop={handleDrop} />

	{#if htmlContent}
		<Preview content={htmlContent} blurContents={true} />
		<div class="overlay">
			{#if !siteId}
				<SiteIdForm {initialSiteId} {errorMessage} on:submit={handleSetSiteId} />
			{:else}
				<!--
				<p>
					nearly there! please login or create an account to publish your site to {`https://index.html.club/~${siteId}`}
				</p>
				<p>TODO</p>
				<button on:click={handleUpload} use:autofocus>done!</button>
				-->
			{/if}
		</div>
	{/if}

	{#if htmlContent && siteId}{/if}

	<p class="error-container">{errorMessage}</p>

	<p>
		don't have a html website yet? <a href="#" on:click={handleTemplateStart}
			>start from a basic template!</a
		>
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

	.error-container {
		color: red;
	}

	.overlay {
		z-index: 100;
		position: absolute;
		top: 25%;
		padding: 1em 2em;
		background: rgba(255, 255, 255, 0.95);
	}
</style>
