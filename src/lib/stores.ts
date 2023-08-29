import { writable } from 'svelte/store';
import type { Expense_t } from './types';

export const expensesStore = writable<Expense_t[]>([]);
export const yearlyExpensesStore = writable<Record<string, number>>({});
export const totalExpensesStore = writable<number>(0);
export const dateRangeStore = writable<[Date, Date]>([
	new Date(`${new Date().getMonth() + 1}-1-${new Date().getFullYear()}`),
	new Date(`${new Date().getMonth() + 1}-31-${new Date().getFullYear()}`)
]);
