"use strict";
const MISSING_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`, {
    params: {
      q: term,
    }
    });

  return [
    {
      id: response.data[0].show.id,
      name: response.data[0].show.name,
      summary: response.data[0].show.summary,
      image: response.data[0].show.image ? response.data[0].show.image.medium : MISSING_IMAGE_URL
    }
  ];
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= ${show.image} 
              alt= ${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="ebtn" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    
    $showsList.append($show);
$("#ebtn").on("click", getEpisodesAndDisplay);

async function getEpisodesAndDisplay() {
  const id = show.id
  await getEpisodesOfShow(id);
  }}}
    

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`, {
      });


  $episodesList.empty();

  for (let episode of response.data) {
    const $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);
    $episodesList.append($item);
  }
$episodesArea.show();
}









