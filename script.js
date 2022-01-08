const navBar = document.getElementById("navBar");
const mainContainer = document.getElementById("mainContainer");
const cityDetailsContainer = document.getElementById("cityDetailsContainer");
const citiesIHaveVisited = document.getElementById("citiesIHaveVisited");
const footerContainer = document.getElementById("footerContainer");
const cityWeatherDetails = document.createElement("div");
cityWeatherDetails.classList = "cityWeatherDetails";
const cityWikiInfo = document.createElement("div");
cityWikiInfo.classList = "cityWikiInfo";
const cityContainer = document.createElement("div");
cityContainer.classList = "cityContainer";
let totalPopulationOfVisitedCities = 0;

////////////////////////////////////////////////////////////////////////////////
// importerar modul och kör sedan funktionen
////////////////////////////////////////////////////////////////////////////////

import { renderJoke } from "./modules/jokes.mjs";

renderJoke();

gsap.fromTo(".logo", { duration: 1, opacity: 0, scale: 0, ease: "power.2.in" }, { opacity: 1, scale: 1 });

gsap.from('#footerContainer', { duration: 2, delay: 1, y: '200%', ease: 'elastic' });

gsap.from(".logo", { y: -10, duration: 1, ease: "power2.in", yoyo:true, repeat:-1 });


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
        renderNavbar(countries, cities);
        citiesVisited(cities)


        gsap.from('#navBar', { duration: 2, y: '-100', ease: 'elastic' })
    });


////////////////////////////////////////////////////////////////////////////////
//tar emot countries från övre fetch och loopar sedan igenom den och lägger innehåll i nav
////////////////////////////////////////////////////////////////////////////////

function renderNavbar(countries, cities) {



    for (let i = 0; i < countries.length; i++) {
        const navbarCountrie = countries[i];
        const menuDiv = document.createElement("div");
        menuDiv.id = navbarCountrie.id;
        menuDiv.innerText = navbarCountrie.countryname;

        navBar.append(menuDiv);
        navBar.addEventListener("click", function (event) {
            renderMainCities(event.target.id, cities);

        });
    }
}

////////////////////////////////////////////////////////////////////////////////
// tar emot cities från json fetch och skapar en knapp för att rendera ut i main
// knappen jämför id på event klick med id på städer, det som matchar skrivs ut på main
////////////////////////////////////////////////////////////////////////////////

function renderMainCities(target, cities) {
    let chosenCountry = target;
    mainContainer.innerHTML = "";
    cityDetailsContainer.innerHTML = "";

    if (chosenCountry == "citiesIHaveVisited") {
        citiesVisited(cities);
    } else {
        for (let i = 0; i < cities.length; i++) {
            const cityToMain = cities[i];

            if (cityToMain.countryid == chosenCountry) {
                const countryContainerDiv = document.createElement("div");
                countryContainerDiv.id = cityToMain.id;
                countryContainerDiv.innerText = cityToMain.stadname;

                mainContainer.append(countryContainerDiv);
                cityDetailsContainer.innerHTML = "";
            }
        }
    }
    renderChosenCityInfo(cities);
}

////////////////////////////////////////////////////////////////////////////////
// tar emot vald stad från ovan funktion, vid knapptryck skrivs vald stads detaljer ut på höver div i main
////////////////////////////////////////////////////////////////////////////////

function renderChosenCityInfo(chosenCities) {
    mainContainer.addEventListener("click", function (event) {
        cityDetailsContainer.innerHTML = "";

        for (let i = 0; i < chosenCities.length; i++) {
            const chosenCity = chosenCities[i];

            if (chosenCity.id == event.target.id) {
                cityContainer.innerHTML = "";
                cityContainer.classList = "cityContainer"

                const cityPopulation = document.createElement("div");
                cityPopulation.innerText = "Antal invånare: " + chosenCity.population;
                const visitedBtn = document.createElement("button");
                visitedBtn.id = "visitedBtn";
                visitedBtn.innerText = "Besökt";

                cityContainer.append(cityPopulation, visitedBtn)
                //cityDetailsContainer.append(cityPopulation, visitedBtn);


                ////////////////////////////////////////////////////////////////////////////////
                // fetchar wiki detailjer till vald stad och appendar i höger sida av main
                ////////////////////////////////////////////////////////////////////////////////

                fetch(
                    "https://sv.wikipedia.org/w/rest.php/v1/search/page?q=" +
                    chosenCity.stadname +
                    "&limit=1"
                )
                    .then((response) => response.json())
                    .then((cityWiki) => {
                        cityWikiInfo.innerHTML = "";
                        let cityWikiText = document.createElement("p");
                        cityWikiText.innerText = cityWiki.pages[0].description;
                        let cityThumbnail = document.createElement("img");
                        cityThumbnail.alt = chosenCity.stadname;
                        cityThumbnail.src = cityWiki.pages[0].thumbnail.url;
                        cityThumbnail.className = "cityThumbnail";

                        cityWikiInfo.append(cityWikiText, cityThumbnail);
                        //cityDetailsContainer.append(cityPopulation, visitedBtn, cityWikiInfo);
                    });

                ////////////////////////////////////////////////////////////////////////////////
                // fetchar väder detailjer till vald stad och appendar i höger sida av main
                ////////////////////////////////////////////////////////////////////////////////

                fetch(
                    "https://api.openweathermap.org/data/2.5/find?q=" +
                    chosenCity.stadname +
                    "&units=metric&appid=23effeadc3b3bc19076120fd1e560168"
                )
                    .then((response) => response.json())
                    .then((cityWeather) => {
                        let temp = cityWeather.list[0].main.temp;
                        let tempRounded = Math.round(temp);

                        cityWeatherDetails.innerHTML = "";
                        cityWeatherDetails.append(
                            "Just nu är det " +
                            tempRounded +
                            "°C i " +
                            cityWeather.list[0].name
                        );

                        cityDetailsContainer.append(cityWeatherDetails, cityWikiInfo, cityContainer);

                        gsap.fromTo(".cityWeatherDetails", { duration: 2, x: "-100vw", ease: "elastic", opacity: 0 }, { x: "auto", opacity: 1 });
                        gsap.fromTo(".cityWikiInfo", { duration: 2, x: "+100vw", ease: "elastic", opacity: 0 }, { x: "auto", opacity: 1 });
                        gsap.fromTo(".cityContainer", { duration: 2, x: "-100vw", ease: "elastic", opacity: 0 }, { x: "auto", opacity: 1 });
                    });

                ////////////////////////////////////////////////////////////////////////////////
                // knapp för att lagra vald stad i besökta städer i localstorage
                ////////////////////////////////////////////////////////////////////////////////

                visitedBtn.addEventListener("click", function () {
                    let storageSerialized = localStorage.getItem("besöktastäder");

                    if (storageSerialized) {
                        let storageDeSerialized = JSON.parse(
                            localStorage.getItem("besöktastäder")
                        );
                        storageDeSerialized.push(chosenCity.id);
                        localStorage.setItem(
                            "besöktastäder",
                            JSON.stringify(storageDeSerialized)
                        );
                    } else {
                        let besoktaStader = [];
                        besoktaStader.push(chosenCity.id);
                        localStorage.setItem(
                            "besöktastäder",
                            JSON.stringify(besoktaStader)
                        );
                    }
                    visitedBtn.remove();
                    sumOfAllPopulation(chosenCity.population);
                });
            }
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
// besökta städer tar emot cities från översta fetch, jämför sedan localstorage
// städernas id med json städers id för att skriva ut besökta städer i main vid knapptryck
////////////////////////////////////////////////////////////////////////////////

function citiesVisited(cities) {
    cityDetailsContainer.innerHTML = "";

    let storagePopCountDeserialized = JSON.parse(
        localStorage.getItem("antalinvånare")
    );
    cityDetailsContainer.innerText = "Städer du tidigare besökt är:";
    const clearVisitedStorageBtn = document.createElement("button");
    clearVisitedStorageBtn.innerText = "Rensa besökta städer";
    clearVisitedStorageBtn.id = "clearVisitedStorageBtn";

    let storageSerialized = localStorage.getItem("besöktastäder");

    if (storageSerialized) {
        let storageDeSerialized = JSON.parse(localStorage.getItem("besöktastäder"));

        for (let i = 0; i < storageDeSerialized.length; i++) {
            const cityVisited = storageDeSerialized[i];

            for (let i = 0; i < cities.length; i++) {
                const cityCheck = cities[i];

                if (cityCheck.id == cityVisited) {
                    let visitedCityContainer = document.createElement("h3");
                    visitedCityContainer.classList = "visitedCityContainer";
                    visitedCityContainer.innerText = cityCheck.stadname;
                    cityDetailsContainer.append(
                        visitedCityContainer,
                        clearVisitedStorageBtn
                    );

                    clearVisitedStorageBtn.addEventListener("click", function () {
                        localStorage.removeItem("besöktastäder");
                        totalPopulationOfVisitedCities = 0;
                        localStorage.removeItem("antalinvånare");
                        citiesVisited();
                    });
                }
            }
        }
        let summaDiv = document.createElement("p");
        summaDiv.classList = "summaDiv"
        summaDiv.innerText = "Summa invånare alla besökta städer: ";
        cityDetailsContainer.append(summaDiv, storagePopCountDeserialized);

        gsap.from(".summaDiv", { duration: 2, x: "-100vw", ease: "elastic", opacity: 0 });
        gsap.from(".visitedCityContainer", { duration: 2, x: "+100vw", ease: "elastic", opacity: 0 });

    } else {
        cityDetailsContainer.innerHTML = "";
    }
}

////////////////////////////////////////////////////////////////////////////////
// räknar ut summan av alla besökta städers invånare
////////////////////////////////////////////////////////////////////////////////

function sumOfAllPopulation(populationToAdd) {
    let storagePopCountSerialized = localStorage.getItem("antalinvånare");

    if (storagePopCountSerialized) {
        let storagePopCountDeserialized = JSON.parse(
            localStorage.getItem("antalinvånare")
        );
        totalPopulationOfVisitedCities =
            storagePopCountDeserialized + populationToAdd;
        localStorage.setItem(
            "antalinvånare",
            JSON.stringify(totalPopulationOfVisitedCities)
        );
    } else {
        totalPopulationOfVisitedCities += populationToAdd;
        localStorage.setItem(
            "antalinvånare",
            JSON.stringify(totalPopulationOfVisitedCities)
        );
    }
}
