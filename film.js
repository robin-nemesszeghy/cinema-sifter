// Key: 28f9634c
// https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

let searchTimeoutToken = null;
let currentMovies = [];

const spinnerHTML = `
  <div class="spinner-content">
    <i class="fas fa-spinner fa-spin spinner-icon"></i>
  </div>
`;

function showSpinner() {
  if (searchList) {
    // Only inject spinner HTML if it's not already present (to avoid flickering)
    if (!searchList.querySelector(".spinner-content")) {
      searchList.innerHTML = spinnerHTML;
    }
    searchList.classList.remove("hide__search--list");
    if (resultGrid) {
      resultGrid.style.display = "none";
    }
  }
}

// Fetch flicks (movies) from API and load them
async function loadMovies(searchTerm) {
  // The spinner is already visible due to showSpinner() being called in findMovies()

  const getMovie = await fetch(
    `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=28f9634c`
  );
  const data = await getMovie.json();

  // If the API returns movies, display them
  if (data.Response === "True" && data.Search && data.Search.length > 0) {
    currentMovies = data.Search; // Store movies globally
    displayMovieList(data.Search); // Clear the spinner and display results
  } else {
    // Ensure filtering won't happen on old data
    currentMovies = [];
    // Ensure the searchList container remains visible to display the spinning spinner
    searchList.classList.remove("hide__search--list");
    // Spinner keeps spinning until the search is "complete" (i.e. user finishes typing in the search bar)
  }
}

// To have something displayed as the user types in the search bar
function findMovies() {
  // Null check to prevent error
  if (!movieSearchBox) return;

  let searchTerm = movieSearchBox.value.trim();

  // Clear any existing timeout to prevent multiple rapid API calls
  if (searchTimeoutToken) {
    clearTimeout(searchTimeoutToken);
  }

  if (searchTerm.length > 0) {
    showSpinner(); // Immediately show spinner when user starts typing

    // Set a new timeout to fetch movies after a short delay (100ms)
    // The API call will only happen if the user pauses typing for 100ms
    searchTimeoutToken = setTimeout(() => {
      loadMovies(searchTerm);
    }, 100);
  } else {
    // If search term is empty, clear everything and hide the search list
    searchList.innerHTML = ""; // Remove spinner or previous results
    searchList.classList.add("hide__search--list");
    if (resultGrid) {
      // Only show resultGrid if it actually contains a detailed movie
    }
    currentMovies = []; // Clear current movies cache
  }
}

// The list of movies displayed from the user's search
function displayMovieList(movies) {
  if (!searchList) return;

  searchList.innerHTML = ""; // Clears the spinner (or any previous content)
  searchList.classList.remove("hide__search--list");

  for (let movieId = 0; movieId < movies.length; movieId++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[movieId].imdbID;
    movieListItem.classList.add("search__list--item");
    let moviePoster =
      movies[movieId].Poster !== "N/A"
        ? movies[movieId].Poster
        : "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search__item--thumbnail">
          <img src = "${moviePoster}">
        </div>
        <div class = "search__item--info">
          <h3>${movies[movieId].Title}</h3>
          <p>${movies[movieId].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails(); // Attach event listeners to the new movie items
}

function displayMovieDetails(details) {
  if (!resultGrid) return;

  resultGrid.innerHTML = `
    <div class = "result__grid">
      <div class = "movie-poster">
        <img src = "${
          details.Poster !== "N/A" ? details.Poster : "image_not_found.png"
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
  resultGrid.style.display = "block"; // Show the detailed movie grid
}

function loadMovieDetails() {
  if (!searchList) return;

  const searchListMovies = searchList.querySelectorAll(".search__list--item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide__search--list");
      searchList.innerHTML = "";
      movieSearchBox.value = "";
      // Clear any pending search timeout when a selection is made
      if (searchTimeoutToken) {
        clearTimeout(searchTimeoutToken);
      }
      currentMovies = []; // Clear current movies as detailed view is visible

      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=28f9634c`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

// Global click listener to hide search results when clicking outside
window.addEventListener("click", (event) => {
  const isClickInsideSearchArea =
    (movieSearchBox && movieSearchBox.contains(event.target)) ||
    (searchList && searchList.contains(event.target)) ||
    event.target.classList.contains("filter__option") ||
    event.target.classList.contains("filter__class");

  if (!isClickInsideSearchArea) {
    if (searchList) {
      searchList.classList.add("hide__search--list");
      searchList.innerHTML = "";
    }
    if (movieSearchBox) {
      movieSearchBox.value = "";
    }
    currentMovies = [];
    if (searchTimeoutToken) {
      clearTimeout(searchTimeoutToken);
    }
  }
});

const searchFocus = document.getElementById("movie-search-box");

if (searchFocus) {
  searchFocus.addEventListener("focus", () => {
    if (resultGrid) {
      resultGrid.style.display = "none"; // Always hide detailed view when search box is focused
    }
    // If there's content in the search box, re-trigger findMovies to show either the spinner or results
    if (movieSearchBox.value.trim().length > 0) {
      findMovies();
    } else {
      if (searchList) {
        searchList.classList.add("hide__search--list");
        searchList.innerHTML = "";
      }
      currentMovies = [];
    }
  });
}

// Reset button clears the search
function clearInput() {
  if (resultGrid) {
    resultGrid.style.display = "none";
  }
  if (searchList) {
    searchList.innerHTML = "";
    searchList.classList.add("hide__search--list");
  }
  if (movieSearchBox) {
    movieSearchBox.value = "";
  }
  currentMovies = [];
  if (searchTimeoutToken) {
    clearTimeout(searchTimeoutToken);
  }
}

function filterMovies(event) {
  renderMovies(event.target.value);
}

// Filter section for sorting movies (by year and by name)
function renderMovies(filter) {
  const moviesArray = currentMovies;

  if (!moviesArray || moviesArray.length === 0) {
    searchList.innerHTML =
      '<div class="spinner-content">No movies to sort. Please perform a search first.</div>';
    searchList.classList.remove("hide__search--list");
    return;
  }

  searchList.innerHTML = "";
  searchList.classList.remove("hide__search--list");

  let sortedArray = [...moviesArray];

  if (filter === "Oldest_To_Newest") {
    sortedArray.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (filter === "Newest_To_Oldest") {
    sortedArray.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (filter === "A_To_Z") {
    sortedArray.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter === "Z_To_A") {
    sortedArray.sort((a, b) => b.Title.localeCompare(a.Title));
  }

  displayMovieList(sortedArray); // Re-render the list with sorted movies
}
