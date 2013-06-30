// d3.csv('data/data.csv', function (data) {
//  var pre = d3.select('body').append('pre')
//  pre.html(JSON.stringify(data, null, '\t'));
// });


// d3.csv('data/data.csv', function (data) {


// });

function mul (str, num) {
	return num ? Array(num + 1).join(str) : "";
}

data = [
	{
		label: 'intermedijske umetnosti in nove tehnologije',
		count: 3,
		icon: 'icon-globe'
	},
	{
		label: 'oblikovanje, arhitektura in uporabne umetnosti',
		count: 10,
		icon: 'icon-town-hall'
	},
	{
		label: 'interdisciplinarni projekti',
		count: 27,
		icon: 'icon-color-adjust',
	},
	{
		label: 'vizualne umetnosti',
		count: 45,
		icon: 'icon-brush'
	},
	{
		label: 'knjiga, branje, prevajanje',
		count: 67,
		icon: 'icon-book'
	},
	{
		label: 'uprizoritvene umetnosti',
		count: 85,
		icon: 'icon-theatre'
	},
	{
		label: 'filmski in avdiovizualni projekti',
		count: 306,
		icon: 'icon-video'
	}
]

var node = d3.select(".graph").selectAll("div.row")
				.data(data);
				
	node.enter()
		.append("div")
			.attr("class", "row")

	node.append("p")
		.attr("class", "span4")
		.text(function(d){
			return d.label + ' ('+d.count+')';
		})

	node.append("p")
		.attr("class", "span8")
		.html(function(d){
			return mul("<i class='"+d.icon+"'></i> ", d.count);
		})
