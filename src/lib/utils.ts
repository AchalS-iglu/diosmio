export const nthNumber = (number: number) => {
	return number.toString().slice(-1) === '1'
		? `${number}st`
		: number.toString().slice(-1) === '2'
		? `${number}nd`
		: number.toString().slice(-1) === '3'
		? `${number}rd`
		: `${number}th`;
};

export const getDateRange = (cycle: { start: Date; end: Date }): string => {
	if (
		cycle.start.getUTCFullYear() == cycle.end.getUTCFullYear() &&
		cycle.start.getUTCMonth() == cycle.end.getUTCMonth()
	) {
		return (
			nthNumber(cycle.start.getDate()) +
			' - ' +
			nthNumber(cycle.end.getDate()) +
			' ' +
			cycle.start.toLocaleString('default', { month: 'short' }) +
			' ' +
			cycle.start.getUTCFullYear()
		);
	} else if (cycle.start.getUTCFullYear() == cycle.end.getUTCFullYear()) {
		return (
			nthNumber(cycle.start.getDate()) +
			' ' +
			cycle.start.toLocaleString('default', { month: 'short' }) +
			' - ' +
			nthNumber(cycle.end.getDate()) +
			' ' +
			cycle.end.toLocaleString('default', { month: 'short' }) +
			' ' +
			cycle.start.getUTCFullYear()
		);
	} else {
		return (
			nthNumber(cycle.start.getDate()) +
			' ' +
			cycle.start.toLocaleString('default', { month: 'short' }) +
			' ' +
			cycle.start.getUTCFullYear() +
			' - ' +
			nthNumber(cycle.end.getDate()) +
			' ' +
			cycle.end.toLocaleString('default', { month: 'short' }) +
			' ' +
			cycle.end.getUTCFullYear()
		);
	}
};

export const getThemesfromLS = () => {
	const theme = localStorage.getItem('theme');
	return theme ? theme : 'retro';
};

export const visibleDate = (date: Date) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	if (date.toDateString() === today.toDateString()) {
		return 'Today';
	} else if (date.toDateString() === yesterday.toDateString()) {
		return 'Yesterday';
	} else {
		return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getDate();
	}
};

export function getCookie(cname: string) {
	const name = cname + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

export function formDatetoObject(formDate: string) {
	return new Date(
		parseInt(formDate.split('-')[0]),
		parseInt(formDate.split('-')[1]) - 1,
		parseInt(formDate.split('-')[2])
	);
}

export function objecttoFormDate(date: Date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
