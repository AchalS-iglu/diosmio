<script>
	import '../app.css';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<slot />
<!-- <input
	type="checkbox"
	class="toggle"
	data-toggle-theme="retro,coffee"
	data-act-class="ACTIVECLASS"
/> -->
