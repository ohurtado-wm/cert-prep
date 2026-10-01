# Cert Prep

Simulador bilingüe para certificaciones cloud. La aplicación usa una API privada para generar preguntas con IA y conservar el historial autenticado por usuario.

## Requisitos

- Bun 1.3 o posterior

## Ejecutar localmente

```bash
bun install
cp .env.example .env
bun run db:migrate
bun run dev
```

Abre `http://localhost:3000`. En desarrollo local se usa el usuario simulado `ohurtado` (`ohurtado@westmonroe.com`), sin depender del gateway. En otros entornos se requiere una sesión válida de West Monroe.

## Recorrido

- El catálogo y la guía oficial de dominios/ruta se cargan desde la API. La pantalla principal muestra la certificación, sus temas, fuentes y estado de actualización.
- El selector del encabezado permite usar español o inglés. La preferencia `cert-helper-locale` se guarda por separado de `cert-helper-theme`.
- Cada simulación solicita al servidor 20 preguntas nuevas en el idioma elegido; el navegador recibe opciones sin claves de respuesta.
- En **Simulación Real**, **Siguiente pregunta** registra la selección y avanza en un clic. El resultado y el desglose por dominio, tema y foco aparecen al finalizar.
- En práctica puedes reintentar o revelar la respuesta y su explicación. El resultado diferencia aciertos iniciales, aciertos tras reintento y respuestas reveladas.
- Los últimos 20 resultados se guardan en SQLite bajo el usuario simulado en desarrollo o la identidad verificada por el gateway en otros entornos. El historial se vuelve a cargar tras una recarga y se puede borrar junto con los planes de estudio.
- **Sugerir plan de estudio** analiza los 10 resultados más recientes de la certificación seleccionada. El servidor calcula las prioridades y métricas por tema/dominio; la IA redacta acciones y elige entre los pasos de la ruta oficial. El último plan aparece al volver a la aplicación y cada regeneración se guarda en SQLite.
- El tema visual se puede cambiar entre claro y oscuro; el idioma y el tema se conservan de forma independiente en este navegador.
- `localStorage` se usa únicamente para las preferencias de idioma y tema; sesiones, resultados e historial se guardan en el backend.

## Alcance local

La API Hono comparte origen con la aplicación Vike. `GET /api/healthz` informa disponibilidad. `GET /api/v1/me` usa el usuario simulado cuando `NODE_ENV=development`; en otros entornos consulta al gateway `/users/me` y reenvía las cabeceras de sesión `cookie` y `authorization`. La aplicación no crea ni almacena credenciales.

Drizzle administra una base SQLite local en `./data/cert-prep.sqlite` (configurable con `DATABASE_PATH`). El esquema incluye guías, dominios/ruta, leases de actualización, sesiones efímeras, resultados agregados por usuario, planes y registros operativos de inicios para mantener el límite horario aunque se borre el historial.

La API expone `GET /api/v1/certifications` y `GET /api/v1/certifications/:certificationId/guide`. La guía se genera con IA la primera vez y se renueva cuando tiene 30 días o más. La primera solicitud vencida adquiere una lease por certificación; las solicitudes concurrentes esperan y reutilizan el resultado. La guía se guarda en SQLite y se comparte entre usuarios. El prompt indica usar como referencia principal la guía oficial vigente de Google Cloud, sin incluir una URL ni hacer una búsqueda web. OpenAI no abre la guía con esta instrucción: la fecha mostrada indica cuándo el modelo generó la guía, no cuándo Google verificó su contenido; dominios y pesos pueden no reflejar el documento vigente. Cada renovación mensual genera una llamada facturable a OpenAI. La primera preparación puede tardar hasta 60 segundos y la UI muestra un indicador animado y el tiempo transcurrido. Configura `AI_PROVIDER=openai`, `AI_MODEL` y `OPENAI_API_KEY` en `.env`; sin esos valores, la API devuelve un error recuperable y conserva la última guía válida. El modelo predeterminado es `gpt-6-luna` y se puede cambiar mediante `AI_MODEL`.

Con `bun run dev`, la consola del servidor muestra eventos JSON con ruta, estado HTTP, duración y etapa de actualización de la guía. La consola del navegador registra errores de API con su código y estado. Los logs omiten credenciales, prompts y respuestas del modelo.

El backend genera sesiones de 20 preguntas en inglés o español con cobertura proporcional a los pesos de la guía. Los endpoints autenticados incluyen `GET /api/v1/me`, `POST /api/v1/simulations`, `GET` y `DELETE /api/v1/simulations/:sessionId`, las rutas `POST` de respuestas, revelado y avance, y `GET`/`DELETE /api/v1/simulation-history`, `GET /api/v1/study-plans/latest?certificationId=...` y `POST /api/v1/study-plans`. En Simulación Real cada respuesta registra la selección y avanza en un solo paso; la API no expone la opción correcta ni la explicación durante la sesión. En práctica ofrece reintento, explicación y revelado de respuesta. Las sesiones vencen en dos horas, cada usuario puede tener hasta dos activas e iniciar hasta tres por hora. Al completar una sesión, el backend elimina preguntas y claves y persiste de forma transaccional un resumen agregado. Retiene los 20 más recientes y al borrar historial elimina también resultados de sesión completados y planes.

Para el plan de estudio, el servidor lee solo las 10 sesiones más recientes de esa certificación y del usuario autenticado. Calcula los agregados por IDs de tema/dominio y ordena por menor exactitud, más errores y mayor cantidad de respuestas como desempates. A la IA envía esos agregados, focos fallidos y nombres/IDs de los pasos oficiales; nunca preguntas, opciones, IDs de sesión ni datos de identidad. El servidor conserva las métricas calculadas y resuelve cada recurso contra la ruta oficial, rechaza estadísticas o conclusiones de aprobación en el texto generado y guarda cada plan bajo el `gatewayUserId`. Cada solicitud de generación/regeneración usa OpenAI y tiene su costo normal; la UI muestra los tokens reportados. Si no hay historial o no hay errores por repasar, no se llama al modelo.

La generación usa Vercel AI SDK con el adaptador `@ai-sdk/openai`, salida estructurada con Zod y una reparación máxima cuando el resultado no cumple el contrato. Cada simulación genera 20 preguntas nuevas a partir de los dominios, pesos y temas de la guía almacenada; esa llamada a OpenAI tiene su costo normal. La instrumentación registra únicamente modelo, certificación, latencia, tokens y estado; no incluye claves, prompts ni respuestas. Las pruebas usan un generador falso y no consumen llamadas ni créditos de OpenAI.

En **Practicar temas débiles**, el backend analiza hasta las 10 simulaciones completadas más recientes del usuario y certificación seleccionados. Considera superado un tema desde 80% de acierto al primer intento; prioriza los demás por cantidad de errores, menor exactitud y recencia. Antes de iniciar, la UI muestra los temas elegidos y sus métricas. La generación sigue creando 20 preguntas, todas limitadas a esos temas; cada tema seleccionado recibe al menos una pregunta y el resto se distribuye en orden de prioridad. Si falta historial o no hay temas débiles, la app lo explica y mantiene disponible la simulación normal. El análisis usa `GET /api/v1/simulations/weak-topics?certificationId=...`; `POST /api/v1/simulations/weak-topics` revalida el historial en el servidor antes de generar y guardar una sesión normal. La generación de preguntas tiene el costo habitual de OpenAI.

`/api/v1/me` expone ID, correo y avatar: en desarrollo usa `ohurtado`, y en otros entornos usa los datos del gateway. En SQLite persiste únicamente el ID estable y no registra permisos. Los antiguos bancos JSON se conservan como fixtures de pruebas fuera de los assets públicos y no se descargan al navegador.

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo; fuerza Bun para que el driver SQLite esté disponible en los handlers de Vike
- `bun run build`: genera los bundles de cliente y servidor Vike
- `bun run preview`: sirve la compilación desde el servidor Bun de producción (ejecuta `bun run build` primero)
- `bun run typecheck`: verificación de tipos TypeScript
- `bun test`: pruebas unitarias y de rutas
- `bun run db:generate`: genera una migración Drizzle desde el esquema
- `bun run db:migrate`: aplica las migraciones SQLite pendientes
