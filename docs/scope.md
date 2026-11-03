# Alcance del producto

## Objetivos actuales

- Mostrar un catálogo de certificaciones y guías bilingües con fuentes oficiales.
- Generar simulaciones de 20 preguntas y ofrecer práctica guiada o modo real.
- Conservar sesiones pendientes, resultados agregados e historial por persona y certificación.
- Analizar temas débiles y generar planes de estudio usando métricas del historial y recursos oficiales.
- Mantener en servidor la identidad verificada y las claves de respuesta.

## Incluido

- Certificaciones Google Cloud y Azure presentes en `apps/api/src/catalog/certifications.ts`.
- UI Vike/React con idioma español/inglés, tema claro/oscuro y estado de carga/error.
- API Hono, validación Zod, PostgreSQL con Drizzle y autenticación mediante el gateway.
- Generación de guías, preguntas, análisis de temas débiles y planes con IA.
- Composición web/API en un proceso y mismo origen; Docker Compose local con PostgreSQL y migrador.

## Fuera del alcance vigente

- Administración de certificaciones mediante un panel; se conserva como propuesta separada en `docs/plans/certification-catalog-admin-form-proposal.md`.
- Gestión propia de contraseñas, sesiones de autenticación o credenciales del gateway.
- Migración automática o conservación de datos de la antigua base SQLite.
- Despliegue de web y API como procesos independientes.
- Cambios de permisos, protección de rama o publicación de PR desde este repositorio.

## Criterios para ampliar alcance

Antes de agregar una capacidad, definir el resultado observable, los límites, los contratos afectados, la fuente de datos y la forma de validación en un plan de `docs/plans/`. Documentar decisiones arquitectónicas en `docs/decisions/` y esperar aprobación del plan antes de cambiar código.
