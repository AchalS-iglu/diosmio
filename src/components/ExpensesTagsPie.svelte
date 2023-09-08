<script lang="ts">
	import Chart from 'chart.js/auto';
	import themes from 'daisyui/src/theming/themes';
	import { getThemesfromLS } from '$lib/utils';

	let chart;
	export let tags: {
		[key: string]: number;
	};

	function setupChartData() {
		const ctx = document.getElementById('myChart') as HTMLCanvasElement;

		// Sort tags by total amount in descending order
		const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

		// Keep only the highest 4 tags and put the rest in an "Others" category

		const topTags = sortedTags.slice(0, 4);
		const otherTotal = sortedTags.slice(4).reduce((acc, tag) => acc + tags[tag], 0);

		const theme = getThemesfromLS();

		return {
			type: 'pie',
			data: {
				labels: topTags.length <= 4 ? topTags : [...topTags, 'Others'],
				datasets: [
					{
						data:
							topTags.length <= 4
								? topTags.map((tag) => tags[tag])
								: [...topTags.map((tag) => tags[tag]), otherTotal],
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

	function makeChart(ctx) {
		const myChart = new Chart(ctx, setupChartData()); //init the chart
		return {
			update(u) {
				myChart.data.datasets[0].data = u;
				myChart.update();
			},
			destroy() {
				myChart.destroy();
			}
		};
	}
</script>

<canvas id="myChart" use:makeChart />
