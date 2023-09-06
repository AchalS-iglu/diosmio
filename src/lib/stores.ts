import { writable } from 'svelte/store';
import type { Expense_t } from './types';

export const expensesStore = writable<Expense_t[]>([]);
export const totalExpensesStore = writable<number>(0);
export const dateRangeStore = writable<[Date, Date]>([
	new Date(new Date().getFullYear(), new Date().getMonth(), 1),
	new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
]);
export const balanceStore = writable<number>(0);
export const tagsStore = writable<{
	[key: string]: number;
}>({});
