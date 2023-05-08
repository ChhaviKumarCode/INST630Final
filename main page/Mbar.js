// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 1700 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#Mbar_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
  .range([0, width])
  .padding(0.3);

// Create an x-axis group element and position it at the bottom of the chart
const xAxis = svg.append("g")
  .attr("transform", 'translate(0, ${height})');

// Define the y-axis scale as a linear scale for numerical data
const y = d3.scaleLinear()
  .range([height, 0]);

// Create a y-axis group element
const yAxis = svg.append("g");

// Update the plot with new data based on the selected variable
function update(selectedVar) {
  // Load the data and parse each row
  d3.csv("bar.csv", function (d) {
    return {
      date: d3.timeParse("%m/%d/%y")(d.date),
      positive: +d.positive,
      death: +d.death
    };
  }).then(function (data) {
    x.domain(data.map(d => d.date));
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    // Add Y axis
    y.domain([0, d3.max(data, d => +d[selectedVar])]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // variable u: map data to existing bars
    const u = svg.selectAll("rect")
      .data(data)

    // update bars
    u.join("rect")
      .transition()
      .duration(1000)
      .attr("x", d => x(d.date))
      .attr("y", d => y(d[selectedVar]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d[selectedVar]))
      .attr("fill", "#996699")
  });
}

// Initialize plot
update('positive');