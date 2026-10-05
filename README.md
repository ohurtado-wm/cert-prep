# Cert Prep

Simulador bilingüe para certificaciones cloud. La aplicación usa una API privada para generar preguntas con IA y conservar el historial autenticado por usuario.

## Requisitos

- Bun 1.3 o posterior

## Ejecutar localmente

```bash
bun install
cp .env.example .env
```

Replace the database password placeholders with unique local values. Use the same application password in `DATABASE_URL` and `POSTGRES_APP_PASSWORD`; use the admin password in `POSTGRES_PASSWORD` and `TEST_DATABASE_URL`.

Start PostgreSQL for local Bun development, apply migrations, then run the app:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d db
bun run db:migrate
bun run dev
```

Abre `http://localhost:3000`. En desarrollo local se usa el usuario simulado `ohurtado` (`ohurtado@westmonroe.com`), sin depender del gateway. En otros entornos se requiere una sesión válida de West Monroe.

## Recorrido

- El catálogo y la guía oficial de dominios/ruta se cargan desde la API. La pantalla principal muestra la certificación, sus temas, fuentes y estado de actualización.
- El selector del encabezado permite usar español o inglés. La preferencia `cert-helper-locale` se guarda por separado de `cert-helper-theme`.
- Cada simulación solicita al servidor 20 preguntas nuevas en el idioma elegido; el navegador recibe opciones sin claves de respuesta.
- En **Simulación Real**, **Siguiente pregunta** registra la selección y avanza en un clic. El resultado y el desglose por dominio, tema y foco aparecen al finalizar.
- Al finalizar cualquier modo, **Imprimir preguntas** abre una hoja compacta con las 20 preguntas y solo la respuesta correcta. La hoja se entrega únicamente en la respuesta de finalización y no se guarda en el historial.
- En práctica puedes reintentar o revelar la respuesta y su explicación. El resultado diferencia aciertos iniciales, aciertos tras reintento y respuestas reveladas.
- Los últimos 20 resultados se guardan en PostgreSQL bajo el usuario simulado en desarrollo o la identidad verificada por el gateway en otros entornos. El historial se vuelve a cargar tras una recarga y se puede borrar junto con los planes de estudio.
- **Sugerir plan de estudio** analiza los 10 resultados más recientes de la certificación seleccionada. El servidor calcula las prioridades y métricas por tema/dominio; la IA redacta acciones y elige entre los pasos de la ruta oficial. El último plan aparece al volver a la aplicación y cada regeneración se guarda en PostgreSQL.
- El tema visual se puede cambiar entre claro y oscuro; el idioma y el tema se conservan de forma independiente en este navegador.
- `localStorage` se usa únicamente para las preferencias de idioma y tema; sesiones, resultados e historial se guardan en el backend.

## Alcance local

La API Hono comparte origen con la aplicación Vike. `GET /api/healthz` informa disponibilidad. `GET /api/v1/me` usa el usuario simulado cuando `NODE_ENV=development`; en otros entornos consulta al gateway `/users/me` y reenvía las cabeceras de sesión `cookie` y `authorization`. La aplicación no crea ni almacena credenciales.

Drizzle administra PostgreSQL usando `DATABASE_URL` y un pool limitado por `DATABASE_POOL_MAX` (10 por defecto). El esquema incluye guías, sesiones, resultados, planes y registros compartidos para coordinar leases y límites de inicio entre procesos. La instalación PostgreSQL empieza vacía: no se importan ni se conservan los datos del archivo SQLite anterior. Las migraciones PostgreSQL viven en `drizzle/postgresql/`; el historial SQLite de `drizzle/` se conserva solo como referencia y no forma parte del runtime.

La API expone `GET /api/v1/certifications` y `GET /api/v1/certifications/:certificationId/guide`. La guía se genera con IA la primera vez y se renueva cuando tiene 30 días o más. La primera solicitud vencida adquiere una lease por certificación; las solicitudes concurrentes esperan y reutilizan el resultado. La guía se guarda en PostgreSQL y se comparte entre usuarios. El prompt indica usar como referencia principal la guía oficial vigente de Google Cloud, sin incluir una URL ni hacer una búsqueda web. OpenAI no abre la guía con esta instrucción: la fecha mostrada indica cuándo el modelo generó la guía, no cuándo Google verificó su contenido; dominios y pesos pueden no reflejar el documento vigente. Cada renovación mensual genera una llamada facturable a OpenAI. La primera preparación puede tardar hasta 60 segundos y la UI muestra un indicador animado y el tiempo transcurrido. Configura `AI_PROVIDER=openai`, `AI_MODEL` y `OPENAI_API_KEY` en `.env`; sin esos valores, la API devuelve un error recuperable y conserva la última guía válida. El modelo predeterminado es `gpt-6-luna` y se puede cambiar mediante `AI_MODEL`.

Con `bun run dev`, la consola del servidor muestra eventos JSON con ruta, estado HTTP, duración y etapa de actualización de la guía. La consola del navegador registra errores de API con su código y estado. Los logs omiten credenciales, prompts y respuestas del modelo.

El backend genera sesiones de 20 preguntas en inglés o español con cobertura proporcional a los pesos de la guía. Los endpoints autenticados incluyen `GET /api/v1/me`, `POST /api/v1/simulations`, `GET /api/v1/simulations/active`, `GET` y `DELETE /api/v1/simulations/:sessionId`, las rutas `POST` de respuestas, revelado y avance, y `GET`/`DELETE` de `/api/v1/simulation-history`, `GET /api/v1/study-plans/latest?certificationId=...` y `POST /api/v1/study-plans`. Salir de una simulación conserva su progreso en el servidor; desde el inicio, el propietario puede continuarla o descartarla. Cada usuario conserva una sola simulación pendiente sin vencimiento. Iniciar otra simulación normal o enfocada la reemplaza solo después de generar y validar correctamente las preguntas, y el inicio requiere confirmar la pérdida del progreso anterior. Reanudar no vuelve a generar preguntas ni consume el límite de tres inicios por hora. Las sesiones completadas siguen disponibles por un periodo breve de dos horas; sus preguntas y claves se eliminan al completar y se guarda de forma transaccional un resumen agregado. El historial conserva los 20 resultados más recientes y al borrarlo elimina también los resultados de sesión completados y los planes.

Para el plan de estudio, el servidor lee solo las 10 sesiones más recientes de esa certificación y del usuario autenticado. Calcula los agregados por IDs de tema/dominio y ordena por menor exactitud, más errores y mayor cantidad de respuestas como desempates. A la IA envía esos agregados, focos fallidos y nombres/IDs de los pasos oficiales; nunca preguntas, opciones, IDs de sesión ni datos de identidad. El servidor conserva las métricas calculadas y resuelve cada recurso contra la ruta oficial, rechaza estadísticas o conclusiones de aprobación en el texto generado y guarda cada plan bajo el `gatewayUserId`. Cada solicitud de generación/regeneración usa OpenAI y tiene su costo normal; la UI muestra los tokens reportados. Si no hay historial o no hay errores por repasar, no se llama al modelo.

La generación usa Vercel AI SDK con el adaptador `@ai-sdk/openai`, salida estructurada con Zod y una reparación máxima cuando el resultado no cumple el contrato. Cada simulación genera 20 preguntas nuevas a partir de los dominios, pesos y temas de la guía almacenada; esa llamada a OpenAI tiene su costo normal. La instrumentación registra únicamente modelo, certificación, latencia, tokens y estado; no incluye claves, prompts ni respuestas. Las pruebas usan un generador falso y no consumen llamadas ni créditos de OpenAI.

En **Practicar temas débiles**, el backend analiza hasta las 10 simulaciones completadas más recientes del usuario y certificación seleccionados. Considera superado un tema desde 80% de acierto al primer intento; prioriza los demás por cantidad de errores, menor exactitud y recencia. Antes de iniciar, la UI muestra los temas elegidos y sus métricas. La generación sigue creando 20 preguntas, todas limitadas a esos temas; cada tema seleccionado recibe al menos una pregunta y el resto se distribuye en orden de prioridad. Si falta historial o no hay temas débiles, la app lo explica y mantiene disponible la simulación normal. El análisis usa `GET /api/v1/simulations/weak-topics?certificationId=...`; `POST /api/v1/simulations/weak-topics` revalida el historial en el servidor antes de generar y guardar una sesión normal. La generación de preguntas tiene el costo habitual de OpenAI.

`/api/v1/me` expone ID, correo y avatar: en desarrollo usa `ohurtado`, y en otros entornos usa los datos del gateway. En PostgreSQL persiste únicamente el ID estable y no registra permisos. Los antiguos bancos JSON se conservan como fixtures de pruebas fuera de los assets públicos y no se descargan al navegador.

## Docker de producción local

El stack de producción corre la app, un migrador de una sola ejecución y PostgreSQL en el mismo Docker Compose. PostgreSQL usa un volumen persistente, no publica el puerto `5432` y crea un rol de aplicación sin privilegios de superusuario. La app queda ligada a `127.0.0.1:3000` por defecto.

```bash
cp .env.example .env
# Reemplaza los secretos de ejemplo y configura OPENAI_API_KEY.
docker compose up -d --build
```

Para apagar los servicios sin borrar la base:

```bash
docker compose down
```

`docker compose down -v` elimina el volumen y borra permanentemente la base; úsalo solo para reiniciar deliberadamente la instalación vacía.

Guarda los backups fuera del host y del volumen. Ejemplo de backup en formato comprimido:

```bash
mkdir -p /var/backups/cert-prep
docker compose exec -T db sh -c 'PGPASSWORD="$POSTGRES_APP_PASSWORD" pg_dump -U "$POSTGRES_APP_USER" -Fc "$POSTGRES_DB"' > /var/backups/cert-prep/cert-prep.dump
```

Prueba una restauración en una base descartable del mismo servidor:

```bash
docker compose exec -T db sh -c 'createdb -U "$POSTGRES_USER" cert_prep_restore'
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d postgres -c "GRANT CONNECT ON DATABASE cert_prep_restore TO \"$POSTGRES_APP_USER\""'
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d cert_prep_restore -c "GRANT USAGE, CREATE ON SCHEMA public TO \"$POSTGRES_APP_USER\""'
docker compose exec -T db sh -c 'PGPASSWORD="$POSTGRES_APP_PASSWORD" pg_restore -U "$POSTGRES_APP_USER" -d cert_prep_restore --no-owner' < /var/backups/cert-prep/cert-prep.dump
# Verifica el estado restaurado y luego elimina la base descartable.
docker compose exec -T db sh -c 'PGPASSWORD="$POSTGRES_APP_PASSWORD" psql -U "$POSTGRES_APP_USER" -d cert_prep_restore -c "\\dt"'
docker compose exec -T db sh -c 'dropdb -U "$POSTGRES_USER" cert_prep_restore'
```

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo conectado al PostgreSQL iniciado con Compose
- `bun run build`: genera los bundles de cliente y servidor Vike
- `bun run preview`: sirve la compilación desde el servidor Bun de producción (ejecuta `bun run build` primero)
- `bun run typecheck`: verificación de tipos TypeScript
- `bun test`: pruebas unitarias, de rutas e integración PostgreSQL; requiere `TEST_DATABASE_URL` con permisos para crear y borrar bases de datos desechables
- `bun run db:generate`: genera una migración Drizzle PostgreSQL en `drizzle/postgresql/`
- `bun run db:migrate`: aplica migraciones PostgreSQL pendientes; debe ejecutarse antes de iniciar la app
