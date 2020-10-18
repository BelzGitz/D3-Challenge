var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight); 

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Import Data from data.csv
d3.csv("assets/data/data.csv").then(function (data,err){
  if (err) throw err;

 // parse data and cast as numbers

 data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.income = +data.income;
   });

// function used for updating x-scale var upon click on axis label
    function xScale(data, chosenXAxis) {
      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * .8,
          d3.max(data, d => d[chosenXAxis]) * 1.3
        ])
        .range([0, width]);
    
      return xLinearScale;
     }

  // function used for updating y-scale var upon click on axis label
     function yScale(data, chosenXAxis) {
       // create scales
       var yLinearScale = d3.scaleLinear()
         .domain([d3.min(data, d => d[chosenYAxis]) * .8,
           d3.max(data, d => d[chosenYAxis]) * 1.3
         ])
         .range([0, height]);
     
       return yLinearScale;
      }

//  function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
    
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
      return xAxis;
    }

//  function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles for x and y axes
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
  }

  function renderText(circlesText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return circlesText;
    }
  
  

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup,chosenXAxis, chosenYAxis) {

  var xLabel;
  var yLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "In Poverty (%):";
  }
  else if (chosenXAxis === "age"){
    xLabel = "Age (median):";
  }
  else {
    xLabel = "Household Income (medium):"
  }

  // for yaxis label

  if (chosenYAxis === "healthcare"){
    yLabel = "Lacks healthcare";
  }
  else if(chosenYAxis === "smokes"){
    yLabel = "Smokes (%)";
  }
  else{
    yLabel = "Obese (%)"
  }

  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`)
  
  })
  
  circlesGroup.call(toolTip);

  circlesText.on("mouseover", function(data){
    toolTip.show(data);
  })

// onmouseout event
.on("mouseout", function(data, index) {
  toolTip.hide(data);
  });

  return circlesGroup;
}

// xLinearScale function above csv import
var xLinearScale = xScale(data, chosenXAxis);
// var yLinearScale = yScale(data, chosenYAxis);

// / Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);
     
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// /Create scatterplot and  append initial circles
var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr("r", "15")
.classed("stateCircle", true)

 var circlesText = chartGroup.selectAll("text")
 .data(data)
.enter().append("text")
.attr("x", d => xLinearScale(d[chosenXAxis]))
.attr("y",d => yLinearScale(d[chosenYAxis]))
.attr("dy",".35em")
.text((d) => d.abbr)
.classed("stateText", true)

// append x axis
var xAxis = chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
.call(leftAxis);

// Create group for 3 x-axis labels
var xlabelsGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

var ageLabel = xlabelsGroup.append("text")
    .attr("x",0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)")
    
  // Create group for 3 y-axis labels
var ylabelsGroup = chartGroup.append("g");

var healthcareLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -(height / 2))
.attr("y", -40)
.attr("value", "healthcare") // value to grab for event listener
.classed("active", true)
.text("Lacks Healthcare (%)");

var smokesLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -(height / 2))
.attr("y", -60)
.attr("value", "smokes") // value to grab for event listener
.classed("inactive", true)
.text("Smokes (%)");

var obeseLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -(height / 2))
.attr("y", -80)
.attr("value", "obesity") // value to grab for event listener
.classed("inactive", true)
.text("Obese (%)");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(circlesGroup,chosenXAxis,chosenYAxis);

// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

 // replaces chosenXAxis with value
    chosenXAxis = value;

// updates x scale for new data
  xLinearScale = xScale(data, chosenXAxis);

// updates x axis with transition
  xAxis = renderXAxes(xLinearScale, xAxis);

// updates circles with new x values
  circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);

// update circles text with new x values
  circlesText = renderText(circlesText, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis)


// updates tooltips with new info
circlesGroup = updateToolTip(circlesGroup,chosenXAxis,chosenYAxis);

  // changes classes to change bold text
  if (chosenXAxis === "age") {
    povertyLabel
      .classed("active", false)
      .classed("inactive", true);
    ageLabel
      .classed("active", true)
      .classed("inactive", false);
    incomeLabel
      .classed("active", false)
      .classed("inactive",true);
  }
  else if (chosenXAxis === "income"){
    povertyLabel
        .classed("active",false)
        .classed("inactive", true);
    ageLabel
         .classed("active", false)
         .classed("inactive", true);
   incomeLabel
          .classed("active", true)
          .classed("inactive", false);
  }
 else {
   povertyLabel
        .classed("active", true)
        .classed("inactive", false);
    ageLabel
        .classed("active", false)
        .classed("inactive", true);
    incomeLabel
        .classed("active", false)
        .classed("inactive", true);

      }
  }
  })

// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {

// get value of selection
var value = d3.select(this).attr("value");
if (value !== chosenYAxis) {

  // replaces chosenXAxis with value
  chosenYAxis = value;


 // updates y scale for new data
 yLinearScale = yScale(data, chosenYAxis);

 // updates y axis with transition
 yAxis = renderYAxes(yLinearScale, yAxis);

 // updates circles with new y values
 circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);

 // updates circles text with new y values
 circlesText = renderText(circlesText, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis)

 // updates tooltips with new info
 circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

// changes classes to change bold text
if (chosenYAxis === "smokes") {
  healthcareLabel
    .classed("active", false)
    .classed("inactive", true);
  smokesLabel
    .classed("active", true)
    .classed("inactive", false);
  obeseLabel
    .classed("active", false)
    .classed("inactive", true);
}

else if (chosenYAxis === "obesity"){
  healthcareLabel
    .classed("active", false)
    .classed("inactive", true);
  smokesLabel
    .classed("active", false)
    .classed("inactive", true);
  obeseLabel
    .classed("active", true)
    .classed("inactive", false);
}
else {
  healthcareLabel
    .classed("active", true)
    .classed("inactive", false);
  smokesLabel
    .classed("active", false)
    .classed("inactive", true);
  obeseLabel
    .classed("active", false)
    .classed("inactive", true);
  }
 
}

});
}).catch(function(error){
  console.log(error);
});

