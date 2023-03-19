let dataApi = [];
let dataArray;
async function getDataFromApi() {
  await fetch(`../assets/amazing.json`)
    .then((response) => response.json())
    .then((json) => (dataApi = json));
  dataArray = dataApi.events;
  console.log(dataArray);

  let cardDate = dataApi.currentDate;
  let arrayPast = dataArray.filter((e) => cardDate > e.date);
  let arrayFuture = dataArray.filter((e) => cardDate < e.date);
  console.log(arrayPast);
  console.log(arrayFuture);

  //PRIMER TABLA
  let porcentajes = [];
  arrayPast.map((eventos) => {
    porcentajes.push({
      eventos: eventos.name,
      porAssistance: ((eventos.assistance * 100) / eventos.capacity).toFixed(2),
    });
  });
  let MAX = porcentajes.sort((a, b) => b.porAssistance - a.porAssistance)[0];
  console.log(MAX);
  let MIN = porcentajes.sort((a, b) => a.porAssistance - b.porAssistance)[0];
  console.log(MIN);
  let capacity = arrayPast
    .filter((e) => e.capacity)
    .sort((a, b) => b.capacity - a.capacity)[0];
  console.log(capacity);

  //EVENTOS FUTUROS
  const categoryAssistFuture = arrayFuture.map((eventos) => eventos.category);
  const categorySetFuture = new Set(categoryAssistFuture);
  const categorysFuture = [...categorySetFuture];
  console.log(categorysFuture);

  const categoryValueFuture = []; //Creamos un Array que contiene 1 objeto con 2 propiedades
  categorysFuture.map((category) =>
    categoryValueFuture.push({
      category: category,
      evento: arrayFuture.filter((evento) => evento.category === category), //Ahora tenemos las categorias que tienen adentro todos los eventos pasados
    })
  );
  console.log(categoryValueFuture);

  let estimateAndCapacityFuture = []; // De la varible anterior mapeamos en un nuevo array,
  categoryValueFuture.map((datos) => {
    estimateAndCapacityFuture.push({
      category: datos.category,
      estimate: datos.evento.map((item) => item.estimate),
      capacity: datos.evento.map((item) => item.capacity),
      estimateRevenue: datos.evento.map((item) => item.estimate * item.price),
    });
  });
  console.log(estimateAndCapacityFuture);

  estimateAndCapacityFuture.forEach((category) => {
    let totalEstimate = 0;
    category.estimate.forEach(
      (estimate) => (totalEstimate += Number(estimate))
    ); //suma de assistencia
    category.estimate = totalEstimate;

    let totalCapacityFut = 0;
    category.capacity.forEach(
      (capacity) => (totalCapacityFut += Number(capacity))
    ); //suma de capacity
    category.capacity = totalCapacityFut;

    let totalEstimateRevenue = 0;
    category.estimateRevenue.forEach(
      (estimateRevenue) => (totalEstimateRevenue += Number(estimateRevenue))
    ); //suma de revenue
    category.estimateRevenue = totalEstimateRevenue;

    category.porcentajeAttendace = (
      (totalEstimate * 100) /
      totalCapacityFut
    ).toFixed(2); //le agregamos una nueva propiedad, el calculo de % assistencia total por categoria.
  });
  console.log(estimateAndCapacityFuture);

  //EVENTOS PASADOS

  const categoryAssit = arrayPast.map((eventos) => eventos.category); // Extrajimos las categorias del array del evento pasado
  const categorySet = new Set(categoryAssit); //Aplicamos el sett para eliminar las categorias duplicadas
  const categorys = [...categorySet]; //Ahora en categorys tenemos un array de 7 categorias
  console.log(categorys);

  const categoryValue = []; //Creamos un Array que contiene 1 objeto con 2 propiedades
  categorys.map((category) =>
    categoryValue.push({
      category: category,
      evento: arrayPast.filter((evento) => evento.category === category), //Ahora tenemos las categorias que tienen adentro todos los eventos pasados
    })
  );
  console.log(categoryValue);

  let assistAndCapacityPast = []; // De la varible anterior mapeamos en un nuevo array,
  categoryValue.map((datos) => {
    assistAndCapacityPast.push({
      category: datos.category,
      assistance: datos.evento.map((item) => item.assistance),
      capacity: datos.evento.map((item) => item.capacity),
      revenue: datos.evento.map((item) => item.assistance * item.price),
    });
  });
  console.log(assistAndCapacityPast);
  //Ahora sumamos todos los elementos de cada propiedad entre si (assistance, capacity, revenue)

  assistAndCapacityPast.forEach((category) => {
    let totalAssit = 0;
    category.assistance.forEach(
      (assistance) => (totalAssit += Number(assistance))
    ); //suma de asistencia
    category.assistance = totalAssit;

    let totalCapacity = 0;
    category.capacity.forEach(
      (capacity) => (totalCapacity += Number(capacity))
    ); //suma de capacity
    category.capacity = totalCapacity;

    let totalRevenue = 0;
    category.revenue.forEach((revenue) => (totalRevenue += Number(revenue))); //suma de revenue
    category.revenue = totalRevenue;

    category.porcentaje = ((totalAssit * 100) / totalCapacity).toFixed(2); //le agregamos una nueva propiedad, el calculo de % assistencia total por categoria.
  });
  console.log(assistAndCapacityPast);
  console.log(categoryValue);

  /**
   * *IMPRIMIR TABLAS
   */

  /*: ${MAX.porAssistance}%   : ${MIN.porAssistance}% : ${capacity.capacity}*/

  function PrintTableOne() {
    let contenedorUno = ` <tr>     
      <td>${MAX.eventos}</td>
      <td>${MIN.eventos}</td> 
      <td>${capacity.name}</td>
        </tr>`;
    document.getElementById("tablaEventsStadistics").innerHTML = contenedorUno;
  }
  PrintTableOne();

  function PrintTableTwo() {
    let contenedorDos = ``;
    estimateAndCapacityFuture.forEach((e) => {
      e.estimateAndCapacityFuture;
      contenedorDos += `<tr>
      <td>${e.category}</td>
      <td>$${(e.estimateRevenue).toLocaleString()}</td>
      <td>${e.porcentajeAttendace}%</td>
    </tr>`;
    });
    document.getElementById("tablaUpcomingEvents").innerHTML = contenedorDos;
  }
  PrintTableTwo();

  function PrintTableThree() {
    let contenedorTres = ``;
    assistAndCapacityPast.forEach((e) => {
      e.assistAndCapacityPast;
      contenedorTres += `<tr>
      <td>${e.category}</td>
      <td>$${(e.revenue).toLocaleString()}</td>
      <td>${e.porcentaje}%</td>
    </tr>`;
    });
    document.getElementById("tablaPastEvents").innerHTML = contenedorTres;
  }
  PrintTableThree();
}
getDataFromApi();
