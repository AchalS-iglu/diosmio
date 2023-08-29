<script lang="ts">
	import '../app.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
	});
</script>

<slot />
<Toaster />
<!-- <input
	type="checkbox"
	class="toggle"
	data-toggle-theme="retro,coffee"
	data-act-class="ACTIVECLASS"
/> -->
