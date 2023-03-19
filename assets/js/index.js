const { createApp } = Vue

const url = "../assets/amazing.json"

if(document.querySelector(".cards")){
  document.querySelector(".cards").style.display = "none"
}

const app = createApp({
  data() {
    return {
      cards: [],
      filteredCards: [],
      categories: [],
      checked: [],
      search: "",
      detail: {},
      upcEventsByCategory: [],
      pastEventsByCategory: [],
      highestAttendance: {},
      lowerAttendance: {},
      largerCapacity: {}
    }
    },created(){
      fetch(url)
      .then(res => res.json())
      .then(data => {
        if(document.title.includes("Upcoming Events")){
          //Page Upcoming Events
          this.cards = data.events.filter(event => event.date >= data.currentDate);
        }
        else if(document.title.includes("Past Events")){
          //Page Past Events
          this.cards = data.events.filter(event => event.date < data.currentDate);
        }
        else{
          this.cards = data.events;
        }
        this.filteredCards = this.cards;
        this.categories = [...new Set(this.cards.map(e => e.category))];
        //Page Details
        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        const id = params.get('id');
        const $div = document.querySelector(".cardDetails");
        this.detail = this.cards.find(elem => elem._id == id)
        //Page Stats
        //UPCOMING
        this.upcEventsByCategory = this.cards.filter(elem=>{if(elem.estimate){return elem}})
        .map(elem =>
          elem = {category: elem.category,
            revenue: elem.price*elem.capacity,
            attendance: elem.estimate/elem.capacity
          }
        ).reduce((acc, elem) =>{
          const categoryCoincidence = acc.find(e => e.category == elem.category);
          if (categoryCoincidence){
            categoryCoincidence.revenue += elem.revenue;
            categoryCoincidence.attendance = (categoryCoincidence.attendance+elem.attendance)/2;
          } else{
            acc.push(elem);
          }
          return acc;
        },[]);
        //PAST
        this.pastEventsByCategory = this.cards.filter(elem=>{if(elem.assistance){return elem}})
        .map(elem =>
          elem = {category: elem.category,
            revenue: elem.price*elem.capacity,
            attendance: elem.assistance/elem.capacity
          }
        ).reduce((acc, elem) =>{
          const categoryCoincidence = acc.find(e => e.category == elem.category);
          if (categoryCoincidence){
            categoryCoincidence.revenue += elem.revenue;
            categoryCoincidence.attendance = (categoryCoincidence.attendance+elem.attendance)/2;
          } else{
            acc.push(elem);
          }
          return acc;
        },[]);
        //HIGHEST ATTENDANCE
        let maxAttendance = Math.max(...this.cards.map(elem => elem.assistance ? elem.assistance/elem.capacity : elem.estimate/elem.capacity));
        let arrayHighestAttendance = this.cards.filter(elem => elem.assistance ? elem.assistance/elem.capacity == maxAttendance : elem.estimate/elem.capacity == maxAttendance);
        let time1 = 1;
        this.highestAttendance = arrayHighestAttendance[0];
        setInterval(() => {
          this.highestAttendance = arrayHighestAttendance[time1];
          time1 < arrayHighestAttendance.length-1 ? time1++ : time1 = 0;
        },5000)
        // LOWER ATTENDANCE
        let minAttendance = Math.min(...this.cards.map(elem => elem.assistance ? elem.assistance/elem.capacity : elem.estimate/elem.capacity));
        let arrayLowertAttendance = this.cards.filter(elem => elem.assistance ? elem.assistance/elem.capacity == minAttendance : elem.estimate/elem.capacity == minAttendance);
        let time2 = 1;
        this.lowerAttendance = arrayLowertAttendance[0];
        setInterval(() => {
          this.lowerAttendance = arrayLowertAttendance[time2];
          time2 < arrayLowertAttendance.length-1 ? time2++ : time2 = 0;
        },5000)
        //LARGER CAPACITY
        let maxCapacity = Math.max(...this.cards.map(elem => elem.capacity));
        let arrayMaxCapacity = this.cards.filter(elem => elem.capacity == maxCapacity);
        let time3 = 1;
        this.largerCapacity = arrayMaxCapacity[0];
        setInterval(() => {
          this.largerCapacity = arrayMaxCapacity[time3];
          time3 < arrayMaxCapacity.length-1 ? time3++ : time3 = 0;
        },5000)
      })
      .catch(error => console.log(error))
      .finally(() => {
        setTimeout(function(){
          if(document.querySelector(".spinner") && document.querySelector(".cards")){
            document.querySelector(".spinner").style.display = "none";
            document.querySelector(".cards").style.display = "flex";
          }
        },1800);
      });
    },computed:{
      filtro(){
        this.filteredCards = this.cards.filter(elem =>
          (this.checked.includes(elem.category) || this.checked.length === 0)
          && elem.name.toLowerCase().includes(this.search.toLowerCase().trim())
        )
      }
    }
  })
  
  app.mount('#app')




/* const { createApp } = Vue
const url = './assets/amazing.json'
const app = createApp( {
    data(){
        return {
            events : [],
            categories : [],
            eventsFiltrados : [],
            valorBusqueda : '',
            checked : [],
            event: undefined,
            titulo: '',

        }
    },
     created(){
      this.getData()
    },
    methods: {
        async getData(){
            try {
                const response = await fetch(url)
                const data = await response.json()
                if( document.title.includes('Details') ){
                    let aux = location.search
                    let params = new URLSearchParams(aux)
                    let id = params.get('id')
                    this.event = data.find( event => event._id === id )
                    this.titulo = this.event.name
                }else{
    
                    const fn = event => event.category
                    this.events = data.filter( fn )
                    this.eventsFiltrados = this.events
                    this.categories = [ ...new Set(this.events.map( fn )) ]
                } 
                return data           
           } catch (error) {
                console.log( error )
           }
        }
    },
    computed: {
        filtro(){
            this.eventsFiltrados = this.events.filter( event => 
             (this.checked.includes(event.category) || this.checked.length === 0) 
             && event.name.toLowerCase().includes(this.valorBusqueda.toLowerCase()))
         }
    }


} )
app.mount("#app")
 */