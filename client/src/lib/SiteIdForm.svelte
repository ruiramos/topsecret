<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { autofocus } from '$lib/autofocus';

	export let initialSiteId;
	export let errorMessage;

	const dispatch = createEventDispatcher();
	let siteId = initialSiteId;

	function handleUpload(ev) {
		ev.preventDefault();
		dispatch('submit', { siteId });
	}
</script>

<div class="site-id">
	<form on:submit={handleUpload}>
		<p>
			great stuff! where would you like this to live? https://index.html.club/~<input
				type="text"
				bind:value={siteId}
				use:autofocus
			/>
		</p>
		<p class="error-container">{errorMessage}</p>
		<button type="submit">ok!</button>
	</form>
</div>

<style></style>
