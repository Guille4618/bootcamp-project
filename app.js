// ===========================
// ARRAY DE TAREAS
// ===========================
let tareas = [];
let filtroActual = "todas";

// ===========================
// FUNCIONES DE FECHA
// ===========================
function parseFechaLimiteISO(iso) {
    if (!iso || typeof iso !== "string") return null;
    const partes = iso.split("-");
    if (partes.length !== 3) return null;
    const anio = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);
    if (!Number.isFinite(anio) || !Number.isFinite(mes) || !Number.isFinite(dia)) return null;
    return new Date(anio, mes - 1, dia);
}

function formatearFechaLimite(iso) {
    const fecha = parseFechaLimiteISO(iso);
    if (!fecha) return "";
    return fecha.toLocaleDateString("es-ES");
}

function obtenerEstadoFechaLimite(tarea) {
    const fechaLimite = parseFechaLimiteISO(tarea.dueDate);
    if (!fechaLimite) return "none";
    const hoy = new Date();
    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const diff = fechaLimite.getTime() - hoyLocal.getTime();
    if (diff < 0) return "overdue";
    if (diff === 0) return "dueToday";
    return "upcoming";
}

// ===========================
// FUNCIONES DE DEPENDENCIAS
// ===========================
function obtenerTareaPorId(id) {
    return tareas.find(function(t) {
        return String(t.id) === String(id);
    });
}

function esTareaBloqueadaPorDependencia(tarea) {
    if (!tarea || tarea.completed) return false;
    if (!tarea.dependsOn) return false;
    const dependencia = obtenerTareaPorId(tarea.dependsOn);
    return !dependencia || dependencia.completed !== true;
}

function actualizarSelectDependencia() {
    const select = document.getElementById("selectDependencia");
    if (!select) return;
    const valorPrevio = select.value;
    select.innerHTML = "";
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "No depende de nadie";
    select.appendChild(opcionInicial);
    tareas.forEach(function(t) {
        const opcion = document.createElement("option");
        opcion.value = String(t.id);
        opcion.textContent = t.title + (t.completed ? " (completada)" : "");
        select.appendChild(opcion);
    });
    if (valorPrevio) {
        const existe = tareas.some(function(t) { return String(t.id) === String(valorPrevio); });
        if (existe) select.value = String(valorPrevio);
    }
}

// ===========================
// CREAR UNA TAREA
// ===========================
function crearTarea(titulo, prioridad, dueDate, dependsOn) {
    return {
        id: typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now() + Math.random().toString(36),
        title: titulo,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
        priority: prioridad || "media",
        dueDate: dueDate || null,
        dependsOn: dependsOn || null
    };
}

// ===========================
// ORDENAR POR PRIORIDAD
// ===========================
function ordenarPorPrioridad() {
    const orden = { alta: 1, media: 2, baja: 3 };
    tareas.sort(function(a, b) {
        const pa = orden[a.priority] || 2;
        const pb = orden[b.priority] || 2;
        return pa - pb;
    });
}

// ===========================
// AÑADIR UNA TAREA
// ===========================
function añadirTarea(titulo, prioridad, dueDate, dependsOn) {
    const tarea = crearTarea(titulo, prioridad, dueDate, dependsOn);
    tareas.push(tarea);
    ordenarPorPrioridad();
    actualizarUIYPersistencia();
}

// ===========================
// ELIMINAR UNA TAREA
// ===========================
function eliminarTarea(id) {
    const tarea = tareas.find(function(t) {
        return t.id === id;
    });
    if (!tarea) return;
    const confirmado = confirm("¿Estás seguro de que deseas eliminar la tarea: " + tarea.title + "?");
    if (!confirmado) return;
    tareas = tareas
        .filter(function(t) { return t.id !== id; })
        .map(function(t) {
            if (t.dependsOn && String(t.dependsOn) === String(id)) {
                t.dependsOn = null;
            }
            return t;
        });
    actualizarUIYPersistencia();
}

// ===========================
// COMPLETAR UNA TAREA
// ===========================
function completarTarea(id) {
    const tareaObjetivo = obtenerTareaPorId(id);
    if (!tareaObjetivo) return false;
    const nuevaCompletada = !tareaObjetivo.completed;
    if (nuevaCompletada === true && esTareaBloqueadaPorDependencia(tareaObjetivo)) {
        const dependencia = tareaObjetivo.dependsOn ? obtenerTareaPorId(tareaObjetivo.dependsOn) : null;
        const tituloDep = dependencia ? dependencia.title : "una tarea eliminada";
        alert("No puedes completar esta tarea porque depende de: " + tituloDep);
        return false;
    }
    tareas = tareas.map(function(t) {
        if (String(t.id) === String(id)) {
            t.completed = nuevaCompletada;
        }
        return t;
    });
    actualizarUIYPersistencia();
    return true;
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
    actualizarUIYPersistencia();
}

// ===========================
// COMPLETAR TODAS
// ===========================
function completarTodas() {
    tareas = tareas.map(function(tarea) {
        tarea.completed = true;
        return tarea;
    });
    actualizarUIYPersistencia();
}

// ===========================
// BORRAR COMPLETADAS
// ===========================
function borrarCompletadas() {
    tareas = tareas.filter(function(tarea) {
        return tarea.completed === false;
    });
    actualizarUIYPersistencia();
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
// VALIDACIONES FORMULARIO
// ===========================
function normalizarTitulo(titulo) {
    return titulo.trim().toLowerCase();
}

function existeTareaDuplicada(titulo) {
    const tituloNormalizado = normalizarTitulo(titulo);
    return tareas.some(function(tarea) {
        return normalizarTitulo(tarea.title) === tituloNormalizado;
    });
}

function mostrarErrorFormulario(mensaje) {
    const errorTarea = document.getElementById("error-tarea");
    const input = document.getElementById("inputTarea");
    if (errorTarea) errorTarea.textContent = mensaje;
    if (input) {
        input.classList.add("border-red-500");
        input.setAttribute("aria-invalid", "true");
    }
}

function limpiarErrorFormulario() {
    const errorTarea = document.getElementById("error-tarea");
    const input = document.getElementById("inputTarea");
    if (errorTarea) errorTarea.textContent = "";
    if (input) {
        input.classList.remove("border-red-500");
        input.removeAttribute("aria-invalid");
    }
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

    if (tareasFiltradas.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "No hay tareas pendientes, añade una nueva tarea";
        mensajeVacio.className = "text-center text-gray-500 py-4";
        lista.appendChild(mensajeVacio);
        return;
    }

    tareasFiltradas.forEach(function(tarea) {
        const clone = plantilla.content.cloneNode(true);
        const checkbox = clone.querySelector("input[type='checkbox']");
        const nombre = clone.querySelector(".nombre-tarea");
        const btnEliminar = clone.querySelector(".btn-eliminar");
        const etiquetaPrioridad = clone.querySelector(".etiqueta-prioridad");

        checkbox.checked = tarea.completed;
        nombre.textContent = tarea.title;

        // Estado de prioridad
        if (etiquetaPrioridad) {
            if (tarea.priority === "alta") {
                etiquetaPrioridad.textContent = "🔴 Alta";
                etiquetaPrioridad.className = "etiqueta-prioridad text-xs px-2 py-1 rounded bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300";
            } else if (tarea.priority === "baja") {
                etiquetaPrioridad.textContent = "🟢 Baja";
                etiquetaPrioridad.className = "etiqueta-prioridad text-xs px-2 py-1 rounded bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
            } else {
                etiquetaPrioridad.textContent = "🟡 Media";
                etiquetaPrioridad.className = "etiqueta-prioridad text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300";
            }
        }

        // Tarea completada
        if (tarea.completed) {
            nombre.style.textDecoration = "line-through";
            nombre.style.color = "gray";
        }

        // Tarea bloqueada por dependencia
        if (esTareaBloqueadaPorDependencia(tarea)) {
            checkbox.disabled = true;
            nombre.style.opacity = "0.5";
        }

        // Editar con doble clic
        nombre.addEventListener("dblclick", function() {
            const nuevoTitulo = prompt("Editar tarea:", tarea.title);
            if (nuevoTitulo && nuevoTitulo.trim() !== "") {
                editarTarea(tarea.id, nuevoTitulo.trim());
            }
        });

        checkbox.addEventListener("change", function() {
            const permitido = completarTarea(tarea.id);
            if (!permitido) {
                checkbox.checked = false;
            }
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

    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    document.getElementById("porcentaje").textContent = porcentaje + "%";
    document.getElementById("barra-progreso").style.width = porcentaje + "%";

    const barra = document.getElementById("barra-progreso");
    if (porcentaje === 100) {
        barra.className = "bg-green-500 h-3 rounded-full transition-all duration-500";
    } else if (porcentaje >= 50) {
        barra.className = "bg-yellow-500 h-3 rounded-full transition-all duration-500";
    } else {
        barra.className = "bg-blue-500 h-3 rounded-full transition-all duration-500";
    }
}

// ===========================
// FUNCION CENTRAL
// ===========================
function actualizarUIYPersistencia() {
    ordenarPorPrioridad();
    renderizarTareas();
    actualizarStats();
    guardarTareas();
    actualizarSelectDependencia();
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
        const parsed = JSON.parse(tareasGuardadas);
        tareas = Array.isArray(parsed) ? parsed : [];
        tareas = tareas.map(function(t) {
            if (!t || typeof t !== "object") return t;
            if (t.dependsOn === "" || t.dependsOn === undefined) t.dependsOn = null;
            if (typeof t.completed !== "boolean") t.completed = t.completed === true;
            if (!t.priority) t.priority = "media";
            return t;
        });
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
    if (btnDarkMode) btnDarkMode.textContent = "☀️";
}

if (btnDarkMode) {
    btnDarkMode.addEventListener("click", function() {
        document.documentElement.classList.toggle("dark");
        if (document.documentElement.classList.contains("dark")) {
            localStorage.setItem("darkMode", "true");
            btnDarkMode.textContent = "☀️";
        } else {
            localStorage.setItem("darkMode", "false");
            btnDarkMode.textContent = "🌙";
        }
    });
}

// ===========================
// EVENTOS
// ===========================
document.addEventListener("DOMContentLoaded", function() {

    const formulario = document.getElementById("form-tarea");
    const input = document.getElementById("inputTarea");

    if (input) {
        input.addEventListener("input", function() {
            limpiarErrorFormulario();
        });
    }

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();
            const titulo = input.value.trim();
            const selectPrioridad = document.getElementById("selectPrioridad");
            const selectDependencia = document.getElementById("selectDependencia");

            if (titulo === "") {
                mostrarErrorFormulario("Por favor escribe una tarea");
                return;
            }
            if (titulo.length < 3) {
                mostrarErrorFormulario("La tarea debe tener al menos 3 caracteres.");
                return;
            }
            if (existeTareaDuplicada(titulo)) {
                mostrarErrorFormulario("Esta tarea ya existe.");
                return;
            }
            limpiarErrorFormulario();
            const prioridad = selectPrioridad ? selectPrioridad.value : "media";
            const dependsOn = selectDependencia && selectDependencia.value ? selectDependencia.value : null;
            añadirTarea(titulo, prioridad, null, dependsOn);
            input.value = "";
            if (selectPrioridad) selectPrioridad.value = "media";
            if (selectDependencia) selectDependencia.value = "";
        });
    }

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
    actualizarUIYPersistencia();
});