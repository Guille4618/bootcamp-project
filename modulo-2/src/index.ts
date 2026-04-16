import { generarReporte, EstadoMatricula } from "./domain/types/index.js";
import { obtenerRecurso, RespuestaAPI } from "./services/api-client.js";
import { Estudiante, Asignatura } from "./domain/types/index.js";

// ===== TEST UNIÓN DISCRIMINADA =====

const matriculaActiva: EstadoMatricula = {
  tipo: "ACTIVA",
  asignaturas: [
    { id: "ASG-001", nombre: "Matemáticas", creditos: 6, profesor: "Dr. López" },
    { id: "ASG-002", nombre: "Programación", creditos: 8, profesor: "Dra. Martínez" }
  ]
};

const matriculaSuspendida: EstadoMatricula = {
  tipo: "SUSPENDIDA",
  motivoSuspension: "Impago de tasas universitarias"
};

const matriculaFinalizada: EstadoMatricula = {
  tipo: "FINALIZADA",
  notaMedia: 8.5
};

console.log("=== Reportes de matrícula ===");
console.log(generarReporte(matriculaActiva));
console.log(generarReporte(matriculaSuspendida));
console.log(generarReporte(matriculaFinalizada));

// ===== TEST SERVICIO GENÉRICO =====

console.log("\n=== Llamadas al servicio ===");

obtenerRecurso<Estudiante[]>("/estudiantes")
  .then((respuesta: RespuestaAPI<Estudiante[]>) => {
    console.log(`Estudiantes obtenidos (código ${respuesta.codigoEstado}):`);
    respuesta.datos.forEach(e => console.log(` - ${e.nombreCompleto} (${e.email})`));
  });

obtenerRecurso<Asignatura[]>("/asignaturas")
  .then((respuesta: RespuestaAPI<Asignatura[]>) => {
    console.log(`Asignaturas obtenidas (código ${respuesta.codigoEstado}):`);
    respuesta.datos.forEach(a => console.log(` - ${a.nombre} (${a.creditos} créditos)`));
  });