// ===========================
// ARRAY DE TAREAS
// ===========================
let tareas = [];
let filtroActual = "todas";

// ===========================
// CREAR UNA TAREA
// ===========================
function crearTarea(titulo) {
    return {
        id: Date.now(),
        title: titulo,
        completed: false,
        createdAt: new Date().toLocaleDateString()
    };
}

// ===========================
// AÑADIR UNA TAREA
// ===========================
function añadirTarea(titulo) {
    const tarea = crearTarea(titulo);
    tareas.push(tarea);
    renderizarTareas();
    actualizarStats();
    guardarTareas();
}

// ===========================
// ELIMINAR UNA TAREA
// ===========================
function eliminarTarea(id) {
    tareas = tareas.filter(function(tarea) {
        return tarea.id !== id;
    });
    renderizarTareas();
    actualizarStats();
    guardarTareas();
}

// ===========================
// COMPLETAR UNA TAREA
// ===========================
function completarTarea(id) {
    tareas = tareas.map(function(tarea) {
        if (tarea.id === id) {
            tarea.completed = !tarea.completed;
        }
        return tarea;
    });
    renderizarTareas();
    actualizarStats();
    guardarTareas();
}

// ===========================
// EDITAR UNA TAREA
// ===========================
function editarTarea(id, nuevoTitulo) {
    tareas = tareas.map(function(tarea) {
        if (tarea.id === id) {
            tarea.title = nuevoTitulo;
        }
        return tarea;
    });
    renderizarTareas();
    guardarTareas();
}

// ===========================
// COMPLETAR TODAS
// ===========================
function completarTodas() {
    tareas = tareas.map(function(tarea) {
        tarea.completed = true;
        return tarea;
    });
    renderizarTareas();
    actualizarStats();
    guardarTareas();
}

// ===========================
// BORRAR COMPLETADAS
// ===========================
function borrarCompletadas() {
    tareas = tareas.filter(function(tarea) {
        return tarea.completed === false;
    });
    renderizarTareas();
    actualizarStats();
    guardarTareas();
}

// ===========================
// FILTRAR TAREAS
// ===========================
function filtrarTareas() {
    const inputBusqueda = document.getElementById("inputBusqueda");
    const textoBusqueda = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : "";

    return tareas.filter(function(tarea) {
        let pasaFiltro = false;
        if (filtroActual === "todas") {
            pasaFiltro = true;
        } else if (filtroActual === "pendientes") {
            pasaFiltro = !tarea.completed;
        } else if (filtroActual === "completadas") {
            pasaFiltro = tarea.completed;
        }
        const pasaBusqueda = tarea.title.toLowerCase().includes(textoBusqueda);
        return pasaFiltro && pasaBusqueda;
    });
}

// ===========================
// RENDERIZAR TAREAS
// ===========================
function renderizarTareas() {
    const lista = document.getElementById("lista-tareas");
    const plantilla = document.getElementById("plantilla-tarea");
    
    if (!lista || !plantilla) return;
    
    lista.innerHTML = "";

    const tareasFiltradas = filtrarTareas();

    tareasFiltradas.forEach(function(tarea) {
        const clone = plantilla.content.cloneNode(true);
        const checkbox = clone.querySelector("input[type='checkbox']");
        const nombre = clone.querySelector(".nombre-tarea");
        const btnEliminar = clone.querySelector(".btn-eliminar");

        checkbox.checked = tarea.completed;
        nombre.textContent = tarea.title;

        if (tarea.completed) {
            nombre.style.textDecoration = "line-through";
            nombre.style.color = "gray";
        }

        nombre.addEventListener("dblclick", function() {
            const nuevoTitulo = prompt("Editar tarea:", tarea.title);
            if (nuevoTitulo && nuevoTitulo.trim() !== "") {
                editarTarea(tarea.id, nuevoTitulo.trim());
            }
        });

        checkbox.addEventListener("change", function() {
            completarTarea(tarea.id);
        });

        btnEliminar.addEventListener("click", function() {
            eliminarTarea(tarea.id);
        });

        lista.appendChild(clone);
    });
}

// ===========================
// ACTUALIZAR ESTADISTICAS
// ===========================
function actualizarStats() {
    const total = tareas.length;
    const completadas = tareas.filter(function(tarea) {
        return tarea.completed === true;
    }).length;
    const pendientes = total - completadas;

    document.getElementById("total").textContent = total;
    document.getElementById("completadas").textContent = completadas;
    document.getElementById("pendientes").textContent = pendientes;
}

// ===========================
// GUARDAR EN LOCALSTORAGE
// ===========================
function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// ===========================
// CARGAR DE LOCALSTORAGE
// ===========================
function cargarTareas() {
    const tareasGuardadas = localStorage.getItem("tareas");
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
    } else {
        tareas = [];
    }
}

// ===========================
// MODO OSCURO
// ===========================
const btnDarkMode = document.getElementById("btn-dark-mode");

if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
    btnDarkMode.textContent = "☀️ Modo claro";
}

btnDarkMode.addEventListener("click", function() {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("darkMode", "true");
        btnDarkMode.textContent = "☀️ Modo claro";
    } else {
        localStorage.setItem("darkMode", "false");
        btnDarkMode.textContent = "🌙 Modo oscuro";
    }
});

// ===========================
// EVENTOS
// ===========================
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("form-tarea");
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();
        const input = document.getElementById("inputTarea");
        const titulo = input.value.trim();
        if (titulo === "") {
            alert("Por favor escribe una tarea");
            return;
        }
        añadirTarea(titulo);
        input.value = "";
    });

    document.getElementById("btn-todas").addEventListener("click", function() {
        filtroActual = "todas";
        renderizarTareas();
    });

    document.getElementById("btn-pendientes").addEventListener("click", function() {
        filtroActual = "pendientes";
        renderizarTareas();
    });

    document.getElementById("btn-completadas").addEventListener("click", function() {
        filtroActual = "completadas";
        renderizarTareas();
    });

    document.getElementById("inputBusqueda").addEventListener("input", function() {
        renderizarTareas();
    });

    document.getElementById("btn-completar-todas").addEventListener("click", function() {
        completarTodas();
    });

    document.getElementById("btn-borrar-completadas").addEventListener("click", function() {
        borrarCompletadas();
    });

    // Inicialización
    cargarTareas();
    renderizarTareas();
    actualizarStats();
});