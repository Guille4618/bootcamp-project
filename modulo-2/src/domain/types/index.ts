// ===== ENTIDADES DEL DOMINIO =====

export interface Estudiante {
  readonly id: string;
  nombreCompleto: string;
  email: string;
  fechaNacimiento: Date;
  curso: number;
}

export interface Asignatura {
  readonly id: string;
  nombre: string;
  creditos: number;
  profesor: string;
}

// ===== UNIÓN DISCRIMINADA: EstadoMatricula =====

export interface MatriculaActiva {
  tipo: "ACTIVA";
  asignaturas: Asignatura[];
}

export interface MatriculaSuspendida {
  tipo: "SUSPENDIDA";
  motivoSuspension: string;
}

export interface MatriculaFinalizada {
  tipo: "FINALIZADA";
  notaMedia: number;
}

export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// ===== FUNCIÓN GENERAR REPORTE =====

export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `Matrícula activa con ${estado.asignaturas.length} asignaturas: ${estado.asignaturas.map(a => a.nombre).join(", ")}`;
    case "SUSPENDIDA":
      return `Matrícula suspendida. Motivo: ${estado.motivoSuspension}`;
    case "FINALIZADA":
      return `Matrícula finalizada con nota media: ${estado.notaMedia}`;
  }
}