const { createApp } = Vue;

const url = "../assets/amazing.json";

const app = createApp({
  data() {
    return {
      cards: [],
      cardsFiltradas: [],
      checked: [],
      search: "",
      detalles: {},
      categorias: [],
      categoryUpcoming: [],
      categoryPast: [],
      mayorAsist: {},
      menAsist: {},
      capMaxima: {},
    };
  },
  created() {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (document.title.includes("Upcoming Events")) {
          //Filtro eventos para Upcoming Events
          this.cards = data.events.filter(
            (event) => event.date >= data.currentDate
          );
        } else if (document.title.includes("Past Events")) {
          //Filtro eventos para Past Events
          this.cards = data.events.filter(
            (event) => event.date < data.currentDate
          );
        } else {
          this.cards = data.events;
        }
        this.cardsFiltradas = this.cards;
        this.categorias = [...new Set(this.cards.map((e) => e.category))];
        //Details
        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get("id");
        this.detalles = this.cards.find((event) => event._id == id);
        //Próximos
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
                revenue: event.price * event.capacity,
                attendance: event.estimate / event.capacity,
              })
          )
          .reduce((array, event) => {
            const categoryCoincidence = array.find(
              (e) => e.category == event.category
            );
            if (categoryCoincidence) {
              categoryCoincidence.revenue += event.revenue;
              categoryCoincidence.attendance =
                (categoryCoincidence.attendance + event.attendance) / 2;
            } else {
              array.push(event);
            }
            return array;
          }, []);
        //Pasados
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
                revenue: event.price * event.capacity,
                attendance: event.assistance / event.capacity,
              })
          )
          .reduce((array, event) => {
            const categoryCoincidence = array.find(
              (e) => e.category == event.category
            );
            if (categoryCoincidence) {
              categoryCoincidence.revenue += event.revenue;
              categoryCoincidence.attendance =
                (categoryCoincidence.attendance + event.attendance) / 2;
            } else {
              array.push(event);
            }
            return array;
          }, []);
        // Máxima asistencia stats
        let maxAttendance = Math.max(
          ...this.cards.map((elem) =>
            elem.assistance
              ? elem.assistance / elem.capacity
              : elem.estimate / elem.capacity
          )
        );
        let arrayMayorAsist = this.cards.filter((elem) =>
          elem.assistance
            ? elem.assistance / elem.capacity == maxAttendance
            : elem.estimate / elem.capacity == maxAttendance
        );
        this.mayorAsist = arrayMayorAsist[0];
        // Mínima asistencia stats
        let minAttendance = Math.min(
          ...this.cards.map((elem) =>
            elem.assistance
              ? elem.assistance / elem.capacity
              : elem.estimate / elem.capacity
          )
        );
        let arrayMenAsist = this.cards.filter((elem) =>
          elem.assistance
            ? elem.assistance / elem.capacity == minAttendance
            : elem.estimate / elem.capacity == minAttendance
        );
        this.menAsist = arrayMenAsist[0];
        // Capacidad Máxima stats

        let maxCapacity = Math.max(...this.cards.map((elem) => elem.capacity));
        let arrayMaxCapacity = this.cards.filter(
          (elem) => elem.capacity == maxCapacity
        );
        this.capMaxima = arrayMaxCapacity[0];
      })
      .catch((error) => console.log(error));
  },
  computed: {
    filtro() {
      this.cardsFiltradas = this.cards.filter(
        (elem) =>
          (this.checked.includes(elem.category) || this.checked.length === 0) &&
          elem.name.toLowerCase().includes(this.search.toLowerCase().trim())
      );
    },
  },
});

app.mount("#app");
