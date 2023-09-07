<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import themes from 'daisyui/src/theming/themes';
	import { getThemesfromLS } from '$lib/utils';
	import { expensesStore, tagsStore } from '$lib/stores';

	let chart;
	let options;

	// Sort tags by total amount in descending order
	const sortedTags = Object.keys($tagsStore).sort((a, b) => $tagsStore[b] - $tagsStore[a]);

	// Keep only the highest 4 tags and put the rest in an "Others" category

	const topTags = sortedTags.slice(0, 4);
	const otherTotal = sortedTags.slice(4).reduce((acc, tag) => acc + $tagsStore[tag], 0);

	const theme = getThemesfromLS();

	if ($expensesStore.length == 0) {
		options = {
			type: 'pie',
			data: {
				labels: ['No expenses'],
				datasets: [
					{
						data: [1],
						backgroundColor: [
							// @ts-ignore
							themes[`[data-theme=${theme}]`].accent,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].info,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].success,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].warning,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].error,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].primary
						],
						hoverOffset: 4,
						borderWidth: 0
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'right'
					}
				},
				onClick: () => {
					console.log('test');
				}
			}
		};
	} else {
		options = {
			type: 'pie',
			data: {
				labels: topTags.length <= 4 ? topTags : [...topTags, 'Others'],
				datasets: [
					{
						data:
							topTags.length <= 4
								? topTags.map((tag) => $tagsStore[tag])
								: [...topTags.map((tag) => $tagsStore[tag]), otherTotal],
						backgroundColor: [
							// @ts-ignore
							themes[`[data-theme=${theme}]`].accent,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].info,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].success,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].warning,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].error,
							// @ts-ignore
							themes[`[data-theme=${theme}]`].primary
						],
						hoverOffset: 4,
						borderWidth: 0
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'right'
					}
				},
				onClick: () => {
					console.log('test');
				}
			}
		};
	}
	onMount(() => {
		const ctx = document.getElementById('myChart') as HTMLCanvasElement;
		chart = new Chart(ctx, options);
	});
</script>

<canvas id="myChart" />
