<script type="ts">
	import { onMount } from 'svelte';

	export let content;
	export let blurContents = false;

	let iframe;
	let lolStyles = `<style>
	* {
			color: transparent !important;
			text-shadow: 0 0 5px rgb(0 0 0 / 50%), 0 0 5px rgb(255 255 255 / 50%) !important;
	}
</style>`;

	onMount(async () => {
		//const content = await file.text();
		iframe.srcdoc = content + (blurContents ? lolStyles : '');
	});

	$: {
		if (iframe) {
			iframe.srcdoc = content + (blurContents ? lolStyles : '');
		}
	}
</script>

<div class={blurContents ? 'blur' : ''}>
	<iframe title="site preview" bind:this={iframe} />
</div>

<style>
	div {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		min-height: 100vh;
		background: white;
		border: 0;
	}

	div.blur:after {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		min-height: 100vh;
		background: rgba(0, 0, 0, 0.33);
		border: 0;
		z-index: 10;
		content: ' ';
	}

	iframe {
		width: 100%;
		min-height: 100vh;
		background: white;
		border: 0;
	}

	div.blur iframe {
		opacity: 0.65;
	}
</style>
