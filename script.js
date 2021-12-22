
const navBar = document.getElementById("navBar");
const mainContainer = document.getElementById("mainContainer");


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
        console.log(navbarCountrie);
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
        console.log(chosenCountry);


        for (let i = 0; i < cities.length; i++) {
            const cityToMain = cities[i];

            if (cityToMain.countryid == chosenCountry) {

                console.log(cityToMain);
                
            }
            
        }
        

    
    
    
    });

};