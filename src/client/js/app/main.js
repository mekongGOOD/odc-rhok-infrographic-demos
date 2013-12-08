(function ($, _) {
	var SERVER_URL = '//192.168.6.181:9090',
		CENSUS_1998_PROVINCES_URL = SERVER_URL + '/census/1998/provinces?per_page=100000',
		CENSUS_2008_PROVINCES_URL = SERVER_URL + '/census/2008/provinces?per_page=100000';
	// var SERVER_URL = '//localhost:8080',
	// 	CENSUS_1998_PROVINCES_URL = SERVER_URL + '/json/census_2008-provinces.json';

	/////////
	// UTILS
	/////////

	/*
	"code": "12",
	"name": "Phnom Penh",
	"totpop": 999804,
	"males": 481911,
	"females": 517893,
	"density": 3447.6,
	"sexratio": 93.1,
	"t_lit15": 85,
	"m_lit15": 92.3,
	"f_lit15": 78.6,
	*/

	var getData = function (url) {
		return $.ajax({
			url: url,
			dataType: 'json',
			error: function (err) {
				console.error(arguments);
			}
		});
	};

	var setupChart = function (serieData) {
		var chart,
		categories = ['1998', '2008'];

		chart = new Highcharts.Chart({
			chart: {
				type: 'bar',
				// type: 'column',
				renderTo: 'container'
			},
			title: {
				text: 'Literacy levels in Cambodia'
			},
			subtitle: {
				text: 'Cambodian census'
			},
			xAxis: [{
				categories: categories,
				reversed: false
			}, { // mirror axis on right side
				opposite: true,
				reversed: false,
				categories: categories,
				linkedTo: 0
			}],
			yAxis: {
				title: {
					text: null
				},
				labels: {
					formatter: function () {
						return Math.abs(this.value) + '%';
					}
				},
				min: -100,
				max: 100
			},

			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},

			tooltip: {
				formatter: function () {
					return '<b>' + this.series.name + ', year ' + this.point.category + '</b><br/>' + 'Literacy: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
				}
			},

			// series: [{
			// 	name: 'Male',
			// 	data: [-1746181, -1884428]
			// }, {
			// 	name: 'Female',
			// 	data: [1656154, 1787564]
			// }]
			series: serieData,

			__test_series: [
				{
					name: 'P1 - Male',
					data: [-1746181, - 1884428],
					stack: 'P1'
				},
				{
					name: 'P1 - Female',
					data: [1656154, 1787564],
					stack: 'P1'
				},
				{
					name: 'P2 - Male',
					data: [-1746181, - 1884428],
					stack: 'P2'
				}, {
					name: 'P2 - Female',
					data: [1656154, 1787564],
					stack: 'P2'
				},
					            {
					name: 'P3 - Male',
					data: [-1746181, - 1884428],
					stack: 'P3'
				}, {
					name: 'P3 - Female',
					data: [1656154, 1787564],
					stack: 'P3'
				}
			]
		});

		return chart;
	};

	getData(CENSUS_1998_PROVINCES_URL).done(function (data1998) {
		//DEBUG
		console.log('received data1998: ', data1998);
		getData(CENSUS_2008_PROVINCES_URL).done(function (data2008) {
			//DEBUG
			console.log('received data2008: ', data2008);

			var allowedProvinces = [
					// 'Banteay Meanchey',
					'Battambang',
					// 'Kampong Cham',
					// 'Kampong Chhnang',
					// 'Kampong Speu',
					// 'Kampong Thom',
					// 'Kampot',
					// 'Kandal',
					// 'Kep',
					// 'Koh Kong',
					// 'Kratie',
					// 'Mondulk Kiri',
					// 'Oddar Meanchey',
					// 'Pailin',
					'Phnom Penh',
					// 'Preah Sihanouk',
					// 'Preah Vihear',
					// 'Prey Veng',
					// 'Pursat',
					// 'Ratanak Kiri',
					// 'Siem Reap',
					// 'Stung Treng',
					// 'Svay Rieng',
					// 'Takeo'
				],
				years = [1998, 2008],
				seriesData = [],
				filteredData = {};

			filteredData[1998] = _.filter(data1998, function (item) {
				return allowedProvinces.indexOf(item.name) > -1;
			});

			filteredData[2008] = _.filter(data2008, function (item) {
				return allowedProvinces.indexOf(item.name) > -1;
			});

			//DEBUG
			console.log('filteredData = ', filteredData);

			// for each province
			_.each(allowedProvinces, function(province){
				// for male / female
				_.each(
					[
						{
							title: 'Male',
							colTitle: 'm_lit15',
							multiplier: -1
						},
							{
							title: 'Female',
							colTitle: 'f_lit15',
							multiplier: 1
						}
					], function(genderConfig) {
						var curSerie = {
							name: province + ' - ' + genderConfig.title,
							data: [],
							stack: province
						};

						_.each(years, function(year){
							var yearData = filteredData[year],
								targetDataItem = _.findWhere(yearData, { name: province });

							if (targetDataItem) {
								curSerie.data.push( +(targetDataItem[genderConfig.colTitle]) * genderConfig.multiplier );
							}
						});

						seriesData.push(curSerie);
					}
				);
			});

			/*_.each([
				{
					title: 'Male',
					colTitle: 'm_lit15'
				},
					{
					title: 'Female',
					colTitle: 'f_lit15'
				}
			],

			function (serieConfig) {
				var curSerieData = [];

				_.each([1998, 2008], function (year) {
					var yearData = filteredData[year];
					_.each(yearData, function (item) {
						curSerieData.push(item[serieConfig.colTitle]);
					});
				});

				seriesData.push({
					name: serieConfig.title,
					data: curSerieData
				})
			});
*/
			console.log('seriesData = ', seriesData);

			// on ready init
			$(function () {
				setupChart(seriesData);
			});
		});
	});

})(window.jQuery, window._);