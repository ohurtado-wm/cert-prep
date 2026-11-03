# Contexto del producto

## Problema

Quienes preparan certificaciones cloud necesitan practicar con preguntas nuevas, entender qué dominios dominan y decidir qué estudiar después. Un banco estático y una sesión efímera no sirven para conservar progreso, comparar intentos ni adaptar el estudio a las brechas de cada persona.

## Personas usuarias

- Personas de West Monroe que preparan certificaciones de Google Cloud o Azure.
- En desarrollo local, el recorrido usa una identidad simulada para evitar depender del gateway.

## Necesidades

- Consultar dominios, temas, fuentes y una ruta de estudio basados en material oficial.
- Practicar en español o inglés y distinguir práctica guiada de simulación real.
- Continuar una sesión pendiente y consultar resultados recientes de forma autenticada.
- Recibir prioridades de estudio y sesiones enfocadas en temas débiles a partir del historial propio.

## Producto actual

Cert Prep es una aplicación web Vike/React con API Hono. Genera guías, preguntas y planes usando OpenAI a través del AI SDK; PostgreSQL conserva guías, sesiones, resultados agregados y planes. El gateway de West Monroe resuelve identidad fuera de desarrollo.

El catálogo incluye Professional Cloud Developer, Professional Cloud Architect, Professional Cloud Database Engineer, Professional Data Engineer, Professional Cloud DevOps Engineer y Azure AI Fundamentals (AI-901). El detalle operativo y las limitaciones del contenido generado están en [README.md](../README.md).

## Restricciones

- La aplicación no administra credenciales de usuario ni crea identidades paralelas.
- Las claves de respuesta no se envían al navegador antes de finalizar una simulación real.
- Las preferencias de idioma y tema son locales al navegador; historial y sesiones viven en el servidor.
- Las fuentes oficiales y los límites de cada flujo de IA se configuran en el backend.

## Fuentes de verdad

- El código y `README.md` describen el comportamiento desplegable actual.
- `docs/plans/FEATURE_IMPLEMENTATION_PLAN.md` conserva el plan maestro y su historial de estado.
- `PROJECT_PROPOSAL.md` documenta el PoC inicial aprobado; sus límites no describen el producto actual.
