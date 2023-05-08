// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#line_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("covid_og.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%m/%d/%y")(d.date), positive : d.positive }
  }).then(

  // use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.positive; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // This allows to find the closest X index of the mouse:
    const bisect = d3.bisector(function(d) { return d.date; }).left;

    // Create the circle that travels along the curve of chart
    const focus = svg
      .append('g')
      .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 0)

    // Create the text that travels along the curve of chart
    const focusText = svg
      .append('g')
      .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3399ff")
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.positive) })
        )

      // Create a rect on top of the svg area: this rectangle recovers mouse position
    svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
  focus.style("opacity", 1)
  focusText.style("opacity",1)
  }

  function mousemove(event) {
    // recover coordinate we need
    const x0 = x.invert(d3.pointer(event)[0]);
    const i = bisect(data, x0, 1);
    selectedData = data[i-1];
    focus
      .attr("cx", x(selectedData.date))
      .attr("cy", y(selectedData.positive))
    focusText
      .html("Date: " + d3.timeFormat("%m/%d/%y")(selectedData.date) + "  -  " + "Positive-Cases: " + selectedData.positive)
      .attr("x", x(selectedData.date)+15)
      .attr("y", y(selectedData.positive))
  }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }


})