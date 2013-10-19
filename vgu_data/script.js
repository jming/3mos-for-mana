var init = function() {
  stage();
};

  var debug = function(text) {
  d3.select("#debug")
      .text(text);
};

  var stage = function() {
  // Dimensions
  var numPies = 8,
      margin = 20,
      width = 750,
      height = width / numPies;
      height2 = 50;

  // Objects
  var div = d3.select("#plot")
      .attr("style", "width: " + (width + margin * 4) + "px");

  // Scale
  var x = d3.scale.linear()
      .domain([0, numPies * 100])
      .range([margin, width + margin]);
  var endAngle = d3.scale.linear()
      .domain([0, 1])
      .range([0, 2 * Math.PI]);

  var endAngle = d3.scale.linear()
      .domain([0, 1])
      .range([0, 2 * Math.PI]);

  // Arc generator
  var startAngle = 0;
  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius((height / 2) - (margin / 2))
      .startAngle(startAngle)
      .endAngle(function(d) { return -endAngle(d) + startAngle; });

  // Pie container
  var pieContainer = div.append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height)
    .append("g")
      .attr("class", "pie")
      .attr("transform", "translate(" + (0.5 + margin + height / 2) + "," + (0.5 + height / 2) + ")");
  var m = div.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 100)
      .attr("height", 200);

  // Brush
  var brushContainer = d3.select("#plot").append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height2)
    .append("g")
      .attr("class", "brush");

  var brush = d3.svg.brush().x(x);

  // Text
  brushContainer.append("text")
      .attr("transform", "translate(" + margin + "," + (height2 / 2 + 10) + ")")
      .text("Click and drag here");

  // Axes
  var xAxis = d3.svg.axis().scale(x);
  brushContainer.call(xAxis);

  brushContainer
      .call(brush)
  brushContainer.selectAll("rect")
      .attr("y", 0)
      .attr("height", height2);

  brush.on("brush", onbrush.call(brush, pieContainer, arc, height));
};

var onbrush = function(pieContainer, arc, height) {
  // Closure variables
  var arr = [],
      n, r, extent, diff, pies, labels;

  return function() {
    // Prepare data
    arr = [];
    extent = d3.event.target.extent();
    diff = (extent[1] - extent[0]) / 100;
    n = Math.floor(diff);
    r = diff - n;
    while (n) {
      arr.push(1);
      --n;
    }
    if (r > 1e-6) arr.push(r);

    // Update plot
    pies = pieContainer.selectAll(".pie")
        .data(arr);
    pies.attr("d", function(d) { return arc(d); });
    pies.enter().append("path")
        .attr("class", "pie")
        .attr("transform", function(d, idx) { return d3.transform("matrix(1,0,0,1," + (idx * height) + ",0)").toString(); })
    pies.exit().remove();

    labels = pieContainer.selectAll("text")
        .data(arr);
    labels.text(function(d) { return d3.format(".0f")(d * 100) + "%"; });
    labels.enter().append("text")
        .attr("transform", function(d, idx) { return d3.transform("matrix(1,0,0,1," + (idx * height - 10) + "," + 20 + ")").toString(); });
    labels.exit().remove();
  };
};

window.onload = init;
