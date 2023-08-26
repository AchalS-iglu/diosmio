<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Sisyphus from '../components/Sisyphus.svelte';

	onMount(() => {
		setTimeout(() => {
			// goto('/welcome/start');
		}, 1000);
	});
</script>

<div class="flex w-screen h-screen justify-center items-center">
	<Sisyphus />
</div>
