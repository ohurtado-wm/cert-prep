# Cert Prep: instrucciones para agentes

## Propósito

Cert Prep es un simulador bilingüe para certificaciones cloud. La aplicación genera guías, preguntas y recomendaciones de estudio con IA; conserva resultados en PostgreSQL y autentica a las personas mediante el gateway de West Monroe fuera del entorno local.

## Mapa del repositorio

- `apps/web/`: Vike, React, páginas, componentes, estilos, preferencias y clientes HTTP.
- `apps/api/`: Hono, rutas, casos de uso, gateway, proveedores de IA, PostgreSQL, Drizzle y migraciones.
- `packages/contracts/`: contratos Zod públicos compartidos entre web, API y pruebas.
- `tests/`: pruebas unitarias, de rutas e integración que cruzan workspaces.
- `docs/product-context.md`, `docs/scope.md` y `docs/architecture.md`: contexto vigente del producto.
- `docs/decisions/`: decisiones técnicas registradas.
- `docs/plans/`: planes vigentes e historial de planes del producto.
- `.agents/skills/`: skills de equipo para Codex.

## Comandos desde la raíz

- `bun run dev`: servidor local Vike + Hono.
- `bun run build`: compilación de producción.
- `bun run preview`: sirve la compilación.
- `bun run typecheck`: verificación TypeScript estricta del repo.
- `bun test`: suite completa; las pruebas de integración requieren `TEST_DATABASE_URL` con permiso para crear bases temporales.
- `bun run db:generate`: genera migraciones PostgreSQL para la API.
- `bun run db:migrate`: aplica migraciones PostgreSQL pendientes.

Para desarrollo local, inicia PostgreSQL con `docker compose -f compose.yaml -f compose.dev.yaml up -d db`, aplica migraciones y ejecuta `bun run dev`. Consulta `README.md` para variables y configuración Docker.

## Límites de arquitectura y seguridad

- Mantén web y API como workspaces separados, pero conserva el proceso único Vike/Hono y las rutas `/api/*` del mismo origen.
- Coloca contratos públicos compartidos en `packages/contracts`; los clientes HTTP permanecen en `apps/web/src/api`.
- Coloca comportamiento de servidor en `apps/api/src`. Las migraciones activas PostgreSQL viven en `apps/api/drizzle/postgresql/`; el historial SQLite de `apps/api/drizzle/` es referencia y no es runtime.
- No expongas `OPENAI_API_KEY`, claves correctas de preguntas ni respuestas privadas en el navegador. No registres credenciales, prompts o respuestas del modelo.
- En producción, la identidad viene de `/users/me` del gateway. No agregues autenticación paralela ni guardes credenciales.
- Conserva el historial asociado al ID estable del gateway y las validaciones Zod en límites HTTP.

## Planificación y revisión humana

- Para cambios de arquitectura o funcionalidades, inspecciona el código, contratos, documentos y decisiones actuales; crea un plan en borrador en `docs/plans/` y espera aprobación antes de modificar código.
- Registra decisiones que afecten arquitectura, contratos, datos, seguridad, operación o dependencias en `docs/decisions/`. No marques una propuesta como aceptada sin aprobación explícita.
- Usa los skills pertinentes en `.agents/skills/`: `set-up-and-validate-monorepo`, `create-feature-plan`, `record-adr`, `pr-code-review`, `pr-triage` y `create-pr`.
- No publiques comentarios, abras PRs ni cambies configuración externa de GitHub salvo solicitud explícita.
- Reporta validaciones reales; no afirmes que un comando pasó si no se ejecutó.
