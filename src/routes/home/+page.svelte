<script lang="ts">
	import { formDatetoObject, getDateRange, objecttoFormDate, visibleDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import Pie from '../../components/ExpensesTagsPie.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import CreateExpenseModal from '../../components/CreateExpenseModal.svelte';
	import type { Expense_t } from '$lib/types';
	import {
		balanceStore,
		dateRangeStore,
		expensesStore,
		tagsStore,
		totalExpensesStore
	} from '$lib/stores';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import MoneyStressIllustration from '../../components/static/MoneyStressIllustration.svelte';

	import Icon from '@iconify/svelte';
	import calendarIcon from '@iconify/icons-line-md/calendar';
	import documentAddIcon from '@iconify/icons-line-md/document-add';
	import closeMenuIcon from '@iconify/icons-line-md/close-to-menu-transition';
	import menuIcon from '@iconify/icons-line-md/menu-to-close-transition';
	import plusIcon from '@iconify/icons-line-md/plus';
	import minusIcon from '@iconify/icons-line-md/minus';
	import confirmIcon from '@iconify/icons-line-md/confirm';
	import removeIcon from '@iconify/icons-line-md/remove';
	import editIcon from '@iconify/icons-ic/round-edit';
	import delIcon from '@iconify/icons-ic/sharp-delete';
	import NoDataIllustration from '../../components/static/NoDataIllustration.svelte';

	let hamburgerMebu: HTMLDetailsElement | null = null;
	let menuOpen: boolean = false;

	let dateDivElement: HTMLDivElement | null = null;
	let dateTextElement: HTMLParagraphElement | null = null;
	let overflow: string = '0';

	let addingFunds: boolean = false;
	let subtractingFunds: boolean = false;
	let fundsForm: number | null;

	let dateRangeForm: [string, string] = [
		objecttoFormDate($dateRangeStore[0]),
		objecttoFormDate($dateRangeStore[1])
	];

	let expenseDetailsModalId: string | null;

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
				'Content-Type': 'application/json'
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

	$: {
		tagsStore.set({});
		$expensesStore.forEach((item) => {
			item.tags.forEach((tag) => {
				if ($tagsStore[tag]) {
					tagsStore.update((tags) => {
						return {
							...tags,
							[tag]: tags[tag] + item.amount
						};
					});
				} else {
					tagsStore.update((tags) => {
						return {
							...tags,
							[tag]: item.amount
						};
					});
				}
			});
		});
	}

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
		?start=${$dateRangeStore[0].toDateString()}
		&end=${$dateRangeStore[1].toDateString()}
		`).then(async (res) => {
			console.log(res);
			if (res.status === 200) {
				expensesStore.set(await res.json());
			}
		});
		fetch(`/api/user/getUserData`)
			.then((res) => res.json())
			.then((res) => {
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
				<Icon icon={calendarIcon} class="w-8 h-8 text-primary-content" />
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
							dateRangeStore.set([
								formDatetoObject(dateRangeForm[0]),
								formDatetoObject(dateRangeForm[1])
							]);
							fetch(`/api/expenses/getExpenses
						?start=${$dateRangeStore[0].toDateString()}
						&end=${$dateRangeStore[1].toDateString()}
						`)
								.then((res) => res.json())
								.then((res) => {
									expensesStore.set(res);
								});
							fetch(`/api/user/getUserData`)
								.then((res) => res.json())
								.then((res) => {
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
					icon={documentAddIcon}
					class="w-8 h-8"
					color="hsl(var(--suc) / var(--tw-text-opacity))"
				/>
			</button>
		</div>
		<details class="dropdown dropdown-end dropdown-hover" bind:this={hamburgerMebu}>
			{#if !menuOpen}
				<summary class="btn btn-warning p-2 join-item rounded-none rounded-se-md">
					<Icon
						icon={closeMenuIcon}
						class="w-8 h-8"
						color="hsl(var(--suc) / var(--tw-text-opacity))"
					/>
				</summary>
			{:else}
				<summary class="btn btn-warning p-2 join-item rounded-none rounded-se-md">
					<Icon icon={menuIcon} class="w-8 h-8" color="hsl(var(--suc) / var(--tw-text-opacity))" />
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
							<Icon icon={plusIcon} class="w-4 h-4" />
						</button>
						<button
							class="btn btn-sm btn-error join-item"
							on:click={() => (subtractingFunds = true)}
						>
							<Icon icon={minusIcon} class="w-4 h-4" />
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
							<Icon icon={confirmIcon} class="w-4 h-4" />
						</button>
						<button class="btn btn-sm btn-error join-item" on:click={() => (addingFunds = false)}>
							<Icon icon={removeIcon} class="w-4 h-4" />
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
							<Icon icon={confirmIcon} class="w-4 h-4" />
						</button>
						<button
							class="btn btn-sm btn-error join-item"
							on:click={() => (subtractingFunds = false)}
						>
							<Icon icon={removeIcon} class="w-4 h-4" />
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
		</div>
	</div>
	<div class="card bg-base-300 shadow h-48 mx-3 mt-3 p-4">
		{#if $expensesStore.length !== 0}
			{#key $tagsStore}
				<Pie tags={$tagsStore} />
			{/key}
		{:else}
			<NoDataIllustration />
			<a class="link text-[0.6rem] mb-4 self-center" href="https://storyset.com/data"
				>Data illustrations by Storyset</a
			>
		{/if}
	</div>
	<div class="card bg-base-300 h-[97vh] grow flex-1 m-3">
		{#if $expensesStore.length === 0}
			<!-- content here -->
			<div class="flex items-center justify-center w-full h-full flex-col">
				<div class="w-64 text-end flex gap-0 flex-col">
					<MoneyStressIllustration />
					<a class="link text-[0.6rem] mb-4" href="https://storyset.com/people"
						>People illustrations by Storyset</a
					>
				</div>
				<button
					class="btn"
					on:click={() =>
						// @ts-ignore
						window.addExpense.showModal()}>Start by adding an expense</button
				>
			</div>
		{:else}
			<!-- else content here -->
			<table class="table w-full table-pin-rows overflow-y-scroll">
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
									<Icon icon={editIcon} class="w-4 h-4" />
								</button>
								<button
									class="
											btn btn-sm btn-error
											join-item
									"
									on:click={() => {
										fetch(`/api/expenses/deleteExpense/${expense.id}`, {
											method: 'DELETE',
											headers: {}
										}).then(async (res) => {
											const body = await res.json();
											console.log(body);
											if (body.id) {
												expensesStore.update((expenses) =>
													expenses.filter((e) => e.id !== body.id)
												);
												totalExpensesStore.update((x) => x - body.amount);
												balanceStore.update((x) => x + body.amount);
											}
										});
									}}
								>
									<Icon icon={delIcon} class="w-4 h-4" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
