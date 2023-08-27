<script lang="ts">
	import { getDateRange } from '$lib/utls';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let range = {
		start: new Date('2021-08-24'),
		end: new Date('2021-09-23')
	};

	onMount(() => {});
</script>

<div class="overflow-x-hidden w-screen h-screen flex flex-col">
	<hr
		class="border-0 bg-error bg-opacity-50 h-px mt-8"
		style="background-image: linear-gradient(to right, transparent, var(--primary-content), transparent);"
	/>
	<div class="flex flex-row mx-3 mt-3 mb-1 gap-1">
		<div
			class="bg-secondary overflow-x-hidden rounded-ss-md pl-4 text-lg whitespace-nowrap font-bold w-full align-middle justify-between items-center flex-row flex join-item"
		>
			{getDateRange(range)}
			<div class="flex rounded-full h-full w-12 justify-center items-center">
				<Icon icon="line-md:calendar" class="w-8 h-8 text-primary-content" />
			</div>
		</div>
		<button
			class="p-2 bg-success join-item active:bg-primary-focus hover:bg-primary-focus rounded-se-md"
		>
			<Icon
				icon="line-md:document-add"
				class="w-8 h-8"
				color="hsl(var(--suc) / var(--tw-text-opacity))"
			/>
		</button>
	</div>
	<div
		class="stats rounded-se-none rounded-ss-none bg-primary text-primary-content shadow mx-3 rounded-es-md rounded-ee-md"
	>
		<div class="stat">
			<div class="stat-title">Balance</div>
			<div class="stat-value text-3xl">$89,400</div>
			<div class="stat-actions">
				<button class="btn btn-sm btn-success">Add funds</button>
			</div>
		</div>

		<div class="stat text-start">
			<div class="stat-title">Spendage</div>
			<div class="stat-value text-2xl">$89,400</div>
			<div class="stat-desc text-start">Total - $123123</div>
			<div class="stat-desc text-start">Highest in - Food</div>
			<div class="stat-desc text-start">This year - $ 123132132</div>
		</div>
	</div>
</div>
