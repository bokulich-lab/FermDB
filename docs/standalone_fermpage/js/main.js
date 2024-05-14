/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myMapVis,
    myBarVisOne,
    categoryNames,
    myDendroVis;

let mode = 'beg';
// grab selected category of foods for mapVis
let selectedFood = d3.select("#categorySelector").property("value");
let selectedCountry = '';

// load data
let promises = [
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"), // 0
    d3.csv("data/Map_category.csv"), // 1
    d3.csv("data/DendrogramData.csv"), // 2
];

let initialized = false;

function initPage() {

    if (!initialized) {
        Promise.all(promises)
            .then(function (data) {
                categoryNames = [... new Set(data[1].map(row => row.Category))];
                initMainPage(data)
            }
            )
            .catch(function (err) {
                console.log(err)
            }
        );
        initialized = true;
    }
}

// when category of food changes, update for mapVis, dendroVis, and mapBarVis
function categoryChange() {
    selectedFood =  document.getElementById('categorySelector').value;
    myMapVis.wrangleData();
    myBarVisOne.wrangleData();
    myDendroVis.wrangleData();
}

// initMainPage
function initMainPage(dataArray) {
    // console.log('check out the data', dataArray);
    selectedCountryLink = '';
    selectedCountryName = '';

    // init map
    myMapVis = new MapVis('mapDiv', dataArray[0], dataArray[1]);
    // init top 10 graph
    myBarVisOne = new mapBarVis('barplotDiv',  dataArray[0], dataArray[1]);
    // // init dendrogram
    myDendroVis = new dendroVis('dendroDiv', dataArray[2]);
}



