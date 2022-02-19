<script>
	import Preview from '$lib/Preview.svelte';
	import { updateSite } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let site;
	$: realSite = decodeURIComponent(site);

	let mode = 'edit';
	const { id } = $page.params;

	async function handleSave() {
		await updateSite(realSite, id);
		window.location.assign(`/~${id}`);
	}
</script>

<div class={mode}>
	<textarea bind:value={realSite} />

	<div class="site-preview-container">
		<Preview content={realSite} />
	</div>
	<div class="floating-bar">
		{#if mode === 'preview'}
			<button on:click={() => (mode = 'edit')}>edit</button>
		{:else if mode === 'edit'}
			<button on:click={handleSave}>save</button>
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
	.preview textarea {
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
	.edit textarea {
		width: 50%;
		height: 100vh;
	}
</style>
