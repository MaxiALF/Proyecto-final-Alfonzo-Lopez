// variables 
const formulario = document.querySelector ('#Registro');
const luchador = document.querySelector ('#nombre');
const peleasGan = document.querySelector ('#peleasGanadas');
const totalPeleas = document.querySelector ('#totalPeleas');
const respPor = document.querySelector ('#respuestaPor');
const secLucha = document.querySelector ('#secPeleador');
const ListLuch = document.querySelector('#listaLuchadores');
const Agregar = document.querySelector ('#Agregar');
const siAgregar = document.querySelector ('#AgSi');
const noAgregar = document.querySelector ('#AgNo');
const resetButton = document.querySelector ('#resetBtn');

const peleadores = JSON.parse(localStorage.getItem('peleadores')) || []

class Persona {
    constructor({nombre, TotaldeCombates, porcentajedeVictorias}) {
        this.nombre = nombre
        this.TotaldeCombates = TotaldeCombates
        this.porcentajedeVictorias = porcentajedeVictorias
    }
}

//funcion de formulario y calculo de porcentaje
formulario.onsubmit= e => {
    e.preventDefault ();
    const nombre = luchador.value;
    const CombatesGanados = parseFloat(peleasGan.value);  
    const TotaldeCombates = parseFloat(totalPeleas.value);

    function Calculo(TotaldeCombates, CombatesGanados) {
        const Formula = CombatesGanados * 100 / TotaldeCombates;
        return Formula;
    };

    const porcentajedeVictorias = Calculo(TotaldeCombates, CombatesGanados);
    
    let porcentT = respPor ; 
    porcentT.innerHTML = ("<h2>el porcentaje de victoria es de % <h2>" + porcentajedeVictorias); 
    
    const persona = new Persona({nombre, TotaldeCombates, porcentajedeVictorias});

    guardarPersona(persona);

    luchador.value = '';
    peleasGan.value = '';
    totalPeleas.value = '';

};

//funcion guardar luchadores
function guardarPersona(persona) {
    peleadores.push(persona);
    localStorage.setItem('peleadores', JSON.stringify(peleadores));

}

//botones para agregar mas luchadores o no
siAgregar.addEventListener('click', () => {
    luchador.value = '';
    peleasGan.value = '';
    totalPeleas.value = '';
    respPor.innerHTML = '';
});

noAgregar.addEventListener('click', () => {
    const luchadoresOrdenados = peleadores.slice().sort((a, b) => {
        if (b.porcentajedeVictorias - a.porcentajedeVictorias !== 0) {
            return b.porcentajedeVictorias - a.porcentajedeVictorias;
        } else {
            return a.nombre.localeCompare(b.nombre);
        }
    });

    // respuesta en forma de lista con boton de eliminación
    let listaHTML = '<ul>';
    luchadoresOrdenados.forEach((luchador, index) => {
        listaHTML += `
            <li>${luchador.nombre} - Porcentaje de victorias: ${luchador.porcentajedeVictorias}%
                <button class="eliminar" data-index="${index}">Borrar</button>
            </li>
        `;
    });
    listaHTML += '</ul>';
    secLucha.style.display = 'block';
    ListLuch.innerHTML = listaHTML;

    // Botones de eliminación
    const botonesEliminar = document.querySelectorAll('.eliminar');
    botonesEliminar.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            eliminarLuchador(index);
        });
    });
});

//función para eliminar luchador/res
function eliminarLuchador(index) {
    peleadores.splice(index, 1);
    localStorage.setItem('peleadores', JSON.stringify(peleadores));
    noAgregar.click();
}

//ejecutar funcion de crear tarjetas con luchadores cuando se cargue la página
window.addEventListener('load', () => {
    const tarjetaLuchador = document.getElementById('tarjetaLuchador');

    const url = './luchadores.json'
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            const luchadores = data.luchadores;

            //Recorro los datos y creo una tarjeta para cada luchador
            luchadores.forEach(luchador => {
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('tarjeta');

                tarjeta.innerHTML = `
                    <img src="${luchador.imageURL}">
                    <h2>${luchador.nombre}</h2>
                    <p>Edad: ${luchador.edad}</p>
                    <p>Peso: ${luchador.peso}</p>
                    <p>Estatura: ${luchador.estatura}</p>
                    <p>Porcentaje de victorias: ${luchador.porcentVic}</p>
                `;

                tarjetaLuchador.appendChild(tarjeta);
            });
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});