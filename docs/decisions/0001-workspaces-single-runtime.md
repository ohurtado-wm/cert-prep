# ADR 0001: Workspaces separados con un runtime web/API único

**Estado:** Aceptado
**Fecha:** 2026-11-02
**Responsable:** Responsable del proyecto

## Contexto

Cert Prep mantiene el frontend Vike/React, la API Hono, los contratos Zod, la persistencia PostgreSQL y los generadores de IA en un paquete raíz. `apps/web`, `apps/api` y `packages/contracts` ofrecen límites de propiedad más claros. La aplicación actual monta Vike y Hono en el mismo proceso, comparte el origen del navegador y despliega un solo contenedor de aplicación junto con PostgreSQL y el migrador.

## Criterios de decisión

- Separar responsabilidades de frontend, backend y contratos compartidos.
- Evitar cambios en URLs públicas, cookies, configuración de origen y topología de despliegue.
- Hacer que las pruebas e imports puedan validar los límites nuevos desde un único lockfile Bun.
- Mantener PostgreSQL y las migraciones bajo propiedad de la API.

## Opciones consideradas

### Mantener todo en el paquete raíz

- Ventajas: sin movimientos ni ajustes de configuración.
- Costos o riesgos: la propiedad del código sigue mezclada y el límite entre cliente y servidor es difícil de observar.

### Separar workspaces y conservar un solo proceso — elegida

- Ventajas: límites claros y contratos compartidos explícitos; conserva el origen único, el servidor y Compose actuales.
- Costos o riesgos: Vike depende del paquete API para componer Hono; el build y Docker deben resolver workspaces locales correctamente.

### Desplegar web y API como procesos separados

- Ventajas: despliegue y escalado independientes.
- Costos o riesgos: requiere proxy/base URL, cambios de configuración de origen y una topología operativa nueva.

## Decisión

Separar el código en `apps/web`, `apps/api` y `packages/contracts`, pero mantener un solo proceso Bun. La entrada Vike compone el Hono del workspace API y conserva `/api/*` en el mismo origen. El workspace API es dueño de PostgreSQL y de sus migraciones.

## Consecuencias

- La raíz pasa a coordinar Bun workspaces con `bun.lock` único.
- Web y API importan las validaciones públicas desde `packages/contracts`.
- Tests de integración se mantienen en la raíz y comprueban los límites del monorepo.
- Docker sigue publicando una sola app; la imagen debe incluir manifests y fuentes de los workspaces que usa el bundle.
- Un despliegue independiente de API requiere un ADR nuevo y una revisión de proxy, autenticación y CORS.

## Plan de validación

- Instalar workspaces con lockfile congelado.
- Ejecutar typecheck, suite de pruebas, build y validación de Compose.
- Confirmar que `/api/healthz` y las rutas web/API comparten origen y que las migraciones apuntan a `apps/api/drizzle/postgresql/`.

## Referencias

- [Plan de arquitectura fundacional](../plans/architecture-foundation-plan.md)
- [Arquitectura](../architecture.md)
- [AI-First Learning Lab](https://westmonroe-cloud.com/secure/apps/128/ai-first-training-program/)
