<script lang="ts">
	import { getDateRange } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import Pie from '../../components/ExpensesTagsPie.svelte';
	import { data } from './randomData';
	import MultiSelect from 'svelte-multiselect';
	import { signOut } from '@auth/sveltekit/client';
	import CreateExpenseModal from '../../components/CreateExpenseModal.svelte';

	let range = {
		start: new Date('2021-08-24'),
		end: new Date('2021-09-23')
	};

	let menuOpen: boolean = false;
	let addingFunds: boolean = false;
	let subtractingFunds: boolean = false;

	onMount(() => {
		const details = document.querySelector('details');
		if (!details) return;
		details.addEventListener('toggle', () => {
			menuOpen = details.open;
		});
	});
</script>

<CreateExpenseModal />

<div class="overflow-y-scroll w-screen h-screen flex flex-col">
	<hr
		class="border-0 bg-error bg-opacity-50 h-px mt-8 flex-none"
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
		<div class="lg:tooltip lg:tooltip-bottom" data-tip="Add Expense">
			<button
				class="btn btn-success p-2 join-item rounded-none"
				on:click={() =>
					// @ts-ignore
					window.addExpense.showModal()}
			>
				<Icon
					icon="line-md:document-add"
					class="w-8 h-8"
					color="hsl(var(--suc) / var(--tw-text-opacity))"
				/>
			</button>
		</div>
		<details class="dropdown dropdown-end dropdown-hover">
			{#if !menuOpen}
				<summary class="btn btn-warning p-2 join-item rounded-none rounded-se-md">
					<Icon
						icon="line-md:close-to-menu-transition"
						class="w-8 h-8"
						color="hsl(var(--suc) / var(--tw-text-opacity))"
					/>
				</summary>
			{:else}
				<summary class="btn btn-warning p-2 join-item rounded-none rounded-se-md">
					<Icon
						icon="line-md:menu-to-close-transition"
						class="w-8 h-8"
						color="hsl(var(--suc) / var(--tw-text-opacity))"
					/>
				</summary>
			{/if}
			<ul class="dropdown-content z-[1] menu mt-1 p-2 shadow bg-base-300 rounded-box w-32">
				<li>
					<button
						class="btn btn-sm mb-2"
						on:click={() => {
							console.log('Settings');
						}}
					>
						Settings
					</button>
				</li>
				<li>
					<button class="btn btn-sm" on:click={() => signOut()}> Logout </button>
				</li>
			</ul>
		</details>
	</div>
	<div
		class="stats flex-none rounded-se-none rounded-ss-none bg-primary text-primary-content shadow mx-3 rounded-es-md rounded-ee-md"
	>
		<div class="stat">
			<div class="stat-title">Balance</div>
			<div class="stat-value text-3xl">$89,400</div>
			<div class="stat-actions">
				{#if !addingFunds && !subtractingFunds}
					<div class="flex flex-row join">
						<button class="btn btn-sm btn-success join-item" on:click={() => (addingFunds = true)}>
							<Icon icon="line-md:plus" class="w-4 h-4" />
						</button>
						<button
							class="btn btn-sm btn-error join-item"
							on:click={() => (subtractingFunds = true)}
						>
							<Icon icon="line-md:minus" class="w-4 h-4" />
						</button>
						<span class="btn btn-sm btn-info join-item"> FUNDS </span>
					</div>
				{:else if addingFunds}
					<div class="flex flex-row join">
						<input
							type="number"
							class="input input-sm w-12 grow join-item [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
							placeholder="$$$$$$$$$"
						/>
						<button class="btn btn-sm btn-success join-item">
							<Icon icon="line-md:confirm" class="w-4 h-4" />
						</button>
						<button class="btn btn-sm btn-error join-item" on:click={() => (addingFunds = false)}>
							<Icon icon="line-md:remove" class="w-4 h-4" />
						</button>
					</div>
				{:else if subtractingFunds}
					<div class="flex flex-row join">
						<input
							type="number"
							class="input input-sm w-12 grow join-item [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
							placeholder="$$$$$$$$$"
						/>
						<button class="btn btn-sm btn-warning join-item">
							<Icon icon="line-md:confirm" class="w-4 h-4" />
						</button>
						<button
							class="btn btn-sm btn-error join-item"
							on:click={() => (subtractingFunds = false)}
						>
							<Icon icon="line-md:remove" class="w-4 h-4" />
						</button>
					</div>
				{/if}
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
	<div class="card bg-base-300 shadow h-48 mx-3 mt-3 p-2">
		<Pie {data} />
	</div>
	<div class="card bg-base-300 h-[97vh] grow flex-1 m-3">
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Title</th>
						<th>Amount</th>
						<th>Timestamp</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each data as item}
						<tr>
							<td>{item.name}</td>
							<td>$ {item.amount}</td>
							<td>{item.date}</td>
							<td>
								<button class="btn btn-xs">Details</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
