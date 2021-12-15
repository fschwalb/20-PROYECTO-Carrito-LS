/* ============================= VARIABLES ============================= */


const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];


/* ========================== EVENT LISTENER =========================== */


cargarEventListeners();

function cargarEventListeners() {

    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener( 'click', agregarCurso );

    // Elimina cursos del carrito
    carrito.addEventListener( 'click', eliminarCurso );

    // Muestra los cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem( 'carrito' )) || [];

        carritoHTML();
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener( 'click', () => {
        articulosCarrito = []; // Reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo el HTML
    })

}


/* ============================= FUNCIONES ============================= */


// Para añadir el curso al carrito

function agregarCurso(e) {

    e.preventDefault();

    //Delegation para agregar-carrito
    if ( e.target.classList.contains('agregar-carrito') ) {
        const curso = e.target.parentElement.parentElement;

        // Enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }

}

// Elimina un curso del carrito

function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );

        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}

// Leer el contenido del HTML al que dimos click y extrae la info del curso

function leerDatosCurso(curso) {

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisar si existe un elemento en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );

    if (existe) {
        
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {

            if ( curso.id === infoCurso.id )  {
                curso.cantidad++;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos no duplicados
            }

        });

        articulosCarrito = [...cursos];

    } else {

        // Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];

    }



    console.log(articulosCarrito);

    carritoHTML();
}


// Muestra el carrito de compras en el HTML

function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
         
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr'); // tr = Table Row
        row.innerHTML = `
        <td>
            <img src="${imagen}" width="100">
        </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);

    });

    // Agregar Carrito a localStorage
    sincronizarStorage();

}

function sincronizarStorage() {

    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));

}

// Elimina los cursos del tbody
function limpiarHTML() {

    // Forma lenta 
    // contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
    
}