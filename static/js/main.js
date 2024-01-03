document.addEventListener('DOMContentLoaded', () => {

   // Code syntax highlighter
   hljs.highlightAll();

   // Draw and refresh Bloch sphere
   myCircle()
});

function myCircle() {
   // For small width screens
   if (window.innerWidth > 440) {
      width = 400
   }
   else {
      width = window.innerWidth * 0.9
   }

    // Params
    baseWidth = 500
    height = width
    stroke_width = 6 * width / baseWidth
    background_graticule_width = 4 * width / baseWidth
    yaw = 20
    pitch = -30
    roll = 30
    r1 = [yaw, pitch, roll]
    r2 = [yaw-40, -pitch, roll]
    radius = width / 2 - stroke_width / 2
    foreground_colour = "#ffffff"
    background_colour = "#888888"
    dotcolour1 = foreground_colour
    dotcolour2 = background_colour
    foregroundRadius = 5
    backgroundRadius = 4
    gridMultiplier = 0.5

    // Get equation data
    amp0 = d3.select("#zero")
    amp1 = d3.select("#one")
    phase = d3.select("#phase")
    phase_sign = d3.select("#phase-sign")

    // Create svg
    let svg = d3.select("#bloch")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

    // Projection and generator
    projection = d3.geoOrthographic()
                       .translate([width / 2, height / 2])
                       .scale(radius)
                       .rotate(r2)
    
    geoGenerator = d3.geoPath()
                     .projection(projection)

    // Background dot
    circle = d3.geoCircle()
                   .center([0, 90])
                   .radius(backgroundRadius)

   northPoleBackground = svg.append("path")
                                 .datum(circle)
                                 .attr("d", geoGenerator)
                                 .style("fill", dotcolour2)               

    circle.center([0, -90])
                     
    // Graticule - background
    graticule = d3.geoGraticule()
                      .step([30, 0])

    svg.append("path")
       .datum(graticule)
       .attr("d", geoGenerator)
       .style("fill", "none")
       .style("stroke", background_colour)
       .style("stroke-width", background_graticule_width)

    // Outer circle
    svg.append("circle")
       .attr("cx", width / 2)
       .attr("cy", height / 2)
       .attr("r", radius)
       .attr("fill", "none")
       .attr("stroke", foreground_colour)
       .attr("stroke-width", stroke_width)

    // Graticule - foreground
    projection.rotate(r1)
    svg.append("path")
       .datum(graticule)
       .attr("d", geoGenerator)
       .style("fill", "none")
       .style("stroke", foreground_colour)
       .style("stroke-width", stroke_width)

    circle.radius(foregroundRadius)

    // Foreground dot
    circle.center([0, 90])

    northPoleForeground = svg.append("path")
                                 .datum(circle)
                                 .attr("d", geoGenerator)
                                 .style("fill", dotcolour1)               

    circle.center([0, -90])              

    window.addEventListener('mousemove', (event) => {
        x = 360 * event.clientX / window.innerWidth - 180
        y = 90 - 180 * event.clientY / window.innerHeight

        redraw_axes(x, y)
    })

    window.addEventListener("touchmove", (event) => {
      x = 360 * event.changedTouches[0].screenX / window.innerWidth - 180
      y = 90 - 180 * event.changedTouches[0].screenY / window.innerHeight
      
      redraw_axes(x, y)
    })
}

function redraw_axes(x, y) {

   theta = Math.PI / 2 - Math.PI * y / 180
   phi = Math.PI * x / 180
   amp0.node().innerHTML = `${(Math.cos(theta / 2)).toFixed(3)}`
   amp1.node().innerHTML = `${(Math.sin(theta / 2)).toFixed(3)}`
   phase.node().innerHTML = `${Math.abs(phi).toFixed(3)}`

   if (phi >= 0) {
      phase_sign.node().innerHTML = '+'
   }
   else {
      phase_sign.node().innerHTML = '-'
   }

   projection.rotate(r1)

   circle.radius(foregroundRadius)
   circle.center([x, y])
   northPoleForeground.datum(circle)
                     .attr("d", geoGenerator)

   circle.center([x + 360, y + 180])

   projection.rotate(r2)

   circle.radius(backgroundRadius)
   circle.center([-x + 180, y + 180])

   circle.center([-x-180, y])
   northPoleBackground.datum(circle)
                     .attr("d", geoGenerator)
}
