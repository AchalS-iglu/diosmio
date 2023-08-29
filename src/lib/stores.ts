import { writable } from 'svelte/store';
import type { Expense_t } from './types';

export const expensesStore = writable<Expense_t[]>([]);
