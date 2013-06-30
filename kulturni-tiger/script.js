var margin = {top: 40, right: 40, bottom: 40, left: 0},
	width = 1100,
	height = 400;

var data = {};

d3.csv('data/data.csv', function(d) {
	return {
		"org_name": d["IME ORGANIZACIJE / PRODUCENTA"],
		"org_status": d["STATUS organizacije (javna/zasebna)"],
		"project_name": d["IME PROJEKTA"],
		"year": d["LETO razpisa (ko se pridobi podpora EU)"],
		"eu_program": d["Ime programa EU"],
		"eu_official": d["Uradna oznaka oz. naziv razpisa"],
		"eu_description": d["Opomba (podnaslov oz. kratek opis razpisa)"],
		"f_name": d["Ime programa EU (F)"],
		"f_area": d["Področje projekta (F)"],
		"f_type": d["Šifra 2 - 'podpodročje' projekta (F)"]
	}
}, function(err, rows){

	rows.forEach(function(d) {
		if (!data.hasOwnProperty(d.year)) {
			data[d.year] = []
		}

		data[d.year].push(d);
	});

  var svg = d3.select(".graph")
							.append("svg")
						    .attr("width", width + margin.left + margin.right)
						    .attr("height", height + margin.top + margin.bottom)
						    .attr("xmlns", "http://www.w3.org/2000/svg")
						  .append("g")
						    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var years = Object.keys(data);

	var xScale = d3.scale.linear()
								.domain([d3.min(years), d3.max(years)])
								.range([0, width])

	var xAxis = d3.svg.axis()
								.scale(xScale)
								.tickSize(2)
								.tickPadding(8)
								.tickFormat(d3.format(".0f"))
								.orient("top")

			svg.append("g")
					.attr("class", "x axis")
					// .attr("transform", "translate(0,"+ height + ")")
					.attr("transform", "translate(0,10)")
					.call(xAxis)
						.selectAll("text")
						.attr("dx", "20px")

	var html = d3.select(".graph")
							.append("div")

			html.selectAll("p")
				.data(years)
				.enter()
					.append("p")
					.attr("class", "titles")
					.style("top", "0px")
					.style("left", function(d){
						return xScale(d)+"px";
					})
						.selectAll("span")
						.data(function(d){
							return data[d]
						})
						.enter()
							.append("span")
							.attr("class", function(d,i){ if (i % 2) { return "odd" } return "even"; })
							.text(function(d){ return d.project_name; })

					// .text(function(d){
					// 	var projects = []

					// 	data[d].forEach(function(p){
					// 		projects.push(p.project_name)
					// 	})

					// 	return projects.join(" ")
					// })

});