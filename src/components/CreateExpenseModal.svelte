<script lang="ts">
	import { page } from '$app/stores';
	import type { Expense_t } from '$lib/types';
	import toast from 'svelte-french-toast';
	import { MultiSelect } from 'svelte-multiselect';

	let form: Omit<Expense_t, 'id'> = {
		tags: [],
		amount: 0,
		date: new Date(),
		title: '',
		userId: $page.data.session?.user?.id ?? 'no id'
	};

	const sendCreateExpenseRequest = () => {
		toast.promise(
			fetch('/api/expenses/createExpense', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...form,
					date: new Date(form.date).toISOString()
				})
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
			/>
		</div>
		<div class="flex flex-row w-full justify-evenly">
			<button class="btn btn-primary" type="submit">Add</button>
			<button class="btn">Cancel</button>
		</div>
	</form>
</dialog>
