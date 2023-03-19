const { createApp } = Vue

const url = "../assets/amazing.json"

const app = createApp({
  data() {
    return {
      cards: [],
      cardsFiltradas: [],
      checked: [],
      search: "",
      categorias: [],
      categoryUpcoming: [],
      categoryPast: [],
      mayorAsist: {},
      menAsist: {},
      capMaxima: {}
    }
    },created(){
      fetch(url)
      .then(res => res.json())
      .then(data => {
        if(document.title.includes("Upcoming Events")){
          //Filtro eventos para Upcoming Events
          this.cards = data.events.filter(event => event.date >= data.currentDate);
        }
        else if(document.title.includes("Past Events")){
          //Filtro eventos para Past Events
          this.cards = data.events.filter(event => event.date < data.currentDate);
        }
        else{
          this.cards = data.events;
        }
        this.cardsFiltradas = this.cards;
        this.categorias = [...new Set(this.cards.map(e => e.category))];
        //Próximos
        this.categoryUpcoming = this.cards.filter(elem=>{if(elem.estimate){return elem}})
        .map(elem =>
          elem = {category: elem.category,
            revenue: elem.price*elem.capacity,
            attendance: elem.estimate/elem.capacity
          }
        ).reduce((array, elem) =>{
          const categoryCoincidence = array.find(e => e.category == elem.category);
          if (categoryCoincidence){
            categoryCoincidence.revenue += elem.revenue;
            categoryCoincidence.attendance = (categoryCoincidence.attendance+elem.attendance)/2;
          } else{
            array.push(elem);
          }
          return array;
        },[]);
        //Pasados
        this.categoryPast = this.cards.filter(elem=>{if(elem.assistance){return elem}})
        .map(elem =>
          elem = {category: elem.category,
            revenue: elem.price*elem.capacity,
            attendance: elem.assistance/elem.capacity
          }
        ).reduce((array, elem) =>{
          const categoryCoincidence = array.find(e => e.category == elem.category);
          if (categoryCoincidence){
            categoryCoincidence.revenue += elem.revenue;
            categoryCoincidence.attendance = (categoryCoincidence.attendance+elem.attendance)/2;
          } else{
            array.push(elem);
          }
          return array;
        },[]);
        // Máxima asistencia stats
        let maxAttendance = Math.max(...this.cards.map(elem => elem.assistance ? elem.assistance/elem.capacity : elem.estimate/elem.capacity));
let arrayMayorAsist = this.cards.filter(elem => elem.assistance ? elem.assistance/elem.capacity == maxAttendance : elem.estimate/elem.capacity == maxAttendance);
this.mayorAsist = arrayMayorAsist[0];
        // Mínima asistencia stats
        let minAttendance = Math.min(...this.cards.map(elem => elem.assistance ? elem.assistance/elem.capacity : elem.estimate/elem.capacity));
let arrayMenAsist = this.cards.filter(elem => elem.assistance ? elem.assistance/elem.capacity == minAttendance : elem.estimate/elem.capacity == minAttendance);
this.menAsist = arrayMenAsist[0];
        //Capacidad Máxima stats
        
        let maxCapacity = Math.max(...this.cards.map(elem => elem.capacity));
        let arrayMaxCapacity = this.cards.filter(elem => elem.capacity == maxCapacity);
        this.capMaxima = arrayMaxCapacity[0];
      })
      .catch(error => console.log(error))
      
    },computed:{
      filtro(){
        this.cardsFiltradas = this.cards.filter(elem =>
          (this.checked.includes(elem.category) || this.checked.length === 0)
          && elem.name.toLowerCase().includes(this.search.toLowerCase().trim())
        )
      }
    }
  })
  
  app.mount('#app')
