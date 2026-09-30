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

- Inicia una sesión con las 20 preguntas, en el orden del banco.
- La opción **Simulación Real** usa **Siguiente pregunta** para registrar la respuesta elegida y avanzar en un solo paso. Permite un intento por pregunta y muestra la nota y los dominios por repasar al final, sin revelar aciertos ni respuestas durante la sesión.
- Una respuesta correcta al primer intento cuenta para el puntaje diagnóstico.
- Las respuestas correctas después de reintentar y las respuestas reveladas aparecen por separado en el resultado.
- El tema visual se puede cambiar entre claro y oscuro y la preferencia se conserva en este navegador.

## Alcance local

La API Hono comparte origen con la aplicación Vike. `GET /api/healthz` informa disponibilidad y `GET /api/v1/me` consulta al gateway `/users/me`, usando la identidad devuelta por el gateway. La aplicación reenvía las cabeceras de sesión `cookie` y `authorization`; no crea ni almacena credenciales.

Drizzle administra una base SQLite local en `./data/cert-prep.sqlite` (configurable con `DATABASE_PATH`). El esquema inicial deja preparadas guías, dominios/ruta, leases de actualización, sesiones efímeras, resultados por tema y planes de estudio. En esta fase la UI todavía usa el JSON existente y aún no escribe resultados en la base.

El endpoint de identidad expone `id`, correo y avatar recibidos del gateway, pero en SQLite persiste únicamente el ID estable del usuario. No registra permisos. El banco JSON del PoC todavía se entrega al navegador e incluye respuestas correctas; la sesión segura del producto queda para una fase posterior.

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo; fuerza Bun para que el driver SQLite esté disponible en los handlers de Vike
- `bun run build`: genera los bundles de cliente y servidor Vike
- `bun run preview`: sirve la compilación desde el servidor Bun de producción (ejecuta `bun run build` primero)
- `bun run typecheck`: verificación de tipos TypeScript
- `bun test`: pruebas unitarias y de rutas
- `bun run db:generate`: genera una migración Drizzle desde el esquema
- `bun run db:migrate`: aplica las migraciones SQLite pendientes
