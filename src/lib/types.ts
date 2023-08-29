export type Session_t = {
	id: string;
	sessionToken: string;
	userId: string;
	expires: Date;
};

export type Expense_t = {
	id: string;
	title: string;
	amount: number;
	date: Date;
	tags: string[];
	userId: string;
};
