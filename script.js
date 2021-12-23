
const navBar = document.getElementById("navBar");
let mainContainer = document.getElementById("mainContainer");
const cityDetailsContainer = document.getElementById("cityDetailsContainer");
const citiesIHaveVisited = document.getElementById("citiesIHaveVisited");
let cityWeatherDetails = document.createElement("div");
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
        //cityDetailsContainer.innerHTML = "";

        navBar.className = "land" + event.target.id;


        for (let i = 0; i < cities.length; i++) {
            const cityToMain = cities[i];

            if (cityToMain.countryid == chosenCountry) {

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



                fetch("https://api.openweathermap.org/data/2.5/find?q=" + chosenCity.stadname + "&units=metric&appid=23effeadc3b3bc19076120fd1e560168")
                    .then(response => response.json())
                    .then(cityWeather => {

                        cityWeatherDetails.innerHTML = "";
                        cityWeatherDetails.append("Just nu är det " + cityWeather.list[0].main.temp + " grader Celcius i " + cityWeather.list[0].name)

                        cityDetailsContainer.append(cityWeatherDetails);

                    });


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

        cityDetailsContainer.innerHTML = "";

        cityDetailsContainer.append(totalPopulationOfVisitedCities)

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
                        cityDetailsContainer.append(visitedCityContainer);

                    }

                }

            }

        } //else {

        //     mainContainer.innerText = "tomt här";
        //     mainContainer.insertAdjacentHTML("beforeend", "hejhej")

        // }

    });

};

////////////////////////////////////////////////////////////////////////////////

function sumOfAllPopulation(populationToAdd) {

    totalPopulationOfVisitedCities = totalPopulationOfVisitedCities + populationToAdd;

};

////////////////////////////////////////////////////////////////////////////////