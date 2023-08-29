<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import themes from 'daisyui/src/theming/themes';
	import { getThemesfromLS } from '$lib/utils';
	import { expensesStore } from '$lib/stores';

	let chart;

	onMount(() => {
		const ctx = document.getElementById('myChart') as HTMLCanvasElement;

		const tagsData: {
			[key: string]: number;
		} = {};

		$expensesStore.forEach((item) => {
			item.tags.forEach((tag) => {
				if (tagsData[tag]) {
					tagsData[tag] += item.amount;
				} else {
					tagsData[tag] = item.amount;
				}
			});
		});

		// Sort tags by total amount in descending order
		const sortedTags = Object.keys(tagsData).sort((a, b) => tagsData[b] - tagsData[a]);

		// Keep only the highest 4 tags and put the rest in an "Others" category
		const topTags = sortedTags.slice(0, 4);
		const otherTotal = sortedTags.slice(4).reduce((acc, tag) => acc + tagsData[tag], 0);

		const theme = getThemesfromLS();

		chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: [...topTags, 'Others'],
				datasets: [
					{
						data: [...topTags.map((tag) => tagsData[tag]), otherTotal],
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
		});
	});
</script>

<canvas id="myChart" />
