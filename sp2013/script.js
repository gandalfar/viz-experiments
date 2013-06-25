// d3.tsv('data/SP2013_SPL.csv', function (data) {
//  var pre = d3.select('body').append('pre')
//  pre.html(JSON.stringify(data, null, '\t'));
// });

var margin = {top: 1, right: 100, bottom: 6, left: 1},
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " EUR"; },
    color = d3.scale.category20();

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

d3.json("data/SP2013_SPL.json", function(data) {

  sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32);

  var link = svg.append("g").selectAll(".link")
      .data(data.links)
    .enter().append("path")
      .attr("class", function(d){ 
        // console.log(d);
        if (d.source.name.indexOf('50') === 0 || 
            d.target.name.indexOf('55') === 0 ||
            d.target.name.indexOf('403') === 0 ||
            d.target.name.indexOf('404') === 0) {
          return "link red";
        }
        return "link";
      })
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { console.log(d); return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return calc_color(d); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { 
        if (d.name.length > 30) {
          return d.name.substr(0,30)+' ..';
        }
        return d.name; 
      })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }

  function calc_color(d) {
    if (d.name.indexOf('50') === 0 || d.name.indexOf('55') === 0) {
      return 'rgb(215,48,39)';
    }
    return d.color = color(d.name.replace(/ .*/, ""));
  }  
});
