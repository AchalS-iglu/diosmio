<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			goto('/home');
		}, 1000);
	});
</script>

<div class="flex w-screen h-screen justify-center items-center bg-[#2e282a]">
	<img
		src="/megamind.png"
		alt="logo"
		class="w-48 h-48 rounded-3xl animate- [spin_3s_linear_infinite]"
	/>
</div>
