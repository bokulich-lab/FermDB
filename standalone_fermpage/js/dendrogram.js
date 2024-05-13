/* * * * * * * * * * * * * *
*      class dendroVis     *
* * * * * * * * * * * * * */
class dendroVis {
    constructor(parentElement, dataDendro) {
        this.parentElement = parentElement;
        this.dataDendro = dataDendro;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 10, bottom: 20, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.space = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.g = vis.space.append("g").attr("transform", "translate(60,0)");


        // prepare functions for data later
        vis.cluster = d3.cluster()
            .size([vis.height, vis.width - vis.width/3]);

        vis.stratify = d3.stratify()
            .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });


        selectedCountryLink = "India";
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        vis.filteredData1 = vis.dataDendro.filter((word) => word.id.startsWith(selectedCountryLink))

        // filter data for category
        if (selectedFood === "all") {
            vis.filteredData = vis.filteredData1
        } else {
            vis.filteredData = vis.filteredData1.filter((word) => word.id.includes(selectedFood))
            vis.filteredData.push({id: selectedCountryLink})
        }

        // prepare data for dendrogram
        vis.root = vis.stratify(vis.filteredData)
            .sort(function (a, b) {
                return (a.height - b.height) || a.id.localeCompare(b.id);
            });

        // clear drawing area for next selection
        vis.g.selectAll(".link")
            .remove()
        vis.g.selectAll(".node")
            .remove()
        vis.g.selectAll(".text-node")
            .remove()
        vis.space.selectAll(".dendroTitleText")
            .remove()
        vis.space.selectAll(".dendroSubText")
            .remove()
        vis.space.selectAll(".dendroNoText")
            .remove()

        // append text for selected country and category
        vis.space.append("text")
            .attr("class", "dendroTitleText")
            .attr("x", vis.width / 20)
            .attr("dy", "0em")
            .attr("y", "4vh")
            .attr("background-color", "#FCF5E5")
            .style("text-anchor", "left")
            .text(selectedCountryLink)

        vis.space.append("text")
            .attr("class", "dendroSubText")
            .attr("x", vis.width / 20)
            .attr("y", "4vh")
            .attr("dy", "1.5em")
            .attr("background-color", "#FCF5E5")
            .style("text-anchor", "left")
            .text(selectedFood)

        // draw vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        // catch exception if country doesn't have data otherwise draw dendrogram
        if (vis.filteredData.length === 1) {
            vis.space.append("text")
                .attr("class", "dendroNoText")
                .attr("x", vis.width / 20)
                .attr("y", vis.height / 2)
                .attr("background-color", "#FCF5E5")
                .style("text-anchor", "left")
                .text("No recorded fermented foods in this sub-category.")

        } else {
            vis.cluster(vis.root);

            vis.link = vis.g.selectAll(".link")
                .data(vis.root.descendants().slice(1));

            vis.link.enter()
                .append("path")
                .attr("class", "link")
                .attr("d", diagonal);

            vis.node = vis.g.selectAll(".node")
                .data(vis.root.descendants())

            vis.node.enter()
                .append("g")
                .attr("class", function (d) {
                    return "node" + (d.children ? " node--internal" : " node--leaf");
                })
                .attr("transform", function (d) {
                    return "translate(" + (d.y - 25) + "," + d.x + ")";
                })
                .append("circle")
                .attr("r", 4);

            vis.node.enter()
                .append("text")
                .attr("class", "text-node")
                .attr("transform", function (d) {
                    return "translate(" + (d.y - 25) + "," + d.x + ")";
                })
                .attr("dy", 3)
                .attr("background-color", "#FCF5E5")
                .attr("x", function (d) {
                    return d.children ? -10 : 5;
                })
                .style("text-anchor", function (d) {
                    return d.children ? "end" : "start";
                })
                .text(function (d) {
                    if (d.id.substring(d.id.lastIndexOf(".") + 1) === selectedCountryLink) {
                        return (" ")
                    } else {
                        return d.id.substring(d.id.lastIndexOf(".") + 1);
                    }
                });

            function diagonal(d) {
                return "M" + (d.y - 25) + "," + d.x
                    + "C" + (d.parent.y + 100) + "," + d.x
                    + " " + (d.parent.y + 100) + "," + d.parent.x
                    + " " + (d.parent.y - 25) + "," + d.parent.x;
            }

        }
    }
}

