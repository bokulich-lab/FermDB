/* * * * * * * * * * * * * *
*      class mapBarVis     *
* * * * * * * * * * * * * */

class mapBarVis {
    constructor(parentElement, dataTopographic, fermData){
        this.parentElement = parentElement;
        this.dataTopographic = dataTopographic;
        this.fermData = fermData;
        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 40, bottom: 40, left: 30};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        vis.world = topojson.feature(vis.dataTopographic, vis.dataTopographic.objects.countries).features;

        // scales for color
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner (0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        vis.colorScale = d3.scaleSequential(d3.interpolateViridis);


        // init axes
        vis.xAxis = d3.axisBottom(vis.x)
        vis.yAxis = d3.axisLeft(vis.y)

        // create groups
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .style("font-family", "Poppins")
            .style("font-size", ".8em")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .style("font-size", "1em")
            .style("font-family", "Poppins")
            .call(vis.yAxis);

        vis.wrangleData();
    }

    wrangleData() {
        // same wrangleData as mapVis, since linked
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
                        ID: currID,
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
                        ID: currID,
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
                        ID: currID,
                        country: currName,
                        allFerms: allFerms,
                        fermsOfThisCat: fermsOfThisCat,
                    }
                )

            }
        })

        // get the top eight countries
        vis.countryInfo.sort((a,b) => {return b.fermsOfThisCat - a.fermsOfThisCat})

        vis.topEightData = vis.countryInfo.slice(0, 8)

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        // update domains
        vis.x.domain(vis.topEightData.map(d => d.country));
        vis.y.domain([0, d3.max(vis.topEightData, d => d.fermsOfThisCat)]);

        // update color scale
        vis.colorScale.domain([0, d3.max(vis.countryInfo, d => d.fermsOfThisCat)]);

        // append bars
        vis.bars = vis.svg.selectAll('rect')
            .data(vis.topEightData, d => d.country);

        vis.bars.enter()
            .append('rect')
            .merge(vis.bars)

            // highlight bars on mouseover and linked countries
            .on("mouseover", function(event, d) {
                selectedCountry = d.country;
                let currData = []
                let selectedID = d.ID;

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

                        if (currData.allFerms !== 0){
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
                     <div>
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
                selectedCountry = d.country;
                let selectedID = d.ID;

                d3.selectAll(`.country-${selectedID}`)
                    .attr("fill", d => {
                        let countryName = selectedCountry;
                        let color = " ";

                        vis.countryInfo.forEach(country =>{
                            if (countryName === country.country){
                                if (country.allFerms === 0){
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

            // on click, update dendrogram and make sure text hidden
            .on('click', function(event,d){
                // console.log(d)
                selectedCountryLink = d.ID;
                selectedCountryName = d.country;

                myDendroVis.wrangleData();
            })
            .transition()
            .duration(1000)
            .attr("class", d => {

                return `country-${d.ID}`
            })
            .attr("x", d => vis.x(d.country))
            .attr("y", d => vis.y(d.fermsOfThisCat))
            .attr("width", vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(d.fermsOfThisCat))
            .attr("fill", d => vis.colorScale(d.fermsOfThisCat))
            .attr("opacity", "0.7");

        vis.bars.exit().remove()

        vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);
        vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);

        vis.svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "middle");
    }
}
