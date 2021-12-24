
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

                const cityPopulation = document.createElement("div");
                cityPopulation.innerText = "Antal invånare: " + chosenCity.population;
                const visitedBtn = document.createElement("button");
                visitedBtn.id = "visitedBtn";
                visitedBtn.innerText = "Besökt";
                cityDetailsContainer.append(cityPopulation, visitedBtn);


                //https://en.wikipedia.org/w/rest.php/v1/search/page?q=earth&limit=1


                fetch("https://en.wikipedia.org/w/rest.php/v1/search/page?q="+ chosenCity.stadname +"&limit=1")
                    .then(response => response.json())
                    .then(cityWiki => {

                        console.log(cityWiki);

                    });



                fetch("https://api.openweathermap.org/data/2.5/find?q=" + chosenCity.stadname + "&units=metric&appid=23effeadc3b3bc19076120fd1e560168")
                    .then(response => response.json())
                    .then(cityWeather => {


                        let temp = cityWeather.list[0].main.temp
                        let tempRounded = Math.round(temp);

                        cityWeatherDetails.innerHTML = "";
                        cityWeatherDetails.append("Just nu är det " + tempRounded + "°C i " + cityWeather.list[0].name)


                        console.log(tempRounded);


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

        const clearVisitedStorageBtn = document.createElement("button");
        clearVisitedStorageBtn.innerText = "Rensa besökta städer";
        clearVisitedStorageBtn.id = "clearVisitedStorageBtn";
        cityDetailsContainer.append(clearVisitedStorageBtn);

        clearVisitedStorageBtn.addEventListener("click", function () {

            localStorage.removeItem("besöktastäder");
            totalPopulationOfVisitedCities = 0;


        });

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

        }

    });

};

////////////////////////////////////////////////////////////////////////////////

function sumOfAllPopulation(populationToAdd) {

    totalPopulationOfVisitedCities = totalPopulationOfVisitedCities + populationToAdd;

};

////////////////////////////////////////////////////////////////////////////////