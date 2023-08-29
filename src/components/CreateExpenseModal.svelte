<script lang="ts">
	import { page } from '$app/stores';
	import {
		balanceStore,
		dateRangeStore,
		expensesStore,
		totalExpensesStore,
		yearlyExpensesStore
	} from '$lib/stores';
	import toast from 'svelte-french-toast';
	import { MultiSelect } from 'svelte-multiselect';

	let form = {
		tags: [],
		amount: 0,
		date: new Date(),
		title: ''
	};

	const sendCreateExpenseRequest = () => {
		toast.promise(
			fetch('/api/expenses/createExpense', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// get auth from cookie
					Authorization: `Bearer ${$page.data.session?.user.token}`
				},
				body: JSON.stringify({
					...form,
					date: new Date(form.date).toISOString()
				})
			}).then((res) => {
				if (res.ok) {
					res.json().then((expense) => {
						if (
							$dateRangeStore[0].getTime() <= new Date(expense.date).getTime() &&
							$dateRangeStore[1].getTime() >= new Date(expense.date).getTime()
						)
							expensesStore.update((expenses) => [expense, ...expenses]);
						yearlyExpensesStore.update((x) => {
							return {
								...x,
								[new Date(expense.date).getFullYear()]: x[new Date(expense.date).getFullYear()]
									? x[new Date(expense.date).getFullYear()] + expense.amount
									: expense.amount
							};
						});
						totalExpensesStore.update((x) => x + expense.amount);
						balanceStore.update((x) => x - expense.amount);
					});
				}
			}),
			{
				success: 'Expense added successfully',
				error: 'Failed to add expense',
				loading: 'Adding expense...'
			}
		);
	};
</script>

<dialog id="addExpense" class="modal">
	<form method="dialog" class="modal-box" on:submit={sendCreateExpenseRequest}>
		<div class="flex flex-col mb-3">
			<label class="label" for="expense-title">
				<span class="label-text">Title</span>
			</label>
			<input
				type="text"
				id="expense-title"
				placeholder="Title"
				class="input input-bordered"
				bind:value={form.title}
				required
			/>
		</div>
		<div class="flex flex-col mb-3">
			<label class="label" for="expense-tags">
				<span class="label-text">Tags</span>
			</label>
			<MultiSelect
				options={['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education']}
				allowUserOptions={true}
				id="expense-tags"
				placeholder="Select or create tags"
				outerDivClass="input input-bordered"
				bind:value={form.tags}
				required
			/>
		</div>
		<div class="flex flex-col mb-3">
			<label class="label" for="expense-amount">
				<span class="label-text">Amount</span>
			</label>
			<input
				type="number"
				id="expense-amount"
				placeholder="Amount"
				class="input input-bordered"
				bind:value={form.amount}
				required
			/>
		</div>
		<div class="flex flex-col mb-3">
			<label class="label" for="expense-date">
				<span class="label-text">Date</span>
			</label>
			<input
				type="date"
				id="expense-date"
				placeholder="Date"
				class="input input-bordered"
				bind:value={form.date}
				required
			/>
		</div>
		<div class="flex flex-row w-full justify-evenly">
			<button class="btn btn-primary" type="submit">Add</button>
			<button
				class="btn"
				on:click={(e) => {
					e.preventDefault();
					const dialog = document.getElementById('addExpense');
					dialog.close();
				}}>Cancel</button
			>
		</div>
	</form>
</dialog>
