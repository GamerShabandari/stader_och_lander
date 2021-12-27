
const navBar = document.getElementById("navBar");
const mainContainer = document.getElementById("mainContainer");
const cityDetailsContainer = document.getElementById("cityDetailsContainer");
const citiesIHaveVisited = document.getElementById("citiesIHaveVisited");
const footerContainer = document.getElementById("footerContainer");
const cityWeatherDetails = document.createElement("div");
let totalPopulationOfVisitedCities = 0;


////////////////////////////////////////////////////////////////////////////////

//bortse från detta block, förbereder för att testa ficka moduler

// let testare = Promise.all([
//     fetch("land.json").then(response => response.json()),
//     fetch("stad.json").then(response => response.json()),


// ])
//     .then(jsonData => {

//         return jsonData;
//     });
// console.log(testare);

////////////////////////////////////////////////////////////////////////////////
// fetchar Json filer och skickar vidare data till 3 olika funktioner längre ner
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
//tar emot countries från övre fetch och loopar sedan igenom den och lägger innehåll i nav
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
// tar emot cities från json fetch och skapar en knapp för att rendera ut i main
// knappen jämför id på event klick med id på städer, det som matchar skrivs ut på main
////////////////////////////////////////////////////////////////////////////////

function renderMainCities(cities) {

    navBar.addEventListener("click", function (event) {

        let chosenCountry = event.target.id;
        mainContainer.innerHTML = "";
        cityDetailsContainer.innerHTML = "";

        if (chosenCountry == "citiesIHaveVisited") {
            citiesVisited(cities);
        }

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
// tar emot vald stad från ovan funktion, vid knapptryck skrivs vald stads detaljer ut på höver div i main
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

                ////////////////////////////////////////////////////////////////////////////////
                // fetchar wiki detailjer till vald stad och appendar i höger sida av main
                ////////////////////////////////////////////////////////////////////////////////

                fetch("https://sv.wikipedia.org/w/rest.php/v1/search/page?q=" + chosenCity.stadname + "&limit=1")
                    .then(response => response.json())
                    .then(cityWiki => {

                        let cityWikiInfo = document.createElement("div");
                        cityWikiInfo.innerText = cityWiki.pages[0].description;

                        let cityThumbnail = document.createElement("img");
                        cityThumbnail.alt = chosenCity.stadname;
                        cityThumbnail.src = cityWiki.pages[0].thumbnail.url
                        cityThumbnail.className = "cityThumbnail";

                        cityDetailsContainer.append(cityWikiInfo, cityThumbnail);

                    });

                ////////////////////////////////////////////////////////////////////////////////
                // fetchar väder detailjer till vald stad och appendar i höger sida av main
                ////////////////////////////////////////////////////////////////////////////////

                fetch("https://api.openweathermap.org/data/2.5/find?q=" + chosenCity.stadname + "&units=metric&appid=23effeadc3b3bc19076120fd1e560168")
                    .then(response => response.json())
                    .then(cityWeather => {

                        
                        let temp = cityWeather.list[0].main.temp
                        let tempRounded = Math.round(temp);

                        cityWeatherDetails.innerHTML = "";
                        cityWeatherDetails.append("Just nu är det " + tempRounded + "°C i " + cityWeather.list[0].name);

                        cityDetailsContainer.append(cityWeatherDetails);

                    });

                ////////////////////////////////////////////////////////////////////////////////
                // knapp för att lagra vald stad i besökta städer i localstorage
                ////////////////////////////////////////////////////////////////////////////////

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
// besökta städer tar emot cities från översta fetch, jämför sedan localstorage 
// städernas id med json städers id för att skriva ut besökta städer i main vid knapptryck
////////////////////////////////////////////////////////////////////////////////

function citiesVisited(cities) {

        cityDetailsContainer.innerHTML = "";

        cityDetailsContainer.append("Totalt antal invåndare alla besökta städer: " + totalPopulationOfVisitedCities)

        const clearVisitedStorageBtn = document.createElement("button");
        clearVisitedStorageBtn.innerText = "Rensa besökta städer";
        clearVisitedStorageBtn.id = "clearVisitedStorageBtn";
        cityDetailsContainer.append(clearVisitedStorageBtn);

        clearVisitedStorageBtn.addEventListener("click", function () {

            localStorage.removeItem("besöktastäder");
            totalPopulationOfVisitedCities = 0;
            citiesVisited();


        });

        let storageSerialized = localStorage.getItem("besöktastäder");

        if (storageSerialized) {

            let storageDeSerialized = JSON.parse(localStorage.getItem("besöktastäder"));

            for (let i = 0; i < storageDeSerialized.length; i++) {
                const cityVisited = storageDeSerialized[i];

                for (let i = 0; i < cities.length; i++) {
                    const cityCheck = cities[i];

                    if (cityCheck.id == cityVisited) {

                        let visitedCityContainer = document.createElement("h3");
                        visitedCityContainer.innerText = cityCheck.stadname;
                        cityDetailsContainer.append(visitedCityContainer);

                    }

                }

            }

        } else {
            cityDetailsContainer.innerHTML = "";
        }

};

////////////////////////////////////////////////////////////////////////////////
// räknar ut summan av alla besökta städers invånare
////////////////////////////////////////////////////////////////////////////////

function sumOfAllPopulation(populationToAdd) {

    totalPopulationOfVisitedCities = totalPopulationOfVisitedCities + populationToAdd;

};

////////////////////////////////////////////////////////////////////////////////
// fetchar chuck norris skämt och lägger i footern
////////////////////////////////////////////////////////////////////////////////

fetch("https://api.chucknorris.io/jokes/random")
    .then(response => response.json())
    .then(chuckNorrisJoke => {

        const jokeDiv = document.createElement("div");
        const chuckIcon = document.createElement("img");
        chuckIcon.src = chuckNorrisJoke.icon_url;
        chuckIcon.alt = "Chuck Norris Icon"
        chuckIcon.className = "chuckIcon"
        jokeDiv.innerText = chuckNorrisJoke.value;

        footerContainer.append(jokeDiv, chuckIcon);
    });