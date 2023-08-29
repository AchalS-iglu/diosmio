<script lang="ts">
	import { getDateRange, visibleDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import Pie from '../../components/ExpensesTagsPie.svelte';
	import { data } from './randomData';
	import { signOut } from '@auth/sveltekit/client';
	import CreateExpenseModal from '../../components/CreateExpenseModal.svelte';
	import type { Expense_t } from '$lib/types';
	import {
		balanceStore,
		dateRangeStore,
		expensesStore,
		totalExpensesStore,
		yearlyExpensesStore
	} from '$lib/stores';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';

	let hamburgerMebu: HTMLDetailsElement | null = null;
	let menuOpen: boolean = false;

	let dateDivElement: HTMLDivElement | null = null;
	let dateTextElement: HTMLParagraphElement | null = null;
	let overflow: string = '0';

	let addingFunds: boolean = false;
	let subtractingFunds: boolean = false;
	let fundsForm: number | null;

	let dateRangeForm: [Date, Date] = [$dateRangeStore[0], $dateRangeStore[1]];

	function findTagWithHighestSpendage(expenses: Expense_t[]): string {
		if (expenses.length === 0) return 'None';
		const tagSpendageMap: Record<string, number> = {};
		expenses.forEach((expense) => {
			expense.tags.forEach((tag) => {
				if (tag in tagSpendageMap) {
					tagSpendageMap[tag] += expense.amount;
				} else {
					tagSpendageMap[tag] = expense.amount;
				}
			});
		});
		const highestSpendageTag = Object.keys(tagSpendageMap).reduce((a, b) =>
			tagSpendageMap[a] > tagSpendageMap[b] ? a : b
		);
		return highestSpendageTag;
	}

	function handleFundsUpdate(type: 'add' | 'sub') {
		if (fundsForm === null) {
			toast.error('Please enter a valid amount');
			return;
		}
		fetch(`/api/user/balanceAddSub`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$page.data.session?.user.token}`
			},
			body: JSON.stringify({
				amount: fundsForm,
				type: type
			})
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.balance) {
					balanceStore.set(res.balance);
				}
			});
		subtractingFunds = false;
		addingFunds = false;
		fundsForm = 0;
	}

	$: console.log(overflow);

	onMount(() => {
		hamburgerMebu?.addEventListener('toggle', () => {
			menuOpen = hamburgerMebu?.open ?? false;
		});

		if (dateDivElement && dateTextElement) {
			overflow = `${dateDivElement?.scrollWidth - dateDivElement?.clientWidth}`;
			if (parseInt(overflow) > 5) {
				dateTextElement?.classList.add('text-animated');
			} else {
				dateTextElement?.classList.remove('text-animated');
			}
		}

		window?.addEventListener('resize', (p) => {
			if (dateDivElement && dateTextElement) {
				overflow = `${dateDivElement?.scrollWidth - dateDivElement?.clientWidth}`;
				if (parseInt(overflow) > 5) {
					dateTextElement?.classList.add('text-animated');
				} else {
					dateTextElement?.classList.remove('text-animated');
				}
			}
		});

		fetch(`/api/expenses/getExpenses
		?start=${$dateRangeStore[0]}
		&end=${$dateRangeStore[1]}
		`)
			.then((res) => res.json())
			.then((res) => {
				expensesStore.set(res);
			});
		fetch(`/api/user/getUserData`)
			.then((res) => res.json())
			.then((res) => {
				yearlyExpensesStore.set(res.yearlyExpenses);
				totalExpensesStore.set(res.totalExpenses);
				balanceStore.set(res.balance);
			});
	});
</script>

<CreateExpenseModal />

<div class="overflow-y-scroll w-screen h-screen flex flex-col">
	<hr
		class="border-0 bg-error bg-opacity-50 h-px mt-8 flex-none"
		style="background-image: linear-gradient(to right, transparent, var(--primary-content), transparent);"
	/>
	<div class="flex flex-row mx-3 mt-3 mb-1">
		<div
			class="bg-secondary overflow-x-hidden rounded-ss-md pl-4 text-md whitespace-nowrap font-bold w-full align-middle justify-between items-center flex-row flex join-item animated"
			bind:this={dateDivElement}
		>
			<p
				bind:this={dateTextElement}
				class="text-md font-bold text-secondary-content w-min"
				style="--overflow: -{overflow}px"
			>
				{getDateRange({
					start: $dateRangeStore[0],
					end: $dateRangeStore[1]
				})}
			</p>
		</div>
		<details class="dropdown dropdown-end">
			<summary class="flex h-full w-12 justify-center items-center bg-secondary join-item">
				<Icon icon="line-md:calendar" class="w-8 h-8 text-primary-content" />
			</summary>
			<ul class="dropdown-content z-[1] menu mt-1 p-2 shadow bg-base-300 gap-2">
				<li class="input">
					<input type="date" class="input input-md w-full" bind:value={dateRangeForm[0]} />
				</li>
				<li class="input">
					<input type="date" class="input input-md w-full" bind:value={dateRangeForm[1]} />
				</li>
				<li class="button">
					<button
						class="btn btn-sm btn-success w-full"
						on:click={() => {
							dateRangeStore.set(dateRangeForm);
							fetch(`/api/expenses/getExpenses
						?start=${dateRangeForm[0]}
						&end=${dateRangeForm[1]}
						`)
								.then((res) => res.json())
								.then((res) => {
									expensesStore.set(res);
								});
							fetch(`/api/user/getYearlyTotalExpenses`)
								.then((res) => res.json())
								.then((res) => {
									yearlyExpensesStore.set(res.yearlyExpenses);
									totalExpensesStore.set(res.totalExpenses);
								});
						}}
					>
						Apply
					</button>
				</li>
			</ul>
		</details>
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
		<details class="dropdown dropdown-end dropdown-hover" bind:this={hamburgerMebu}>
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
			<div class="stat-value text-3xl">${$balanceStore.toLocaleString()}</div>
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
							bind:value={fundsForm}
						/>
						<button
							class="btn btn-sm btn-success join-item"
							on:click={() => {
								handleFundsUpdate('add');
							}}
						>
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
							bind:value={fundsForm}
						/>
						<button
							class="btn btn-sm btn-warning join-item"
							on:click={() => {
								handleFundsUpdate('sub');
							}}
						>
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
			<div class="stat-value text-2xl overflow-x-scroll">
				${$expensesStore.reduce((acc, expense) => acc + expense.amount, 0).toLocaleString()}
			</div>
			<div class="stat-desc text-start">Total - ${$totalExpensesStore}</div>
			<div class="stat-desc text-start">
				Highest in - {findTagWithHighestSpendage($expensesStore)}
			</div>
			<div class="stat-desc text-start">
				This year - ${$yearlyExpensesStore[new Date().getFullYear()]?.toLocaleString() ?? 0}
			</div>
		</div>
	</div>
	<div class="card bg-base-300 shadow h-48 mx-3 mt-3 p-2">
		<Pie {data} />
	</div>
	<div class="card bg-base-300 h-[97vh] grow flex-1 m-3">
		<div
			class="overflo yearlyExpenses = userP.yearlyExpenses!;
w-x-auto"
		>
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
					{#each $expensesStore as expense}
						<tr>
							<td>{expense.title}</td>
							<td>$ {expense.amount}</td>
							<td>{visibleDate(new Date(expense.date))}</td>
							<td class="join">
								<button
									class="
										btn btn-sm btn-warning
										join-item
								"
								>
									<Icon icon="ic:round-edit" class="w-4 h-4" />
								</button>
								<button
									class="
										btn btn-sm btn-error
										join-item
								"
									on:click={() => {
										fetch(`/api/expenses/deleteExpense/${expense.id}`, {
											method: 'DELETE'
										})
											.then((res) => res.json())
											.then((res) => {
												if (res.success) {
													expensesStore.update((expenses) =>
														expenses.filter((e) => e.id !== expense.id)
													);
												}
											});
									}}
								>
									<Icon icon="ic:sharp-delete" class="w-4 h-4" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
