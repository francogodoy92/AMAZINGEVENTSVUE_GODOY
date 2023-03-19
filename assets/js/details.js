const queryString = location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

let eventsId = [];

fetch("../assets/amazing.json")
  .then((response) => response.json())
  .then((data) => {
    const events = data.events;
    eventsId = events.find((element) => element._id == id);

    const details = document.getElementById("details-conteiner");

    details.innerHTML = `<img src="${eventsId.image}" alt="${eventsId.name}">
    <div>
        <h2 class="detailstitle"><span style="font-weight: bold; text-decoration: underline;">Event</span>: ${eventsId.name}</h2>
        <p class="detailstext"><span style="font-weight: bold; text-decoration: underline;">Category</span>: ${eventsId.category}</p>
        <p class="detailstext"><span style="font-weight: bold; text-decoration: underline;">Description</span>: ${eventsId.description}</p>
        <p class="detailstext"><span style="font-weight: bold; text-decoration: underline;">Place</span>: ${eventsId.place}</p>
        <p class="detailstext"><span style="font-weight: bold; text-decoration: underline;">Date</span>: ${eventsId.date}</p>
        <p class="detailstext"><span style="font-weight: bold; text-decoration: underline;">Capacity</span>: ${eventsId.capacity}</p>
        <p class="detailsprice"><span style="font-weight: bold; text-decoration: underline;">Price</span>: $${eventsId.price}</p>
    </div>
    `;
  })
  .catch((error) => console.error(error));
