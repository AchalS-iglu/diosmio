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
