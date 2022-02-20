<script>
	import Preview from '$lib/Preview.svelte';
	import Editor from '$lib/Editor.svelte';
	import { updateSite, uploadSite, generateSiteId } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import debounce from 'lodash-es/debounce';

	export let site;

	const DEBOUNCE_DELAY = 1000;

	let realSite = decodeURIComponent(site);
	let mode = 'edit';
	const { id } = $page.params;

	async function handleSave() {
		await updateSite(realSite, id);
		window.location.assign(`/~${id}`);
	}

	async function handleSaveAsNew() {
		let newId = await generateSiteId();
		await uploadSite(realSite, newId);
		window.location.assign(`/~${newId}`);
	}

	function handleEditorMsg(e) {
		realSite = e.detail.content;
	}

	const handleEditorMsgDebounced = debounce(handleEditorMsg, DEBOUNCE_DELAY);
</script>

<div class={mode}>
	<div class="editor-container">
		<Editor content={realSite} on:update={handleEditorMsgDebounced} />
	</div>

	<div class="site-preview-container">
		<Preview content={realSite} />
	</div>
	<div class="floating-bar">
		{#if mode === 'preview'}
			<button on:click={() => (mode = 'edit')}>edit</button>
		{:else if mode === 'edit'}
			<button on:click={handleSave}>save</button>
			<button on:click={handleSaveAsNew}>save as new</button>
			<button
				on:click={() => {
					realSite = decodeURIComponent(site);
					mode = 'preview';
				}}>discard</button
			>
		{/if}
	</div>
</div>

<style>
	.floating-bar {
		position: absolute;
		padding: 5px 10px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: gray;
		display: inline-block;
	}

	.preview {
	}
	.preview .editor-container {
		display: none;
	}

	.edit {
		display: flex;
		flex-direction: row;
	}
	.edit .site-preview-container {
		position: relative;
		width: 50%;
	}
	.edit .editor-container {
		width: 50%;
		height: 100vh;
	}
</style>
