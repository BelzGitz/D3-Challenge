// Set up our chart
//= ================================
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // append an SVG group 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the mojoData.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(data) {
  
  //   Parse data and cast as numbers
  
  data.forEach(function(data){
      data.smokes = +data.smokes;
      data.age = +data.age;
      // console.log("Smokers:", data.smokes);
      // console.log("Age:", data.age)
  });

  // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.age)*.9,d3.max(data, d => d.age) *1.1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.smokes)*.9,d3.max(data, d => d.smokes)*1.1])
      .range([height, 0]);
// Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(10);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

// Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

 //  Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill","#89bdd3")
    .attr("opacity", ".5");

    //Create Circles labels
    // ==============================
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text")
    
    circleLabels
    .attr("x", function(d) {
      return xLinearScale(d.age);
    })
    .attr("y", function(d) {
      return yLinearScale(d.smokes);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

// Initialize tool tip

// Create axes labels
   chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age (median)");
    
  })  .catch(function(error) {
       console.log(error);
  });
  
