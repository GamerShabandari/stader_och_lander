
const navBar = document.getElementById("navBar");
const mainContainer = document.getElementById("mainContainer");
const cityDetailsContainer = document.getElementById("cityDetailsContainer");


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
});

////////////////////////////////////////////////////////////////////////////////

function renderNavbar (countries) {
    

    for (let i = 0; i < countries.length; i++) {
        const navbarCountrie = countries[i];
        //console.log(navbarCountrie);
        const menuDiv = document.createElement("div");
        menuDiv.id = navbarCountrie.id;
        menuDiv.innerText = navbarCountrie.countryname;

        navBar.append(menuDiv);
        
    }
};

////////////////////////////////////////////////////////////////////////////////

function renderMainCities(cities) {

    navBar.addEventListener("click", function(event){

        let chosenCountry = event.target.id;
        //console.log(chosenCountry);
        mainContainer.innerHTML = "";


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

    mainContainer.addEventListener("click", function(event){
        

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
                //mainContainer.append(cityDetails);
                cityDetailsContainer.append(cityDetails);
                
            }
            
        }

    });

};