<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let validateDrop;

	const dispatch = createEventDispatcher();

	const default_message = 'drop your index.html here';
	let dropping = false;
	let message = default_message;

	function handleDrop(ev) {
		ev.preventDefault();

		try {
			const file = validateDrop(ev);
			message = 'got it!';
			dispatch('drop', {
				file: file
			});
		} catch (err) {
			message = default_message;
			dispatch('drop', {
				error: err,
				file: null
			});
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
</script>

<div
	class="dropzone"
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	class:dropping
>
	{message}
</div>

<style>
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
</style>
