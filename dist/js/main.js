function homePage() {
  $("#anime__winter").ready(() => {
    $.ajax({
      url: `https://anime.kaedenoki.net/api/home`,
      type: "GET",
      cors: true,
      secure: true,
      success: (anime) => {
        // ===WINTER ANIME===
        const onGoing = anime.home.on_going;
        let cardWinter = "";
        onGoing.forEach((anime_ongoing) => {
          cardWinter += CardWinter(anime_ongoing);
        });
        $("#anime__winter").append(`<div class="container anime__winter">
                                      <div class="row">
                                        <h3 class="anime__header">New release</h3>
                                      </div>
                                      <div class="row card__winter">
                                      
                                      </div>
                                    </div>`);
        $(".card__winter").html(cardWinter);
        // ===END OF WINTER ANIME===

        // ===NEW EPS ANIME===
        const complete = anime.home.complete;
        let cardNewEps = "";
        complete.forEach((complete) => {
          cardNewEps += CardNewEps(complete);
        });
        $("#anime__winter").append(`<div class="container anime__winter">
                                      <div class="row">
                                        <h3 class="anime__header">Completed anime</h3>
                                      </div>
                                      <div class="row card__newEps">
                                      
                                      </div>
                                    </div>`);
        $(".card__newEps").html(cardNewEps);
        // ===END OF EPS ANIME===
      },
    });
  });
}
homePage();

function CardWinter(anime_ongoing) {
  return `<div class="col">
            <div class="container">
            <a href="#" onclick="detail(this)"  data-id="${anime_ongoing.id}" class="card detail__anime">
              <div class="status">${anime_ongoing.episode}</div>
              <div class="rating">${anime_ongoing.day_updated}</div>
              <div class="thumb">
                <img
                  width="170"
                  height="169"
                  sizes="(max-width: 300px), 100vw"
                  src="${anime_ongoing.thumb}"
                  alt="${anime_ongoing.title}"
                />
                <h2 class="judul">${anime_ongoing.title}</h2>
              </div>
            </a>
            </div>
          </div>`;
}
function CardNewEps(complete) {
  return `<div class="col">
            <div class="container">
            <a href="#" onclick="detail(this)"  data-id="${complete.id}" class="card detail__anime">
              <div class="status">${complete.episode}</div>
              <div class="rating">${complete.score}</div>
              <div class="thumb">
                <img
                  width="170"
                  height="169"
                  sizes="(max-width: 300px), 100vw"
                  src="${complete.thumb}"
                  alt="${complete.title}"
                />
                <h2 class="judul">${complete.title}</h2>
              </div>
            </a>
            </div>
          </div>`;
}

$(".search__anime").on("click", () => {
  $(".search__anime").on("keypress", (e) => {
    if (e.which == 13) {
      e.preventDefault();
      const query = $(".search__anime").val();
      $.ajax({
        url: `https://anime.kaedenoki.net/api/search/${query}`,
        success: (anime) => {
          const searchAnime = anime.search_results;
          if (!searchAnime) {
            $("#anime__winter").html(`<div class="container anime__winter">
                                        <div class="row">
                                          <h3 class="anime__header">Tidak pencarian : ${query} dalam bentuk apapun</h3>
                                        </div>
                                        <div class="row card__search">
                                        
                                        </div>
                                      </div>`);
          } else {
            let card__search = "";
            searchAnime.forEach((search_result) => {
              card__search += CardSearch(search_result);
            });
            $("#anime__winter").html(`<div class="container anime__winter">
                                      <div class="row">
                                        <h3 class="anime__header">Hasil pencarian : ${query}</h3>
                                      </div>
                                      <div class="row card__search">
                                      
                                      </div>
                                    </div>`);
            $(".card__search").html(card__search);
          }
        },
        error: (e) => {
          console.log(e.responseText);
        },
      });
    }
  });
});

function CardSearch(search_result) {
  return `<div class="col">
            <div class="container">
            <a href="#" onclick="detail(this)" data-id="${search_result.id}" class="card detail__anime">
              <div class="status">${search_result.status}</div>
              <div class="rating">${search_result.score}</div>
              <div class="thumb">
                <img
                  width="170"
                  height="169"
                  sizes="(max-width: 300px), 100vw"
                  src="${search_result.thumb}"
                  alt="${search_result.title}"
                />
                <h2 class="judul">${search_result.title}</h2>
              </div>
              </a>
              </div>
          </div>`;
}

function detail(el) {
  let id = $(el).data("id");
  let animeId = id.slice(28);
  $(".detail__anime").on("click", (e) => {
    e.preventDefault();
    $.ajax({
      url: `https://anime.kaedenoki.net/api/anime/${animeId}`,
      success: (result) => {
        let eps = result.episode_list;
        let genre = [];
        for (i = 0; i < result.genre_list.length; i++) {
          let val = result.genre_list[i]["genre_name"];
          genre.push(val);
        }
        if (result.total_episode == null) {
          result.total_episode = "Unknown";
        }
        $("#anime__winter").html(CardDetail(result, eps, genre));
        if (result.batch_link.id == "Masih kosong gan") {
          $(".linkbatch").hide();
        }
        let epsList = "";
        eps.forEach((epslist) => {
          epsList += Listeps(epslist);
          $("#listEps").html(epsList);
        });
      },
    });
  });
}

function CardDetail(result, eps, genre) {
  return `<div class="container container-detail">
            <div class="judul__anime text-center">
            <h1>${result.title}</h1>
            </div>
            <div class="sub__judul__anime text-center">
            <h2>Streaming ${result.title}</h2>
            </div>
            <div id="detail__anime">
            <img
                sizes="(max-width: 255px), 255px"
                width="225"
                height="318"
                src="${result.thumb}"
                alt="${result.title}"
            />
            <div class="info__anime">
                <div class="info__anime__detail">
                <p>
                    <span>
                    <b class="float-left">Judul : </b>
                    ${result.title}, ${result.japanase}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Durasi : </b>
                    ${result.duration} per eps
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Status : </b>
                    ${result.status}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Episode : </b>
                    ${result.total_episode}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Rating : </b>
                    ${result.score}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Studio : </b>
                    ${result.studio}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Tipe : </b>
                    ${result.type}
                    </span>
                </p>
                <p>
                    <span>
                    <b class="float-left">Genre : </b>
                    ${genre}
                    </span>
                </p>
                </div>
            </div>
            <div class="sinopsis">
                <p>
                ${result.synopsis}
                </p>
            </div>
            <br/>
            <div class="batch-list"></div>
            <div class="listEps">
              <div class="batch">
                <span class="text-batch float-left"
                  >Download ${result.title} Batch</span
                >
                </div>
                <ul>
                  <li>
                    <span>
                      <a href="#" class="linkbatch" onclick="batch(this)" data-id="${result.batch_link.id}">${result.title} Batch</a>
                    </span>
                  </li>
                </ul>
            </div>
            <div class="listEps">
              <div class="eps" data-id="eps">
                <span class="text-eps float-left">List Eps ${result.title}</span>
              </div>
              <ul id="listEps">
                
              </ul>
            </div>
            </div>
          </div>`;
}

function batch(el) {
  let batchId = $(el).data("id");
  batchId = batchId.slice(28);
  $.ajax({
    url: `https://anime.kaedenoki.net/api/batch/${batchId}`,
    success: (batch) => {
      $(".listEps").hide();
      const batchlist = batch;
      let downloadlist = batchlist.download_list;
      let lowQual = downloadlist.low_quality;
      let medQual = downloadlist.medium_quality;
      let highQual = downloadlist.high_quality;
      let qual = [lowQual, medQual, highQual];
      $("#detail__anime").append(BatchList(batchlist, qual));
      let quals = [];
      for (i = 0; i < qual.length; i++) {
        let val = qual[i];
        quals.push(val);
        $("#batch__anime").append(ListQual(val));
        let links = val.download_links;
        link = "";
        links.forEach((links) => {
          let link = links;
          $(".listLink").append(linkBatch(link));
        });
      }
    },
  });
}

function BatchList(batchlist) {
  return `<div class="download">
            <div class="batch-list">
              <h4>${batchlist.title}</h4>
              <ul id="batch__anime">
              </ul>
            </div>
          </div>`;
}
function ListQual(val) {
  return `
            <li>
              <strong class="link__batch">${val.quality}</strong>
              <i class="float-right">${val.size}</i>
                  <div class="listLink"></div>
            </li>
          `;
}
function linkBatch(link) {
  return `<a href="${link.link}">${link.host}</a>`;
}
function Listeps(epslist) {
  return `<li>
            <span>
              <a href="#">${epslist.title}</a>
            </span>
            <span class="float-right">${epslist.uploaded_on}</span>
          </li>`;
}

$("#home").on("click", () => {
  location.reload();
});
