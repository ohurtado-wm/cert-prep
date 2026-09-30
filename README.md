# Cert Prep

Simulador para preparar certificaciones cloud. El PoC actual practica Google Cloud Professional Cloud Developer; la base de producto añade una API y persistencia local.

## Requisitos

- Bun 1.3 o posterior

## Ejecutar localmente

```bash
bun install
cp .env.example .env
bun run db:migrate
bun run dev
```

Abre `http://localhost:3000` en el navegador. El banco se carga desde `public/data/certifications.json`; para agregar o editar preguntas, conserva la estructura y una respuesta correcta por pregunta.

## Recorrido

- El catálogo y la guía oficial de dominios/ruta se cargan desde la API. La pantalla principal muestra la certificación, temas, fuentes y estado de actualización de la guía.
- El selector del encabezado permite usar español o inglés. La preferencia `cert-helper-locale` se guarda por separado de `cert-helper-theme`.
- El banco de práctica conserva 20 preguntas en JSON: español en `public/data/certifications.json` e inglés en `public/data/certifications.en.json`. Ambos idiomas usan los mismos IDs y respuestas correctas.
- Inicia una sesión con las preguntas locales, en el orden del banco.
- La opción **Simulación Real** usa **Siguiente pregunta** para registrar la respuesta elegida y avanzar en un solo paso. Permite un intento por pregunta y muestra la nota y los dominios por repasar al final, sin revelar aciertos ni respuestas durante la sesión.
- Una respuesta correcta al primer intento cuenta para el puntaje diagnóstico.
- Las respuestas correctas después de reintentar y las respuestas reveladas aparecen por separado en el resultado.
- El tema visual se puede cambiar entre claro y oscuro; el idioma y el tema se conservan de forma independiente en este navegador.
- Los resultados solo viven en la sesión actual de la página. Su persistencia por usuario se implementará en una fase posterior.

## Alcance local

La API Hono comparte origen con la aplicación Vike. `GET /api/healthz` informa disponibilidad y `GET /api/v1/me` consulta al gateway `/users/me`, usando la identidad devuelta por el gateway. La aplicación reenvía las cabeceras de sesión `cookie` y `authorization`; no crea ni almacena credenciales.

Drizzle administra una base SQLite local en `./data/cert-prep.sqlite` (configurable con `DATABASE_PATH`). El esquema inicial deja preparadas guías, dominios/ruta, leases de actualización, sesiones efímeras, resultados por tema y planes de estudio. Las preguntas de la sesión todavía se cargan desde JSON; los resultados y planes aún no se escriben en la base.

La API expone `GET /api/v1/certifications` y `GET /api/v1/certifications/:certificationId/guide`. Al solicitar una guía cuya renovación con IA tiene 7 días o más, vuelve a consultar las fuentes oficiales y las procesa con el Vercel AI SDK. Para activar esa llamada configura `AI_MODEL` y `AI_GATEWAY_API_KEY`; sin un modelo configurado la API devuelve un error recuperable y conserva la última guía válida. La UI muestra el error y no permite iniciar una sesión con una guía que no pudo verificarse. Las preguntas todavía proceden del banco JSON local; la generación de preguntas con IA pertenece a una fase posterior.

El endpoint de identidad expone `id`, correo y avatar recibidos del gateway, pero en SQLite persiste únicamente el ID estable del usuario. No registra permisos. El banco JSON del PoC todavía se entrega al navegador e incluye respuestas correctas; la sesión segura del producto queda para una fase posterior.

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo; fuerza Bun para que el driver SQLite esté disponible en los handlers de Vike
- `bun run build`: genera los bundles de cliente y servidor Vike
- `bun run preview`: sirve la compilación desde el servidor Bun de producción (ejecuta `bun run build` primero)
- `bun run typecheck`: verificación de tipos TypeScript
- `bun test`: pruebas unitarias y de rutas
- `bun run db:generate`: genera una migración Drizzle desde el esquema
- `bun run db:migrate`: aplica las migraciones SQLite pendientes
