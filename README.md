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

Abre `http://localhost:3000` en el navegador desde una sesión autenticada en el gateway de West Monroe. Sin una identidad válida, la aplicación mantiene deshabilitado el inicio de simulaciones.

## Recorrido

- El catálogo y la guía oficial de dominios/ruta se cargan desde la API. La pantalla principal muestra la certificación, sus temas, fuentes y estado de actualización.
- El selector del encabezado permite usar español o inglés. La preferencia `cert-helper-locale` se guarda por separado de `cert-helper-theme`.
- Cada simulación solicita al servidor 20 preguntas nuevas en el idioma elegido; el navegador recibe opciones sin claves de respuesta.
- En **Simulación Real**, **Siguiente pregunta** registra la selección y avanza en un clic. El resultado y el desglose por dominio, tema y foco aparecen al finalizar.
- En práctica puedes reintentar o revelar la respuesta y su explicación. El resultado diferencia aciertos iniciales, aciertos tras reintento y respuestas reveladas.
- Los últimos 20 resultados se guardan en SQLite bajo la identidad verificada por el gateway. El historial se vuelve a cargar tras una recarga y se puede borrar junto con los planes de estudio.
- El tema visual se puede cambiar entre claro y oscuro; el idioma y el tema se conservan de forma independiente en este navegador.
- `localStorage` se usa únicamente para las preferencias de idioma y tema; sesiones, resultados e historial se guardan en el backend.

## Alcance local

La API Hono comparte origen con la aplicación Vike. `GET /api/healthz` informa disponibilidad y `GET /api/v1/me` consulta al gateway `/users/me`, usando la identidad devuelta por el gateway. La aplicación reenvía las cabeceras de sesión `cookie` y `authorization`; no crea ni almacena credenciales.

Drizzle administra una base SQLite local en `./data/cert-prep.sqlite` (configurable con `DATABASE_PATH`). El esquema incluye guías, dominios/ruta, leases de actualización, sesiones efímeras, resultados agregados por usuario, planes y registros operativos de inicios para mantener el límite horario aunque se borre el historial.

La API expone `GET /api/v1/certifications` y `GET /api/v1/certifications/:certificationId/guide`. Al solicitar una guía cuya renovación con IA tiene 7 días o más, vuelve a consultar las fuentes oficiales y las procesa con el Vercel AI SDK. Configura `AI_PROVIDER=openai`, `AI_MODEL` y `OPENAI_API_KEY` en `.env`; sin esos valores, la API devuelve un error recuperable y conserva la última guía válida. El modelo predeterminado es `gpt-6-luna` y se puede cambiar mediante `AI_MODEL`. La UI muestra el error y no permite iniciar una sesión con una guía que no pudo verificarse.

El backend genera sesiones de 20 preguntas en inglés o español con cobertura proporcional a los pesos de la guía. Los endpoints autenticados incluyen `GET /api/v1/me`, `POST /api/v1/simulations`, `GET` y `DELETE /api/v1/simulations/:sessionId`, las rutas `POST` de respuestas, revelado y avance, y `GET`/`DELETE /api/v1/simulation-history`. En Simulación Real cada respuesta registra la selección y avanza en un solo paso; la API no expone la opción correcta ni la explicación durante la sesión. En práctica ofrece reintento, explicación y revelado de respuesta. Las sesiones vencen en dos horas, cada usuario puede tener hasta dos activas e iniciar hasta tres por hora. Al completar una sesión, el backend elimina preguntas y claves y persiste de forma transaccional un resumen agregado. Retiene los 20 más recientes y al borrar historial elimina también resultados de sesión completados y planes.

La generación usa Vercel AI SDK con el adaptador `@ai-sdk/openai`, salida estructurada con Zod y una reparación máxima cuando el resultado no cumple el contrato. La instrumentación registra únicamente modelo, certificación, latencia, tokens y estado; no incluye claves, prompts ni respuestas. Las pruebas usan un generador falso y no consumen llamadas ni créditos de OpenAI.

El endpoint de identidad expone `id`, correo y avatar recibidos del gateway, pero en SQLite persiste únicamente el ID estable del usuario. No registra permisos. Los antiguos bancos JSON se conservan como fixtures de pruebas fuera de los assets públicos y no se descargan al navegador.

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo; fuerza Bun para que el driver SQLite esté disponible en los handlers de Vike
- `bun run build`: genera los bundles de cliente y servidor Vike
- `bun run preview`: sirve la compilación desde el servidor Bun de producción (ejecuta `bun run build` primero)
- `bun run typecheck`: verificación de tipos TypeScript
- `bun test`: pruebas unitarias y de rutas
- `bun run db:generate`: genera una migración Drizzle desde el esquema
- `bun run db:migrate`: aplica las migraciones SQLite pendientes
