<script lang="ts">
	import Icon from '@iconify/svelte';

	import googleIcon from '@iconify/icons-akar-icons/google-fill';
	import githubIcon from '@iconify/icons-akar-icons/github-fill';
	import { signIn } from '@auth/sveltekit/client';
	import toast from 'svelte-french-toast';
	import { error } from '@sveltejs/kit';
</script>

<div class="containerBetween">
	<div class="mt-32">
		<h1 class="text-4xl font-bold text-center text-base-content mb-4 font-montserratAlt">
			Broke as hell?
		</h1>
		<h2 class="text-2xl px-2 text-center text-base-content mb-8">
			The least you could do is track your expenses
		</h2>
	</div>
	<div class="mb-16 flex flex-col gap-2">
		<div
			class="
            flex
            flex-col
            gap-2
    "
		>
			<button
				class="btn btn-error justify-self-center"
				on:click={() =>
					signIn('google').catch((err) => {
						toast.error(err.message);
						console.log(err);
					})}
			>
				<Icon icon={googleIcon} width="20" height="20" />Continue with Google
			</button>
			<button
				class="btn btn-neutral justify-self-center"
				on:click={() =>
					signIn('github').catch((err) => {
						toast.error(err.message);
						console.log(err);
					})}
			>
				<Icon icon={githubIcon} width="20" height="20" />Continue with Github
			</button>
		</div>
		<span class="text-center text-xs font-extralight text-base-content"
			>USE AS AN APP FOR THE BEST EXPERIENCE</span
		>
	</div>
</div>
