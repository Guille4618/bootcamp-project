import { EstadoMatricula, Estudiante, Asignatura } from "../domain/types/index.js";

// ===== INTERFAZ RESPUESTA API GENÉRICA =====

export interface RespuestaAPI<T> {
  codigoEstado: number;
  exito: boolean;
  datos: T;
  errores?: string[];
}

// ===== SIMULACIÓN DE BASE DE DATOS =====

const estudiantesDB: Estudiante[] = [
  {
    id: "EST-001",
    nombreCompleto: "Ana García López",
    email: "ana.garcia@universidad.es",
    fechaNacimiento: new Date("2000-03-15"),
    curso: 2
  },
  {
    id: "EST-002",
    nombreCompleto: "Carlos Martínez Ruiz",
    email: "carlos.martinez@universidad.es",
    fechaNacimiento: new Date("1999-07-22"),
    curso: 3
  }
];

const asignaturasDB: Asignatura[] = [
  { id: "ASG-001", nombre: "Matemáticas", creditos: 6, profesor: "Dr. López" },
  { id: "ASG-002", nombre: "Programación", creditos: 8, profesor: "Dra. Martínez" }
];

// ===== MÉTODO GENÉRICO =====

export function obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === "/estudiantes") {
        resolve({
          codigoEstado: 200,
          exito: true,
          datos: estudiantesDB as T
        });
      } else if (endpoint === "/asignaturas") {
        resolve({
          codigoEstado: 200,
          exito: true,
          datos: asignaturasDB as T
        });
      } else {
        reject({
          codigoEstado: 404,
          exito: false,
          datos: null as T,
          errores: [`Endpoint ${endpoint} no encontrado`]
        });
      }
    }, 500);
  });
}