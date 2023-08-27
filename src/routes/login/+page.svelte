<script lang="ts">
	import Icon from '@iconify/svelte';

	let form: {
		email: string;
		password: string;
		confirmPassword: string;
	} = {
		email: '',
		password: '',
		confirmPassword: ''
	};
</script>

<div class="containerCenter gap-4">
	<h1 class="text-4xl font-bold text-center text-base-content font-montserratAlt">Login</h1>
	<form class="flex flex-col gap-2">
		<!-- pass and user input  -->
		<div class="form-control">
			<label class="label" for="email-input">
				<span class="label-text">Email</span>
			</label>
			<input type="text" id="email-input" placeholder="Email" class="input input-bordered" />
		</div>
		<div class="form-control">
			<label class="label" for="pass-input">
				<span class="label-text">Password</span>
			</label>
			<input type="password" id="pass-input" placeholder="Password" class="input input-bordered" />
		</div>
		<button class="btn btn-primary justify-self-center mt-2" type="submit"> Login </button>
	</form>
	<div>
		<div class="divider flex w-64">OR</div>
	</div>
	<div
		class="
            flex
            flex-col
            gap-2
    "
	>
		<a class="btn btn-error justify-self-center" href="/auth/google">
			<Icon icon="akar-icons:google-fill" width="20" height="20" />Continue with Google
		</a>
		<a class="btn btn-neutral justify-self-center" href="/auth/github">
			<Icon icon="akar-icons:github-fill" width="20" height="20" />Continue with Github
		</a>
		<a class="text-center text-xs link text-base-content" href="/register">Don't have an account?</a
		>
	</div>
</div>
