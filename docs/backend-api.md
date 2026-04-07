# Herramientas para APIs Backend

## Postman
Postman es una herramienta para probar APIs REST. Permite hacer peticiones HTTP (GET, POST, PUT, DELETE) de forma visual sin necesidad de escribir código. Se usa para:
- Probar endpoints durante el desarrollo
- Documentar colecciones de peticiones
- Simular errores y casos extremos
- Compartir colecciones con el equipo

En este proyecto lo hemos usado para probar todos los endpoints de la API de TaskFlow.

## Axios
Axios es una librería de JavaScript para hacer peticiones HTTP desde el navegador o desde Node.js. Es una alternativa más potente al `fetch` nativo porque:
- Transforma automáticamente las respuestas a JSON
- Maneja mejor los errores HTTP
- Permite cancelar peticiones
- Tiene interceptores para modificar peticiones y respuestas

Ejemplo de uso:
```javascript
const response = await axios.get('http://localhost:3000/api/tasks');
console.log(response.data);
```

## Sentry
Sentry es una plataforma de monitorización de errores en producción. Se usa para:
- Capturar errores en tiempo real cuando ocurren en producción
- Ver el stack trace completo del error
- Saber cuántos usuarios han sido afectados
- Recibir alertas cuando algo falla

Es especialmente útil en backends porque permite detectar errores que los usuarios nunca reportan.

## Swagger
Swagger (también conocido como OpenAPI) es una herramienta para documentar APIs REST de forma automática. Genera una interfaz visual interactiva donde puedes:
- Ver todos los endpoints disponibles
- Ver los parámetros que acepta cada endpoint
- Probar los endpoints directamente desde el navegador
- Generar documentación en formato JSON o YAML

Es el estándar de la industria para documentar APIs y facilita mucho la comunicación entre el equipo de backend y frontend.