// Selectores
const content = document.querySelector('.content');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const container = document.querySelector('.alerta'); // Selecciona el contenedor donde va la alerta

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  // Validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;

  if(ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios');
    return;
  }

  // Consultar en la API
  consultarAPI(ciudad, pais)
}

function mostrarError(mensaje) {
  // Limpiar alertas previas
  const alertaExistente = document.querySelector('.alerta div');
  if (alertaExistente) {
    alertaExistente.remove();
  }

  // Crear la alerta
  const alerta = document.createElement('div');
  
  // Añadir contenido HTML a la alerta
  alerta.innerHTML = `
    <strong>Error!</strong>
    <div>${mensaje}<div>
  `;

  // Estilos de la alerta
  alerta.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; 
  alerta.style.border = '5px solid red'; 
  alerta.style.color = 'white'; 
  alerta.style.padding = '15px'; 
  alerta.style.marginTop = '10px'; 
  alerta.style.borderRadius = '5px';
  alerta.style.fontFamily = 'Arial'; 
  alerta.style.fontSize = '18px'; 
  alerta.style.textAlign = 'center'; 
  alerta.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

  // Agregar al contenedor de alertas
  container.appendChild(alerta);

  // Remover la alerta después de 3 segundos 
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

function consultarAPI(ciudad, pais) {
  
  const appID = 'b34ab38c625a5d7444c87dd0cbc516c7';

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}&units=metric`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
      if(datos.cod === "404"){
        mostrarError('Ups! Ciudad no encontrada.')
        return;
      }
      mostrarClima(datos)
    })
}

function mostrarClima(datos) {
  // Datos que vamos a mostrar
  const { name, main: { temp, temp_max, temp_min } } = datos;

  //Definimos variables
  const centigrados = kelvinaCentigrados(temp);
  const max = kelvinaCentigrados(temp_max);
  const min = kelvinaCentigrados(temp_min);

  //Creamos elementos
  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.style.fontFamily = 'Arial';
  nombreCiudad.style.fontSize = '28px';
  nombreCiudad.style.fontWeight = 'bold';

  const actual = document.createElement('p');
  actual.innerHTML = `Temperatura: ${centigrados} &#8451;`;  
  actual.style.fontFamily = 'Arial';
  actual.style.fontSize = '48px';
  actual.style.fontWeight = 'bold';

  const temMaxima = document.createElement('p');
  temMaxima.innerHTML = `Max:  ${max}  &#8451;`;
  temMaxima.style.fontFamily = 'Arial';
  temMaxima.style.fontSize = '24px';
  temMaxima.style.fontWeight = 'bold';

  const temMinima = document.createElement('p');
  temMinima.innerHTML = `Min:  ${min}  &#8451;`;
  temMinima.style.fontFamily = 'Arial';
  temMinima.style.fontSize = '24px';
  temMinima.style.fontWeight = 'bold';
  
  // Crear un div para agrupar los resultados
  const resultadoDiv = document.createElement('div');
  
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(temMaxima);
  resultadoDiv.appendChild(temMinima);

  // Agregar el div al contenedor de resultados
  const resultado = document.querySelector('#resultado');
  resultado.innerHTML = '';  // Limpiar resultados anteriores
  resultado.appendChild(resultadoDiv);
}

//Funcion para convertir los grados a celsios
const kelvinaCentigrados = grados => parseInt (grados - 273.15); 