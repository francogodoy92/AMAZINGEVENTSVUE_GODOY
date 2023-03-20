const { createApp } = Vue;

const url = "../assets/amazing.json";

const app = createApp({
  data() {
    return {
      checked: [],
      cards: [],
      cardsFiltradas: [],
      detalles: {},
      busqueda: "",
      categorias: [],
      mayorAsist: {},
      menAsist: {},
      capMaxima: {},
      categoryUpcoming: [],
      categoryPast: [],
    };
  },
  created() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //Filtro eventos para Upcoming Events
        if (document.title.includes("Upcoming")) {
          this.cards = data.events.filter(
            (event) => event.date >= data.currentDate
          );
          //Filtro eventos para Past Events
        } else if (document.title.includes("Past")) {
          this.cards = data.events.filter(
            (event) => event.date < data.currentDate
          );
        } else {
          this.cards = data.events;
        }
        this.cardsFiltradas = this.cards;
        this.categorias = [...new Set(this.cards.map((e) => e.category))];
          //Details
        const queryString = location.busqueda;
        const parametros = new URLSearchParams(queryString);
        const id = parametros.get("id");
        this.detalles = this.cards.find((event) => event._id == id);
          //Stats Tabla        
        let maxAttendance = Math.max(
          ...this.cards.map((event) =>
            event.assistance
              ? event.assistance / event.capacity
              : event.estimate / event.capacity
          )
        );
        let arrayMayorAsist = this.cards.filter((event) =>
          event.assistance
            ? event.assistance / event.capacity == maxAttendance
            : event.estimate / event.capacity == maxAttendance
        );
        this.mayorAsist = arrayMayorAsist[0];
        let minAttendance = Math.min(
          ...this.cards.map((event) =>
            event.assistance
              ? event.assistance / event.capacity
              : event.estimate / event.capacity
          )
        );
        let arrayMenAsist = this.cards.filter((event) =>
          event.assistance
            ? event.assistance / event.capacity == minAttendance
            : event.estimate / event.capacity == minAttendance
        );
        this.menAsist = arrayMenAsist[0];
        let maxCapacity = Math.max(...this.cards.map((event) => event.capacity));
        let arrayMaxCapacity = this.cards.filter(
          (event) => event.capacity == maxCapacity
        );
        this.capMaxima = arrayMaxCapacity[0];
        this.categoryUpcoming = this.cards
          .filter((event) => {
            if (event.estimate) {
              return event;
            }
          })
          .map(
            (event) =>
              (event = {
                category: event.category,
                revenue: event.price * event.estimate,
                attendance: event.estimate / event.capacity,
              })
          )
          .reduce((array, event) => {
            const idemCategory = array.find(
              (e) => e.category == event.category
            );
            if (idemCategory) {
              idemCategory.revenue += event.revenue;
              idemCategory.attendance =
                (idemCategory.attendance + event.attendance) / 2;
            } else {
              array.push(event);
            }
            return array;
          }, []);
        this.categoryPast = this.cards
          .filter((event) => {
            if (event.assistance) {
              return event;
            }
          })
          .map(
            (event) =>
              (event = {
                category: event.category,
                revenue: event.price * event.assistance,
                attendance: event.assistance / event.capacity,
              })
          )
          .reduce((array, event) => {
            const idemCategory = array.find(
              (e) => e.category == event.category
            );
            if (idemCategory) {
              idemCategory.revenue += event.revenue;
              idemCategory.attendance =
                (idemCategory.attendance + event.attendance) / 2;
            } else {
              array.push(event);
            }
            return array;
          }, []);
      })
      .catch((error) => console.log(error));
  },
  computed: {
    filtro() {
      this.cardsFiltradas = this.cards.filter(
        (event) =>
          (this.checked.includes(event.category) || this.checked.length === 0) &&
          event.name.toLowerCase().includes(this.busqueda.toLowerCase().trim())
      );
    },
  },
});
app.mount("#app");
