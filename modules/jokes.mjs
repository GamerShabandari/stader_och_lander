////////////////////////////////////////////////////////////////////////////////
// fetchar chuck norris skämt och lägger i footern
////////////////////////////////////////////////////////////////////////////////


export function renderJoke() {

    fetch("https://api.chucknorris.io/jokes/random")
        .then(response => response.json())
        .then(chuckNorrisJoke => {

            const jokeDiv = document.createElement("div");
            const chuckIcon = document.createElement("img");
            chuckIcon.src = chuckNorrisJoke.icon_url;
            chuckIcon.alt = "Chuck Norris Icon"
            chuckIcon.className = "chuckIcon"
            jokeDiv.innerText = chuckNorrisJoke.value;

            footerContainer.innerHTML = "";
            footerContainer.append(jokeDiv, chuckIcon);

            chuckIcon.addEventListener("click", function () {

                renderJoke();

            })
        });

};