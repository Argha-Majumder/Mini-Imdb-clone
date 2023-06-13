const searchKeyword = document.getElementById("search-movie");
const suggestionsContainer = document.getElementById("movie-card-container");
const favouriteMoviesContainer = document.getElementById("favourites-movie-container");
const emptyText = document.getElementById("empty-search-text");
const displayFavourites = document.getElementById("favourites-container");
const emptyFavouriteText = document.getElementById("empty-text");

let suggestionList = [];
let favouriteMovieList = [];

searchKeyword.addEventListener("keydown",(event)=>{
    if (event.key=="Enter") {
        event.preventDefault();
    }
});

searchKeyword.addEventListener("keyup",function () {
    let search = searchKeyword.value;
    if (search==="") {
        emptyText.style.display = "block";
        suggestionsContainer.innerHTML = "";
        suggestionList = [];
    } else {
        emptyText.style.display = "none";
        (async ()=> {
            let data = await fetchMovies(search);
            addToSuggestionList(data);
        })();

        suggestionsContainer.style.display = "grid";
    }
});

async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=9d4026a2`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

function addToSuggestionList(data) {
    emptyFavouriteText.style.display = "none";
    let isPresent = false;

    suggestionList.forEach((movie)=>{
        if (movie.Title == data.Title) {
            isPresent = true;
        }
    });

    if (!isPresent && data.Title != undefined) {
        if (data.Poster=="N/A") {
            data.Poster = "assets/not-found.jpg";
        }
        suggestionList.push(data);
        const movieCard = document.createElement("div");
        movieCard.setAttribute("class","text-decoration");
        
        movieCard.innerHTML = `
            <div class="card" data-id="${data.Title}">
                <a href="movie-info.html">
                <img src="${data.Poster}" class="card-img-top" alt="..." data-id="${data.Title}">
                <div class="card-body text-start">
                    <h5 class="card-title">
                        <a href="movie-info.html" data-id="${data.Title}">${data.Title}</a>
                    </h5>
                    <p class="card-text">
                        <i class="fa-solid fa-star"><span id="rating">&nbsp;${data.imdbRating}</span></i>
                        <button class="fav-btn">
                            <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
                        </button>
                    </p>
                </div>
                </a>
            </div>
        `;
        suggestionsContainer.prepend(movieCard);
    }
}

async function handleClickListener(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) {
        e.preventDefault();
        handleFavouriteButton(e);
    } else if (target.classList.contains("fa-trash-can")) {
        deleteMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
        if (displayFavourites.style.display=="flex") {
            document.getElementById("menu").style.color="#8b9595";
            displayFavourites.style.display = "none";
        } else {
            displayFavourites.style.display = "flex";
        }
    }
    localStorage.setItem("movieName",target.dataset.id);
}

function deleteMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favouriteMoviesList"));
    let updatedList = Array.from(favList).filter((movie)=> {
        return movie.Title!=name;
    });

    localStorage.setItem("favouriteMoviesList", JSON.stringify(updatedList));

    addFavToDOM();
    showEmptyText();
}

function showEmptyText() {
    if (favouriteMoviesContainer.innerHTML == "") {
        emptyFavouriteText.style.display = "block";
    } else {
        emptyFavouriteText.style.display = "none";
    }
}

async function handleFavouriteButton(e) {
    const target = e.target;
    
    let data = await fetchMovies(target.dataset.id);

    let favouriteLocalMovies = localStorage.getItem("favouriteMoviesList");

    if (favouriteLocalMovies) {
        favouriteMovieList = Array.from(JSON.parse(favouriteLocalMovies));
    } else {
        localStorage.setItem("favouriteMoviesList", JSON.stringify(data));
    }

    let isPresent = false;
    favouriteMovieList.forEach((movie)=>{
        if (data.Title==movie.Title) {
            showNotification("Already present!");
            isPresent = true;
        }
    });

    if (!isPresent) {
        favouriteMovieList.push(data);
    }

    localStorage.setItem("favouriteMoviesList", JSON.stringify(favouriteMovieList));
    isPresent = !isPresent;
    addFavToDOM();
}

function addFavToDOM() {
    favouriteMoviesContainer.innerHTML = "";

    let favouriteList = JSON.parse(localStorage.getItem("favouriteMoviesList"));

    if (favouriteList) {
        favouriteList.forEach((movie)=>{
            const div = document.createElement("div");
            div.classList.add("fav-movie-card");
            div.innerHTML = `
                <img src="${movie.Poster}" alt="" class="fav-movie-poster">
                <div class="movie-card-details">
                    <p class="movie-name">
                        <a href="movie-info.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}</a>
                    </p>
                    <small class="fav-year">${movie.Year}</small>
                </div>
                
                <div class="delete-btn">
                    <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
                </div>
            `;
            favouriteMoviesContainer.prepend(div);
        });
    }
}

function showNotification(text) {
    window.alert(text);
}

document.addEventListener("click", handleClickListener);