# Arquitectura del Módulo 2

## Modelo de datos

### ¿Por qué `interface` y no `type`?
Se ha usado `interface` para `Estudiante` y `Asignatura` porque representan
entidades del dominio con estructura de objeto. Las interfaces permiten
extensión y son más legibles para modelar datos jerárquicos.

Se ha usado `type` para `EstadoMatricula` porque es una unión de tres
interfaces distintas, algo que solo permite `type`.

## Unión Discriminada
`EstadoMatricula` tiene tres estados posibles: `ACTIVA`, `SUSPENDIDA` y
`FINALIZADA`. Cada uno tiene la propiedad `tipo` como discriminante, lo que
permite a TypeScript estrechar el tipo de forma segura dentro del `switch`.

## Genéricos
`RespuestaAPI<T>` abstrae la estructura de cualquier respuesta de red.
El método `obtenerRecurso<T>` puede devolver estudiantes, asignaturas o
cualquier entidad futura sin duplicar código, manteniendo el tipado estricto.