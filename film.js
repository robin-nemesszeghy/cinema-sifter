// Key: 28f9634c
// https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

// Load Movies from API
async function loadMovies(searchTerm) {
  const getMovie = await fetch(
    `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c`
  );
  const data = await getMovie.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

// THIS IS JUST TO DISPLAY SOMETHING AS YOU TYPE. NOTHING IS DISPLAYED BY DEFAULT BECAUSE OF hide__search--list
function findMovies() {
  // Add null check to prevent error
  if (!movieSearchBox) return;

  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    // this displays movies when you first type because before hand, default is display:none on hide__search--list
    searchList.classList.remove("hide__search--list");
    loadMovies(searchTerm);
  } else {
    // this displays none again if you haven't typed anything in the searchterm
    searchList.classList.add("hide__search--list");
  }
}

// THE LIST OF MOVIES YOU SEARCHED FOR
function displayMovieList(movies) {
  // Add null check to prevent error
  if (!searchList) return;

  searchList.innerHTML = "";
  for (let idmovie = 0; idmovie < movies.length; idmovie++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idmovie].imdbID; // setting movie id in data-id
    movieListItem.classList.add("search__list--item");
    let moviePoster =
      movies[idmovie].Poster != "N/A"
        ? movies[idmovie].Poster
        : "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search__item--thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search__item--info">
            <h3>${movies[idmovie].Title}</h3>
            <p>${movies[idmovie].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  // Add null check to prevent error
  if (!searchList) return;

  const searchListMovies = searchList.querySelectorAll(".search__list--item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide__search--list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=28f9634c`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  // Add null check to prevent error
  if (!resultGrid) return;

  resultGrid.innerHTML = `
    <div class = "result__grid">
    <div class = "movie-poster">
        <img src = "${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt = "movie poster">
    </div>
    <div class = "movie__info">
        <h3 class = "movie__title">${details.Title}</h3>
        <ul class = "movie__misc--info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    </div>
    `;
}

window.addEventListener("click", (event) => {
  if (
    event.target.className != "form__control" &&
    event.target.className != "filter__option" &&
    event.target.className != "filter__class"
  ) {
    searchList.classList.add("hide__search--list");
  }
});

// Hide movie result so movie search can display over it

const hideResultGrid = document.getElementById("result-grid");
const searchFocus = document.getElementById("movie-search-box");

searchFocus.addEventListener("focus", () => {
  hideResultGrid.style.display = "none";
});

searchFocus.addEventListener("blur", () => {
  hideResultGrid.style.display = "block"; // Or whichever display value you want when not focused
});

// Clear List Button will clear all
function clearInput() {
  document.getElementById("result-grid").style.display = "none";
  document.getElementsByClassName("search__list--item").style.display = "none";
}

// WIP filter section for sorting movies WIP

function renderMovies(filter) {
  const moviesArray = data.Search;

  if (filter === "Oldest_To_Newest") {
    moviesArray.sort((a, b) => a.Year - b.Year);
  } else if (filter === "Newest_To_Oldest") {
    moviesArray.sort((a, b) => b.Year - a.Year);
  } else if (filter === "A_To_Z") {
    moviesArray.sort((a, b) => a.Title - b.Title);
  } else if (filter === "Z_To_A") {
    moviesArray.sort((a, b) => b.Title - a.Title);
  }

  searchList.innerHTML = moviesArray.map((movie) => movieHTML(movie)).join("");
}
