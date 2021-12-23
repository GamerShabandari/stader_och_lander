
const navBar = document.getElementById("navBar");
const mainContainer = document.getElementById("mainContainer");
const cityDetailsContainer = document.getElementById("cityDetailsContainer");
const citiesIHaveVisited = document.getElementById("citiesIHaveVisited");
let totalPopulationOfVisitedCities = 0;


////////////////////////////////////////////////////////////////////////////////

Promise.all([
    fetch("land.json").then(response => response.json()),
    fetch("stad.json").then(response => response.json()),

])
    .then(jsonData => {

        let countries = jsonData[0];
        let cities = jsonData[1];
        renderNavbar(countries);
        renderMainCities(cities);
        citiesVisited(cities)
    });

////////////////////////////////////////////////////////////////////////////////

function renderNavbar(countries) {


    for (let i = 0; i < countries.length; i++) {
        const navbarCountrie = countries[i];
        const menuDiv = document.createElement("div");
        menuDiv.id = navbarCountrie.id;
        menuDiv.innerText = navbarCountrie.countryname;

        navBar.append(menuDiv);

    }
};

////////////////////////////////////////////////////////////////////////////////

function renderMainCities(cities) {

    navBar.addEventListener("click", function (event) {

        let chosenCountry = event.target.id;
        mainContainer.innerHTML = "";
        cityDetailsContainer.innerHTML = "";

        navBar.className = "land" + event.target.id;


        for (let i = 0; i < cities.length; i++) {
            const cityToMain = cities[i];

            if (cityToMain.countryid == chosenCountry) {

                //console.log(cityToMain);
                const countryContainerDiv = document.createElement("div");
                countryContainerDiv.id = cityToMain.id;
                countryContainerDiv.innerText = cityToMain.stadname;

                mainContainer.append(countryContainerDiv);

            }

        }

        renderChosenCityInfo(cities)

    });

};

////////////////////////////////////////////////////////////////////////////////

function renderChosenCityInfo(chosenCities) {

    mainContainer.addEventListener("click", function (event) {

        cityDetailsContainer.innerHTML = "";

        for (let i = 0; i < chosenCities.length; i++) {
            const chosenCity = chosenCities[i];

            if (chosenCity.id == event.target.id) {

                const cityDetails = document.createElement("div");
                cityDetails.id = chosenCity.stadname;
                const cityPopulation = document.createElement("h2");
                cityPopulation.innerText = chosenCity.population;
                const visitedBtn = document.createElement("button");
                visitedBtn.id = "visitedBtn";
                visitedBtn.innerText = "Besökt";

                cityDetails.append(cityPopulation, visitedBtn);
                cityDetailsContainer.append(cityDetails);

                visitedBtn.addEventListener("click", function () {

                    let storageSerialized = localStorage.getItem("besöktastäder");

                    if (storageSerialized) {

                        let storageDeSerialized = JSON.parse(localStorage.getItem("besöktastäder"));
                        storageDeSerialized.push(chosenCity.id)
                        localStorage.setItem("besöktastäder", JSON.stringify(storageDeSerialized));

                    } else {

                        let besoktaStader = [];
                        besoktaStader.push(chosenCity.id);
                        localStorage.setItem("besöktastäder", JSON.stringify(besoktaStader));

                    }

                    sumOfAllPopulation(chosenCity.population);

                });

            }

        }

    });

};

////////////////////////////////////////////////////////////////////////////////

function citiesVisited(cities) {

    citiesIHaveVisited.addEventListener("click", function () {

        navBar.append("total invånare alla besökta städer: " , totalPopulationOfVisitedCities);
    
        let storageSerialized = localStorage.getItem("besöktastäder");
    
        if (storageSerialized) {
    
            let storageDeSerialized = JSON.parse(localStorage.getItem("besöktastäder"));
            
            for (let i = 0; i < storageDeSerialized.length; i++) {
                const cityVisited = storageDeSerialized[i];
                
                for (let i = 0; i < cities.length; i++) {
                    const cityCheck = cities[i];

                    if (cityCheck.id == cityVisited) {

                        console.log(cityCheck.stadname);

                        let visitedCityContainer = document.createElement("h1");
                        visitedCityContainer.innerText = cityCheck.stadname;

                        navBar.append(visitedCityContainer);
                        
                    }
                    
                }
                
            }
    
        } else {

            // mainContainer.innerText = "tomt här";
            // mainContainer.insertAdjacentHTML("beforeend", "hejhej")
    
        }
    
    });

};

////////////////////////////////////////////////////////////////////////////////

function sumOfAllPopulation(populationToAdd) {

    totalPopulationOfVisitedCities = totalPopulationOfVisitedCities + populationToAdd;

};

////////////////////////////////////////////////////////////////////////////////