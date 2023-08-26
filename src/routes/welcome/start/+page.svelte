<script lang="ts">
	import Sisyphus from '../../../components/Sisyphus.svelte';
</script>

<div class="flex flex-col items-center w-screen h-screen justify-between font-montserrat">
	<div class="mt-32">
		<h1 class="text-4xl font-bold text-center text-base-content mb-4 font-montserratAlt">
			Broke as hell?
		</h1>
		<h2 class="text-2xl font-bold text-center text-base-content mb-8">
			The least you could do is track your expenses
		</h2>
	</div>
	<div class="mb-16 flex flex-col gap-2">
		<a href="/welcome" class="btn btn-primary justify-self-center mt-2">Let's get started</a>
		<a class="text-center text-xs link" href="/login">Already have an account?</a>
	</div>
</div>
