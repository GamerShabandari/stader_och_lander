window.addEventListener("load", initSite);

async function initSite() {
    let countries = await makeRequest("./json/land.json");
    let cities = await makeRequest("./json/stad.json");
    renderCountriesAndCities(countries, cities);
}

async function makeRequest(url) {
    try {
        let response = await fetch(url);
        let result = await response.json();
        return result;
    } catch(err) {
        console.error(err);
    }
}

function renderCountriesAndCities(countries, cities) {
    // I diven "countryContainer" lägger jag till en rubrik "Städer jag har besökt" 
    let citiesIHaveVisited = document.createElement("h2");
    citiesIHaveVisited.id = "visitedCities";
    citiesIHaveVisited.innerText = "Städer jag har besökt";
    countryContainer.append(citiesIHaveVisited);

    // När man trycker på rubriken "Städer jag har besökt"
    document.getElementById("visitedCities").addEventListener("click", function(){
        if(localStorage.length == 0){
            cityInfo.innerHTML = "Du har inte besökt några städer..";
        }else {
            // Tömmer först diven
            let cityContainer = document.getElementById("cities");
            cityContainer.innerHTML = "";
            cityInfo.innerHTML = "";
            weatherContainer.innerHTML = "";
            cityDetailsContainer.innerHTML = "";
            let header = document.createElement("h4");
            header.innerHTML = "Städer jag har besökt:";
            let visitedCitiesContainer = document.createElement("div");
            visitedCitiesContainer.id = "visitedCitiesContainer";
            // Hämtar de städer jag har besökts id från LS
            let visitedCities = JSON.parse(localStorage.getItem("visited"));
            for(let i = 0; i < visitedCities.length; i++){
                // Skriver ut städerna jag har besökt
                cities.forEach((city) => {
                    if(JSON.parse(localStorage.getItem("visited"))[i].id == city.id){
                        visitedCitiesContainer.innerHTML += city.stadname + "<br>";
                    }
                })
            }
            // Skapar en reset knapp som tar bort de städer jag sparat i LS
            let resetVisitedCities = document.createElement("button");
            resetVisitedCities.id = "resetBtn";
            resetVisitedCities.innerText = "Nollställ städer!";

            // Totala antalet invånare i samtliga länder jag besökt
            let totalNumberInhabitantsHeader = document.createElement("h4");
            totalNumberInhabitantsHeader.innerText = "Antal invånare totalt: ";
            let totalNumberInhabitants = document.createElement("div");
            totalNumberInhabitants.id = "totalNumberInhabitants";
            totalNumberInhabitants = 0;

            // Räkna ut totalt antal invånare 
            for(let i = 0; i < visitedCities.length; i++){
                cities.forEach((city) => {
                    if(JSON.parse(localStorage.getItem("visited"))[i].id == city.id){
                        let population = city.population;
                        totalNumberInhabitants += population;
                    }
                })
            }

            cityInfo.append(header, visitedCitiesContainer, resetVisitedCities,totalNumberInhabitantsHeader, totalNumberInhabitants);
            //console.log(JSON.parse(localStorage.getItem("visited"))[0].id);

            document.getElementById("resetBtn").addEventListener("click", function(){
                localStorage.clear();
                location.reload();
            })
        }
    })

    // Skriver ut de länder som finns i land.json
    countries.forEach((country) => {
        let countryHeader = document.createElement("h2");
        countryHeader.innerText = country.countryname;
        countryHeader.id = country.id;
        //console.log(countryHeader.id);
        countryContainer.append(countryHeader);

        // När man trycker på något av länderna i diven "countryContainer"
        document.getElementById("countryContainer").addEventListener("click", function(e){
            //console.log(e.target.id);
            // Kollar om id på landet jag tryckt på är samma som något av ländernas id i land.json
            if(e.target.id == countryHeader.id){
                let cityContainer = document.getElementById("cities");
                cityContainer.innerHTML = "";
                weatherContainer.innerHTML = "";
                cityDetailsContainer.innerHTML = "";
                let cityInfo = document.getElementById("cityInfo");
                cityInfo.innerHTML = "";
                // Om ja så skriver jag ut städerna för det landet
                cities.forEach((city) => {
                    // Om country.id är samma som city.countryid betyder det att staden finns i det landet
                    if(country.id == city.countryid) {
                        let cityHeader = document.createElement("h4");
                        cityHeader.innerHTML = city.stadname;
                        cityHeader.id = city.id;
                        cityContainer.append(cityHeader);

                        // Om jag trycker på någon av städerna
                        document.getElementById("cities").addEventListener("click", function(e){
                            //console.log(e.target.id);
                            cityContainer.innerHTML = "";
                            // Kollar om id på staden jag tryckt på är samma som något av städernas id i stad.json
                            if(e.target.id == cityHeader.id){
                                // Skriver ut stadens namn samt antalet invånare
                                // Skapar även en knapp som du trycker på om du besökt staden
                                cityInfo.innerHTML = `<strong>${city.stadname}</strong> <br> Antalet invånare: ${city.population} <br> <p id="haveYouVisited">Har du besökt denna stad?</> <br> <button id="yes">JA</button>`;

                                // Väder API
                                fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city.stadname + "&appid=9cff4516de5bb7e06dd5fd8502b1b6d8&lang=sv")
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    let weatherContainer = document.getElementById("weatherContainer");
                                    weatherContainer.innerHTML = "";
                                    let nameValue = data['name'];
                                    let tempValue = data['main']['temp'];
                                    let kelvinToCelsius = tempValue - 273.15;
                                    let temp = kelvinToCelsius.toFixed(2);
                                    let descValue = data['weather'][0]['description'];

                                    weatherContainer.innerHTML += "Vädret i " + nameValue + " idag är: <br>" + temp + " grader och " + descValue;
                                })
                                .catch(err => alert("ERROR"));

                                // WIKI API
                                fetch("https://sv.wikipedia.org/w/rest.php/v1/search/page?q=" + city.stadname + "&limit=1")
                                .then(response => response.json())
                                .then(data => {

                                    let cityDetailsContainer = document.getElementById("cityDetailsContainer");
                                    cityDetailsContainer.innerHTML = "";

                                    let cityWikiInfo = document.createElement("div");
                                    cityWikiInfo.innerText = data.pages[0].description;

                                    let cityThumbnail = document.createElement("img");
                                    cityThumbnail.alt = city.stadname;
                                    cityThumbnail.src = data.pages[0].thumbnail.url
                                    cityThumbnail.className = "cityThumbnail";

                                    cityDetailsContainer.append(cityWikiInfo, cityThumbnail);

                                })
                                .catch(err => alert("ERROR"));

                                // Om du trycker JA att du besökt staden
                                document.getElementById("yes").addEventListener("click", function(){
                                    // Sparar stadens id i LS
                                    let visitedCities = JSON.parse(localStorage.getItem("visited"));
                                    if(visitedCities == null) { visitedCities = [];}
                                    let visitedCity = { "id": city.id};
                                    localStorage.setItem("city", JSON.stringify(visitedCity));
                                    visitedCities.push(visitedCity);
                                    localStorage.setItem("visited", JSON.stringify(visitedCities));
                                    //console.log("Besökta städer: ", localStorage.getItem("visited"));
                                    document.getElementById("haveYouVisited").style.visibility = "hidden";
                                })
                                // Dölj knappen om staden finns i LS
                                let cityInLs = JSON.parse(localStorage.getItem("visited"));
                                if(cityInLs != null){
                                    for(let i = 0; i < cityInLs.length; i++){
                                        // Döljer knappen "har du besökt staden" i de städer jag har besökt
                                        if(city.id == JSON.parse(localStorage.getItem("visited"))[i].id){
                                            document.getElementById("haveYouVisited").style.visibility = "hidden";
                                        }   
                                    }
                                }
                            }
                        })
                    }
                });
            }
        })
    });
}