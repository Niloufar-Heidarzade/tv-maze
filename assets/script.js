const container = document.querySelector("#container");
const searchBar = document.querySelector("#searchBar");
const searchButton = document.querySelector("#searchButton");
const header = document.querySelector("#headerImage");
async function fetchMovies() {
    try {
        const res = await fetch("https://api.tvmaze.com/shows");
        const data = await res.json();
        for (let i = 0; i < 20; i++) {
            buildNewCard(data[i].image.original, data[i].name, data[i].genres, data[i].rating.average, data[i].id);
        }
    } catch (er) {
        console.log(er);
    }
}
fetchMovies();
function buildNewCard(url, name, genres, imdb, id) {
    const newCard = document.createElement("div");
    newCard.className = "card";
    const cardImage = document.createElement("img");
    cardImage.src = url;
    newCard.appendChild(cardImage);
    const movieName = document.createElement("h3");
    movieName.innerText = name;
    newCard.appendChild(movieName);
    const movieGenres = document.createElement("p");
    movieGenres.className = "genre";
    movieGenres.innerText = genres.join(" | ");
    newCard.appendChild(movieGenres);
    const imdbScore = document.createElement("p");
    imdbScore.className = "imdb";
    imdbScore.innerText = imdb;
    newCard.appendChild(imdbScore);
    container.appendChild(newCard);
    newCard.addEventListener("click", () => {
        fetchEpisodes(id);
    });
}
searchButton.addEventListener("click", search);
async function search() {
    try {
        container.innerHTML = "";
        const res = await fetch("https://api.tvmaze.com/shows");
        const data = await res.json();
        const searchValue = searchBar.value.trim().toLowerCase();

        data.forEach((movie) => {
            if (movie.name.toLowerCase().includes(searchValue) || movie.summary.toLowerCase().includes(searchValue)) {
                buildNewCard(movie.image.original, movie.name, movie.genres, movie.rating.average, movie.id);
            }
        });

        if (container.innerHTML === "") {
            container.innerHTML = "<p style='color:white;'>Nothing found!</p>";
        }
    } catch (er) {
        console.log(er);
    }
}
async function fetchEpisodes(movieID) {
    header.innerHTML = "";
    container.innerHTML = "";
    try {
        const res = await fetch(`https://api.tvmaze.com/shows/${movieID}/episodes`);
        const data = await res.json();
        if (data.length > 0) {
            createEpCard(data);
        } else {
            container.innerHTML = "<p style='color:white;'>No episodes found for this show.</p>";
        }
    } catch (er) {
        console.log(er);
        container.innerHTML = "<p style='color:white;'>Failed to fetch episodes.</p>";
    }
}
function createEpCard(data) {
    console.log(data);
    data.forEach((episode) => {
        const newEp = document.createElement("div");
        newEp.classList.add("episodeCard");
        newEp.addEventListener("mouseenter", () => {
            const summaryDiv = document.createElement("div");
            summaryDiv.classList.add("summaryDiv");
            summaryDiv.innerHTML = episode.summary ? episode.summary.slice(0, 180) + "..." : "No summary available.";
            newEp.appendChild(summaryDiv);
        });
        newEp.addEventListener("mouseleave", () => {
            const summaryDiv = newEp.querySelector(".summaryDiv");
            if (summaryDiv) {
                newEp.removeChild(summaryDiv);
            }
        });
        const image = document.createElement("img");
        image.src = episode.image ? episode.image.original : "./assets/default-image.png"; // Use a default image if none is available
        image.alt = episode.name;
        newEp.appendChild(image);
        container.appendChild(newEp);
        const cardBottom = document.createElement("div");
        newEp.append(cardBottom);
        const text = document.createElement("p");
        let epNumber = episode.number < 10 ? `0${episode.number}` : episode.number;
        text.innerText = `S0${episode.season}-E${epNumber} ${episode.name}`;
        cardBottom.append(text);
        text.style.color = "white";
        const playButton = document.createElement("button");
        const buttonIcon = document.createElement("img");
        buttonIcon.src = "./assets/green-play-button-icon.png";
        cardBottom.append(playButton);
        playButton.append(buttonIcon);
        playButton.classList.add("playButton");
        buttonIcon.classList.add("buttonIcon");
        cardBottom.className = "cardBottom";
        playButton.addEventListener("click", () => {
            window.location.href = episode.url;
        });
    });
}