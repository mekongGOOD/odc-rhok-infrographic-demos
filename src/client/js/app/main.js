$(function () {
	//window.chart = $('#container').highcharts({
	window.chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container',
			type: 'column'
		},
		title: {
			text: 'Cambodia Literacy History'
		},
		xAxis: {
			categories: ['1998', '2008']
		},
		yAxis: {
			title: {
				text: 'Overall Literacy ratio'
			}
		},
		series: [
			{
				name: 'A village',
				data: [50, 60]
			},
			{
				name: 'A medium city',
				data: [70, 80]
			},
			{
				name: 'A big city',
				data: [90, 100]
			}
		]
	});
});
