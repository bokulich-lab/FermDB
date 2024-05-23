/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */
class MapVis {
    constructor(parentElement, dataTopographic, fermData) {
        this.parentElement = parentElement;
        this.dataTopographic = dataTopographic;
        this.fermData = fermData;
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.legendSVG = d3.select(".legendSVG").append("svg")
            .attr("width", vis.width/2)
            .attr("height", "11vh")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / (vis.viewpoint.width);

        // vis.projection = d3.geoOrthographic()
        vis.projection = d3.geoEqualEarth()
            .translate([vis.width / 2, vis.height / 2])
            .scale(170);

        // Define a geogenerator and pass the projection
        vis.path = d3.geoPath()
            .projection(vis.projection);

        // Convert TopoJSON into GeoJSON
        vis.world = topojson.feature(vis.dataTopographic, vis.dataTopographic.objects.countries).features;

        // Add the "water" before the countries
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#A9D3DE')
           // .attr('fill', '#8db9c7')
            .attr("opacity", "0.8")
            .attr("stroke","rgb(255,255,255)")
            .attr("d", vis.path);

        // Draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr("stroke","rgb(255,255,255)")
            // .attr("class", d => `${d.properties.name.replaceAll(' ', '-')}-country country`)
            .attr("class", function (d){
                // console.log(d.id)
                return `country-${d.id} country`
            })
            .attr("d", vis.path);

        // Make the map draggable
        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {
                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )

        /* * * * * * * Tooltip * * * * * * */
        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'globeTooltip')

        vis.colorScale = d3.scaleSequential(d3.interpolateViridis);

        /* * * * * * * instantiate legend * * * * * * */
        vis.colormapWidth = vis.width /4;
        vis.colormapHeight = vis.height/40;

        // Create an axis scale
        vis.axisScale = d3.scaleLinear()
            .range([0, vis.colormapWidth]);

        // Create and append the axis to the SVG
        vis.axis = d3.axisBottom(vis.axisScale)
            .tickFormat(d3.format('d'));

        vis.legend = vis.legendSVG.append("g")
            .attr('class', 'legend')
            .attr("opacity", "0.7")
            .attr('transform', `translate(${100}, ${50 })`)

        vis.legendSVG.append("g")
            .attr('class', 'x-axis')
            .style("font-family", "Poppins")
            .style("font-size", "1em")
            .attr("transform", `translate(${100}, ${75})`);


        vis.wrangleData()
    }

    wrangleData() {
        let vis = this
        let fermByCountry = Array.from(d3.group(vis.fermData, d => d.Country_code), ([key, value]) => ({key, value}))

        // console.log(vis.fermData)
        // init final data structure in which both data sets will be merged into
        vis.countryInfo = []
        vis.selectableFoods = []

        vis.world.forEach(function(d, index) {
            let fermsOfThisCat = 0;
            let allFerms = 0;

            let currName = d.properties.name;
            let currID = d.id;
            let currCountry = fermByCountry.filter((x) => {
                return x.key === currID;
            })[0];

            if (currCountry == null) {
                // populate the final data structure
                vis.countryInfo.push(
                    {
                        country: currName,
                        allFerms: allFerms,
                        fermsOfThisCat: fermsOfThisCat,
                    }
                )
            }
            else if (selectedFood === "all"){
                currCountry.value.forEach(food => {
                    allFerms += 1;
                    fermsOfThisCat += 1;
                    vis.selectableFoods.push(
                        food
                    )
                })
                vis.countryInfo.push(
                    {
                        country: currName,
                        allFerms: allFerms,
                        fermsOfThisCat: fermsOfThisCat,
                    }
                )
            }

            else {
                currCountry.value.forEach(food => {
                    if (food.Category == selectedFood) {
                        //console.log(food.Category, selectedFood)
                        allFerms += 1;
                        fermsOfThisCat += 1;
                        vis.selectableFoods.push(
                            food
                        )
                    } else {
                        allFerms += 1;
                    }
                })

                vis.countryInfo.push(
                    {
                        country: currName,
                        allFerms: allFerms,
                        fermsOfThisCat: fermsOfThisCat,
                    }
                )
            }
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // update color scale
        let currMax = d3.max(vis.countryInfo, d => d.fermsOfThisCat);
        vis.colorScale.domain([1,currMax]);

        // color countries
        vis.countries
            .transition()
            .duration(1000)
            .attr("opacity", "0.7")
            .attr("fill", d => {
                let countryName = d.properties.name;
                let color = " ";

                vis.countryInfo.forEach(country =>{
                    if (countryName === country.country){
                        if (country.fermsOfThisCat === 0){
                            color = "#DCDCDC"
                        }
                        else{
                            color = vis.colorScale(country.fermsOfThisCat)
                        }
                    }
                })

                return color
            })


        vis.countries
            .style('stroke-width', '2px')  // Use style instead of attr for stroke-width
            .style("stroke", "rgba(0,0,0,0.25)")  // Adjust the stroke color as needed
            // highlight on mouseover and link bar
            .on('mouseover', function(event, d){
                selectedCountry = d.properties.name;
                let selectedID = d.id;
                // console.log(selectedCountry, selectedID)

                let currData = []

                vis.countryInfo.forEach(country =>{
                    if (selectedCountry === country.country){
                        currData = country
                    }
                })

                d3.selectAll(`.country-${selectedID}`)
                    .attr("fill", d => {

                        let color = " ";

                        vis.countryInfo.forEach(country =>{
                            if (selectedCountry === country.country){
                                color = vis.colorScale(country.fermsOfThisCat)
                            }
                        })

                        if (currData.fermsOfThisCat !== 0){
                            return '#2680E3'
                        }
                        else{
                            return '#DCDCDC'
                        }
                    })

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(
                        `
                     <div >
                     <h3> ${currData.country}<h3>
                     <h4> Number of ${selectedFood}: ${currData.fermsOfThisCat}</h4>
                     </div>`
                    );
                if (selectedFood === "all"){
                    vis.tooltip
                        .html(
                            `
                     <div >
                     <h3> ${currData.country}<h3>
                     <h4> Total Products: ${currData.allFerms}</h4>
                     </div>`
                        )
                }
                if (currData.allFerms === 0){
                    vis.tooltip
                        .style("opacity", 0)
                }
            })

            // set the color back to what it was
            .on('mouseout', function(event, d){
                let selectedID = d.id;

                d3.selectAll(`.country-${selectedID}`)
                    .attr("fill", d => {
                        let countryName = selectedCountry;
                        let color = " ";

                        vis.countryInfo.forEach(country =>{
                            if (countryName === country.country){
                                if (country.fermsOfThisCat === 0){
                                    color = "#DCDCDC"
                                }
                                else{
                                    color = vis.colorScale(country.fermsOfThisCat)
                                }
                            }
                        })

                        return color
                    })

                // empty the tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

            // update dendro on click
            .on('click', function(event,d){
                selectedCountryLink = d.id;
                selectedCountryName = d.properties.name;

                myDendroVis.wrangleData();
            })

        // Generate a series of color stops to represent the colormap
        //const numStops = Math.max(2, Math.min(8, currMax)); // Ensure at least 2 stops and maximum of 8 stops
        //const step = currMax / (numStops - 1); // Calculate the step size
        //const tickValues = d3.range(1, currMax + step, step).map(d => Math.round(d * 100) / 100);
        // Set the domain for the axis scale
        //vis.axisScale.domain([1, currMax]);    

        // Update the axis with the calculated tick values
        //vis.axis.scale(vis.axisScale)
        //    .ticks(numStops)
        //    .tickValues(tickValues) // Ensure ticks are set at these values
        //    .tickFormat(d3.format("d")); // Format the ticks to one decimal place
        // Update the axis
        //vis.legendSVG.select(".x-axis")
        //    .transition()
         //   .duration(1000)
        //    .call(vis.axis);    


        //vis.legend.selectAll("rect").remove();


        // Draw the colormap
       //vis.legend.selectAll("rect")
        //    .data(tickValues)
        //    .enter()
        //    .append("rect")
        //    .attr("x", d => vis.axisScale(d) - (vis.colormapWidth / numStops / 2))
        //    .attr("y", 0)
        //    .attr("width", vis.colormapWidth / numStops)
        //    .attr("height", vis.colormapHeight)
        //    .attr("fill", d => vis.colorScale(d))
        //    .transition();
    }        
}