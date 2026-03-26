# Experimentos con IA - Configuración MCP

##Objetivo
Configurar el servidor MCP de Filesystem en Cursor para permitir que la IA accede directamente a los archivos del proyecto de copiar y pegar contenido de manera manual

##Problemas encontrados

### Error: `error-showed`
Durante la configuración inicial el servidor MCP mostraba un estado de error 
en Cursor. La IA no podía acceder a los archivos del proyecto.

**Solución:** Se revisó la configuración hasta resolver el error completamente, 
dejando el servidor MCP operativo y sin errores.

## Prueba de funcionamiento

Se le pidió a la IA:
> "Accede al proyecto mediante MCP y dime qué tareas hay definidas en TaskFlow"

**Resultado:** La IA leyó correctamente `README.md` y `app.js` mediante MCP 
y extrajo las siguientes funcionalidades definidas en TaskFlow:

- `crearTarea` / `añadirTarea` — Añadir tareas
- `completarTarea` — Marcar tarea como completada/pendiente
- `editarTarea` — Editar una tarea (doble click)
- `eliminarTarea` — Eliminar una tarea
- `completarTodas` — Completar todas las tareas
- `borrarCompletadas` — Borrar solo las completadas
- `filtrarTareas` — Filtrar por estado y búsqueda por texto
- `actualizarStats` — Ver estadísticas totales

## Conclusión
El MCP de Filesystem funciona correctamente. Cursor puede acceder a la 
información del proyecto en tiempo real, lo que permite a la IA dar 
respuestas más precisas y contextuales sin intervención manual.

## ¿Cuándo es útil el Filesystem MCP?

### Casos en los que aporta valor
- **Acceder a archivos sin copiar/pegar:** La IA lee directamente lo que 
  necesita del proyecto en vez de que tú se lo proporciones manualmente.
- **Herramientas personalizadas:** Integrar scripts, endpoints o servicios 
  propios usando MCP como adaptador común.
- **Flujos de trabajo complejos:** Cuando el agente necesita coordinar varios 
  pasos (buscar, leer, generar, verificar) de forma automática.
- **Separación de permisos:** Limitar qué puede leer o modificar la IA 
  (por ejemplo, solo lectura en ciertas carpetas).
- **Extensibilidad:** Poder enchufar múltiples servidores MCP y que la IA 
  los trate de forma consistente.

### Cuándo NO aporta mucho
Para tareas simples (cambios pequeños, explicaciones generales) donde ya 
tienes toda la información en el chat: MCP introduce complejidad innecesaria.

### En este proyecto concreto
El Filesystem MCP es útil para que Cursor lea automáticamente los archivos 
de TaskFlow (app.js, README.md, docs/) y dé respuestas más precisas y 
contextuales sin intervención manual.

## 5 consultas realizadas con MCP

### Consulta 1: Función más larga y compleja
**Pregunta:** "Lee el archivo app.js y dime qué función es la más larga y compleja"

**Resultado:** La función más larga es el callback de `DOMContentLoaded`. 
Entre las funciones con nombre, la más compleja es `renderizarTareas()` 
porque gestiona DOM, filtros, estado visual y eventos por cada tarea.

---

### Consulta 2: Código duplicado o repetitivo
**Pregunta:** "Accede al proyecto y dime si hay algún código duplicado"

**Resultado:** Se encontraron varios problemas:
- Repetición de `renderizarTareas(); actualizarStats(); guardarTareas();` 
  en varias funciones (refactorizable con un helper `refrescarTodo()`).
- **Bug crítico:** `actualizarUIYPersistencia()` se llama a sí misma 
  causando recursión infinita.
- Comentario duplicado en `index.html`.
- Caracteres extraños repetidos en selectores de `style.css`.

---

### Consulta 3: Secciones que faltan en el README
**Pregunta:** "Lee el README.md y dime si le falta alguna sección importante"

**Resultado:** El README está demasiado breve. Le faltan:
- Cómo ejecutar / Quickstart
- Requisitos y tecnologías usadas
- Explicación de persistencia en localStorage
- Estructura del proyecto
- Además, el enlace al wireframe está roto (ruta incorrecta).

---

### Consulta 4: Función que mejoraría primero
**Pregunta:** "Mira el código y dime qué función mejorarías primero y por qué"

**Resultado:** `actualizarUIYPersistencia()` es prioritaria porque tiene 
recursión infinita y se activa al borrar tareas, lo que puede colgar la app. 
La solución es que llame a `renderizarTareas()`, `actualizarStats()` 
y `guardarTareas()` en vez de a sí misma.

---

### Consulta 5: Estructura de carpetas
**Pregunta:** "Accede al proyecto y dime si la estructura de carpetas es correcta"

**Resultado:** La estructura base es correcta para un proyecto estático. 
Hay que corregir:
- Typo en `docs/desing/` → renombrar a `docs/design/`
- `style.css` no está enlazado en `index.html`
- Actualizar la ruta del wireframe en `README.md`

## Bloque 6: Documentación asistida por IA

### Paso 1: Nueva versión del README
Se pidió a la IA que reescribiera el README.md completo. Resultado:
- Añadió secciones de Funcionalidades, Cómo ejecutar y Estructura del proyecto.
- Corrigió la ruta rota del wireframe.
- Añadió links a la documentación de `docs/ai/`.
- Mantuvo la sección de Setup del entorno del bootcamp.

### Paso 2: Documentación de funciones
La IA documentó todas las funciones de `app.js`:
- Variables de estado: `tareas` y `filtroActual`.
- 12 funciones documentadas con su propósito.
- Detectó un **bug crítico:** `actualizarUIYPersistencia()` tiene 
  recursión infinita que rompe el botón de eliminar.

### Paso 3: Ejemplos de uso en el README
La IA generó secciones completas de uso:
- Cómo ejecutar la app (abrir index.html / Live Server).
- Guía de uso paso a paso (añadir, editar, filtrar, buscar...).
- Explicación de persistencia en localStorage.

### Conclusión del bloque
La IA fue capaz de leer el código real del proyecto mediante MCP y generar 
documentación precisa y útil, incluyendo la detección de bugs no previstos.

## Bloque 7: Experimentar con IA en programación

### Problema 1: Bug en actualizarUIYPersistencia()
**Descripción:** La función se llamaba a sí misma causando recursión 
infinita, lo que rompía el botón de eliminar tarea.

### Sin IA
- Tiempo: 20-25 minutos
- Proceso: fue necesario leer el código varias veces para localizar 
  el error y entender la causa.
- Solución: funcional pero diferente a la de la IA.

### Con IA
- Tiempo: ~2 minutos
- Proceso: la IA identificó el error de forma inmediata y propuso 
  una solución clara y bien estructurada.
- Solución: llamar a `renderizarTareas()`, `actualizarStats()` 
  y `guardarTareas()` dentro de la función en vez de a sí misma.

### Comparación
| | Sin IA | Con IA |
|---|---|---|
| Tiempo | 20-25 min | ~2 min |
| Comprensión del error | Costó varias lecturas | Inmediata |
| Calidad del código | Funcional | Más limpio y estructurado |

### Conclusión
La IA es significativamente más rápida para detectar y resolver bugs. 
Sin embargo, resolverlo manualmente primero ayuda a entender mejor 
el problema y el código.

### Problema 2: Código repetitivo en app.js
**Descripción:** Varias funciones repetían siempre la misma secuencia 
`renderizarTareas(); actualizarStats(); guardarTareas();`.

### Sin IA
- Tiempo: ~4 minutos
- Proceso: más rápido que el problema anterior, ya iba cogiendo 
  ritmo con el código.
- Solución: funcional y parecida a la de la IA.

### Con IA
- Tiempo: menos de 4 minutos
- Proceso: identificó todas las repeticiones automáticamente y 
  las sustituyó de forma consistente.
- Solución: creó `refrescarTodo()` agrupando las tres llamadas 
  y actualizó todas las referencias.

### Comparación
| | Sin IA | Con IA |
|---|---|---|
| Tiempo | ~4 min | < 4 min |
| Dificultad | Menor que el bug anterior | Inmediato |
| Calidad del código | Funcional | Consistente |

### Conclusión
Con problemas de refactorización más mecánicos la diferencia de tiempo 
es menor, pero la IA sigue siendo más rápida y consistente al no 
perderse ninguna repetición.

### Problema 3: style.css no enlazado en index.html
**Descripción:** El archivo style.css existía en el proyecto pero no 
estaba enlazado en index.html, por lo que los estilos no se aplicaban.

### Sin IA
- Tiempo: < 1 minuto
- Proceso: localizar el head de index.html y añadir el link.
- Solución: idéntica a la de la IA.

### Con IA
- Tiempo: ~1 minuto
- Proceso: revisó index.html, detectó que faltaba y lo añadió.
- Solución: correcta y directa.

### Comparación
| | Sin IA | Con IA |
|---|---|---|
| Tiempo | < 1 min | ~1 min |
| Dificultad | Muy baja | Muy baja |
| Calidad del código | Idéntica | Idéntica |

### Conclusión
En problemas muy simples y mecánicos la diferencia entre resolverlo 
solo o con IA es mínima o inexistente. La IA aporta más valor 
en problemas complejos como bugs o refactorizaciones grandes.