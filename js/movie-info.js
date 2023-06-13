const title = document.getElementById("title");
title.innerHTML = localStorage.getItem("movieName");
const year = document.getElementById("year");
const runtime = document.getElementById("runtime");
const rating = document.getElementById("rating");
const poster = document.getElementById("poster");
const story = document.getElementById("story");
const dirsNames= document.getElementById("director-names");
const castNames= document.getElementById("cast-names");
const genre = document.getElementById("genre");

fetchMovies(title.innerHTML);

async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=9d4026a2`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        year.innerHTML = data.Year;
        runtime.innerHTML = data.Runtime;
        rating.innerHTML = `${data.imdbRating}/10`;
        poster.setAttribute("src",`${data.Poster}`);
        story.innerHTML = data.Plot;
        dirsNames.innerHTML = data.Director;
        castNames.innerHTML = data.Actors;
        genre.innerHTML = data.Genre;
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}