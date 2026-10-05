# Implementation Plan: Migrar Cert Prep de SQLite a PostgreSQL

**Status:** Implemented and validated; [PR #14](https://github.com/ohurtado-wm/cert-prep/pull/14) is open for review
**Last Updated:** 2026-10-05

## Source Materials

- [FEATURE_IMPLEMENTATION_PLAN.md](../../FEATURE_IMPLEMENTATION_PLAN.md) - registra PostgreSQL y Docker local como destino elegido para esta migración.
- [README.md](../../README.md) - documenta la configuración y persistencia actuales.
- [Drizzle: PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) - referencia de integración Drizzle con PostgreSQL y `node-postgres`.
- [Docker Official Image: PostgreSQL](https://hub.docker.com/_/postgres) - imagen, credenciales y persistencia en volumen.

## Status

- Completado: PR-08 está integrado en `main` (`e63502d`); define sesión pendiente sin vencimiento, sesión completada con retención de dos horas y un índice parcial de sesión activa por usuario.
- Implementado: driver, esquema, migración, coordinación persistente, Docker Compose, pruebas y documentación en `codex/postgresql-migration`; los cambios siguen locales y sin commit/PR.
- Validado localmente: `bun run typecheck`, `bun test` (53 pruebas; 368 aserciones), `bun run build`, configuración de Compose, migración PostgreSQL limpia y repetible, `/api/healthz` (200), nueve tablas y rol de aplicación sin superusuario.
- Validado: backup con `pg_dump` y restauración con `pg_restore` en una base descartable; se recuperó un registro de prueba y se eliminó después.
- Pendiente de operación antes de habilitar usuarios: definir destino y retención de backups fuera del host. No queda una validación técnica local pendiente.

## PR Status

| PR | Alcance | Estado | Dependencia | Gate de validación |
|---|---|---|---|---|
| `PR-08` | Reanudación de simulaciones pendientes y retención | Integrado en `main` (`e63502d`) | `PR-05` | Contrato final de sesiones aplicado antes de la migración |
| `PR-DB-01` | Cambiar persistencia runtime a PostgreSQL, ejecutar app + base con Docker y cerrar brechas de concurrencia entre procesos | Abierto para revisión: [PR #14](https://github.com/ohurtado-wm/cert-prep/pull/14) | `PR-08` integrado; host local con Docker Compose y volumen persistente | Suite PostgreSQL, despliegue, persistencia del volumen y backup/restore pasan |

## Goal

Usar PostgreSQL como único dialecto runtime de Cert Prep, tanto localmente como en producción Docker. La instalación inicia con una base nueva: no se importa ni se conserva el SQLite actual. Mantener aislamiento por identidad verificada y coordinar en PostgreSQL los límites que deben funcionar entre procesos.

## Scope and Constraints

- Incluye: las ocho tablas actuales más el lease persistente de generación, esquema Drizzle, conexión/pool, migraciones PostgreSQL, pruebas de persistencia, configuración y documentación de operación.
- Incluye: sustituir el bloqueo de generación por usuario y el contador de inicios fallidos que hoy viven en memoria por coordinación persistente con vencimiento en PostgreSQL.
- Incluye: `Dockerfile` y Compose para correr aplicación y PostgreSQL en local y en el host de producción.
- Fuera de alcance: proveedor concreto de nube, cambios de UI y rediseños de historial o reglas de negocio ajenos a la concurrencia necesaria para el corte.
- Restricción: conservar la historia SQLite solo como referencia heredada; generar y ejecutar migraciones PostgreSQL desde un directorio nuevo.
- Modelo de despliegue: instalación limpia en un host local con Docker Compose; el servicio PostgreSQL no publica el puerto al host ni a la red externa.
- Supuesto: PostgreSQL será el único dialecto runtime en desarrollo, pruebas y producción. SQLite y sus datos se descartan; no se mantendrá un segundo adaptador runtime.
- Supuesto: app y base corren como servicios Docker en el mismo Compose y se conectan por la red privada del proyecto.
- Datos iniciales: el catálogo se vuelve a poblar desde el código existente; las guías de IA se generan bajo demanda. Ningún usuario, sesión, historial, plan o caché SQLite se importa.

## Implementation Shape

- **Conexión:** `server/db/client.ts` crea un `pg` `Pool` a partir de `DATABASE_URL` y pasa el pool a Drizzle `node-postgres`; dentro de Compose la URL usa el DNS del servicio PostgreSQL, mientras que Bun local conecta al puerto de desarrollo publicado en `localhost`.
- **Esquema:** cambiar `sqlite-core` por `pg-core`; representar fechas como `timestamptz`/`Date`, datos estructurados como `jsonb`, y añadir índices para consultas por usuario, vencimiento y fecha de resultado.
- **Migraciones:** generar un historial PostgreSQL nuevo en `drizzle/postgresql/`. Compose ejecuta un servicio de migración de una sola vez después del healthcheck de PostgreSQL y antes de iniciar la app; el servidor web no compite por ejecutar migraciones.
- **Concurrencia:** adquirir atómicamente un lease por usuario antes de contar/iniciar generación; registrar éxitos y fallos de inicio en almacenamiento compartido; liberar el lease por token y recuperarlo por expiración si un proceso muere.
- **Contenedores:** fijar la imagen oficial `postgres:18.6-trixie`, usar el volumen nombrado en `/var/lib/postgresql` y `PGDATA=/var/lib/postgresql/18/docker`, healthcheck con `pg_isready`, reinicio automático, rol de aplicación sin privilegios de superusuario y secretos fuera del repositorio. No publicar `5432` en producción.
- **Corte:** no hay exportación ni importación. Levantar PostgreSQL vacío, aplicar migraciones, verificar el catálogo inicial, arrancar app y smoke checks. Tras el primer uso, la recuperación es desde backups de PostgreSQL, no desde SQLite.

## Hosting Options and Minimum

- **Elegido para este proyecto:** PostgreSQL autoadministrado en el host local Docker. No requiere contratar un servicio cloud; sí requiere que el host permanezca encendido y que alguien opere actualizaciones, volumen, backups y recuperación.
- **Alternativas administradas si cambia el despliegue:** [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/), [Azure Database for PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview) y [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/postgresql). La elección debe seguir la nube aprobada por la compañía y la ubicación de la aplicación.
- **Mínimo técnico local/desarrollo:** Docker Engine/Compose, un servicio PostgreSQL con versión fijada, `DATABASE_URL`, volumen persistente si se quiere conservar datos entre reinicios y servicio de migraciones.
- **Mínimo de producción en un host:** Docker Compose, servicios app + PostgreSQL en red privada, disco persistente con espacio monitoreado, credenciales fuera de Git, health/readiness checks y backups periódicos guardados fuera del volumen del contenedor con una restauración comprobada. Un único host no ofrece alta disponibilidad ni failover automático.
- **Dimensionamiento:** no fijar CPU/RAM en el plan sin tráfico esperado y límites del host; comenzar con el menor perfil aprobado disponible y ajustar con mediciones. El costo cloud solo aplica a las alternativas administradas y depende de región, cómputo, almacenamiento, backups y HA.

## Codebase Touchpoints

| Área / archivo | Cambio previsto | Validación |
|---|---|---|
| `server/db/schema.ts` | Nueve tablas PostgreSQL, JSONB, timestamps, índices y lease de generación por usuario | Esquema/migración en PostgreSQL vacío |
| `server/db/client.ts`, `+server.ts`, `server/db/migrate.ts` | Pool PostgreSQL, cierre de conexión y migración como comando separado del arranque | Arranque, readiness, apagado y migración repetible |
| `drizzle.config.ts`, `drizzle/postgresql/` | Configuración e historial PostgreSQL separados del historial SQLite | Crear y aplicar migraciones en una base descartable |
| `server/use-cases/simulation-service.ts`, `server/catalog/repository.ts` | Contar intentos fallidos de forma persistente y usar leases SQL para generación/actualización concurrente | Dos servicios/conexiones no duplican generación ni exceden límites por usuario |
| `Dockerfile`, `compose.yaml`, `.dockerignore` | Compose para PostgreSQL local y stack app + PostgreSQL de producción; red privada, volumen y healthcheck | Levantar limpio, verificar readiness y conservar PG al recrear contenedores |
| `tests/api.test.ts`, `tests/simulations.test.ts`, `tests/certification-guide.test.ts` | Sustituir `:memory:` SQLite por base PostgreSQL aislada; mantener fixtures y limpiar entre casos | Rutas, transacciones, leases, errores e aislamiento de identidad |
| `package.json`, `.env.example`, `README.md` | Driver/comandos/configuración `DATABASE_URL`, Compose, migración, backups y arranque limpio | Seguir desde cero las instrucciones documentadas |
| `FEATURE_IMPLEMENTATION_PLAN.md` | Resolver decisión SQLite/PostgreSQL y retirar la validación futura ambigua del dialecto | El plan activo refleja el stack y gate PostgreSQL elegidos |

## PR / Review Strategy

- `PR-DB-01`: un único PR para backend PostgreSQL, Docker Compose, coordinación compartida, pruebas y documentación. Gate: validación completa sobre una instalación limpia y ensayo de restauración de backup PostgreSQL. Anterior: `PR-08`, ya integrado en `main`; siguiente: ninguno.
- Stacking: un PR; evitar que cambios de `simulation_sessions` o su expiración se desarrollen en paralelo con la nueva migración base.
- Orden de revisión: contrato del esquema e invariantes de concurrencia; luego contenedores, instalación limpia y configuración operativa.
- El plan [Resume Pending Simulations](resumable-simulations-implementation-plan.md) ya está integrado en `main`. La migración PostgreSQL inicial debe reflejar su esquema final: sesión pendiente sin vencimiento, sesión completada con expiración, índice único parcial para una sesión pendiente por usuario y comparación optimista de estado.

## Parallel Execution Notes

- Camino crítico: fijar topología del host → cerrar esquema de sesiones → migración PostgreSQL → integración Compose → validación concurrente → ensayo de backup/restore.
- Puede avanzar en paralelo: preparar pruebas de base vacía y casos de persistencia mientras se revisa el esquema PostgreSQL; redactar instrucciones de Compose tras cerrar nombres de servicio y variables.
- Serialización: `server/db/schema.ts`, migración PostgreSQL y los tres tests de servicio comparten tipos/estado de base; no integrar sus cambios sin el contrato de fechas, JSON y leases acordado.
- Mantener el despliegue en una instancia hasta que las pruebas demuestren que dos procesos comparten correctamente leases, rate limits y persistencia.

## PR 1: PostgreSQL runtime en Docker

**PR ID:** `PR-DB-01`  
**Status:** Implementado y validado; [PR #14](https://github.com/ohurtado-wm/cert-prep/pull/14) abierto para revisión
**Objective:** Cambiar la fuente de verdad a PostgreSQL, desplegar app + base en Docker sobre un host y demostrar aislamiento y comportamiento entre procesos desde una base vacía.
**Depends On:** Host local de producción con Docker Compose y almacenamiento persistente disponible.
**Parallelism:** La matriz de pruebas de base vacía y el Dockerfile pueden prepararse en paralelo; driver, schema y migraciones deben acordarse antes de adaptar servicios y pruebas.

### Tasks

- [x] `DB1-T01` Añadir `pg` y Drizzle `node-postgres`; leer `DATABASE_URL`, limitar el pool al presupuesto de conexiones del host y cerrar el pool al apagar el servidor.
- [x] `DB1-T02` Convertir las ocho tablas existentes y agregar el lease de generación en `pg-core`; usar `timestamptz`/`Date`, `jsonb`, claves externas e índices para lecturas por propietario.
- [x] `DB1-T03` Crear migración PostgreSQL inicial en carpeta separada; mover `db:migrate` a un paso explícito de release y retirar la migración automática por proceso al iniciar la API.
- [x] `DB1-T04` Cambiar el control de generación por usuario a un lease con token y vencimiento en PostgreSQL; guardar inicios fallidos junto a los exitosos para que el límite por hora sobreviva cambios de proceso. Mantener atómicos el conteo, la creación de sesión y el registro de inicio.
- [x] `DB1-T05` Añadir `Dockerfile` y Compose: servicio PG para desarrollo local y app + PG + migrador para producción; usar versión mayor fijada, healthcheck, volumen persistente, red privada, rol DB de mínimo privilegio y secretos; no exponer el puerto PostgreSQL en producción.
- [x] `DB1-T06` Mover pruebas de API, simulaciones y guías a una base PostgreSQL aislada; cubrir transacciones, dos conexiones/servicios, aislamiento entre usuarios, rate limit y leases concurrentes.
- [x] `DB1-T07` Actualizar `.env.example`, `README.md` y `FEATURE_IMPLEMENTATION_PLAN.md` con instalación limpia, Compose, migraciones, backups y restauración; declarar que SQLite y sus datos se descartan.
- [x] `DB1-T08` Ensayar arranque limpio: levantar PostgreSQL, aplicar migraciones, validar catálogo sembrado desde código, comprobar generación de guía bajo demanda, iniciar la app y recrear contenedores verificando persistencia en el volumen. Compose arrancó desde una base vacía; el endpoint sincronizó el catálogo, la suite comprobó la guía bajo demanda con un generador falso, el healthcheck respondió 200 y un registro persistió tras recrear PostgreSQL.
- [x] `DB1-T09` Documentar y probar `pg_dump`/restauración a una instancia descartable; indicar que rollback posterior al inicio de uso requiere restaurar datos PostgreSQL o corregir hacia adelante, nunca volver al SQLite vacío/obsoleto. `pg_dump`/`pg_restore` recuperaron un registro de prueba en una base PostgreSQL descartable.

### Validation Criteria

- [x] Base PostgreSQL vacía se crea desde las migraciones y una segunda ejecución no cambia el esquema ni duplica migraciones.
- [x] Las pruebas de rutas/casos de uso corren contra PostgreSQL y verifican identidad, historial, planes, sesiones, borrado, claves foráneas y persistencia dentro de las suites de integración (53 pruebas; 368 aserciones).
- [x] Dos instancias de `simulation-service` usando la misma base no generan preguntas dos veces para el mismo usuario; intentos fallidos y exitosos respetan juntos el límite horario.
- [x] Dos solicitudes sobre la misma respuesta mantienen la protección optimista existente; solicitudes concurrentes de guías comparten una lease y publican una sola actualización.
- [x] Base nueva no requiere `data/cert-prep.sqlite`; el catálogo de certificaciones se siembra desde código y la guía se crea bajo demanda.
- [x] `docker compose up` espera PostgreSQL sano y migraciones exitosas; la app responde desde el mismo host sin publicar el puerto DB (healthcheck HTTP 200; Compose sin puerto publicado para PostgreSQL).
- [x] Recrear el contenedor PostgreSQL conserva datos en el volumen.
- [x] Restaurar backup en una instancia PostgreSQL descartable recupera el estado esperado.
- [x] `bun run typecheck`, `bun test`, `bun run build`, `bun run db:migrate` y `git diff --check` pasan contra la configuración PostgreSQL; la migración se repitió correctamente.

### Risks / Open Questions

- Un único host Docker no ofrece failover ni sobrevive a la pérdida del host/disco; los backups externos y una prueba de restore son requisito para uso real.
- Antes de PR-DB-01, el bloqueo de generación y los fallos vivían en memoria (`generationInProgress`, `failedStartAttempts`); esta rama los reemplaza con leases y eventos persistidos para coordinar procesos.
- Las migraciones actuales y snapshots son SQLite; marcarlos como legado y no reescribirlos como si se hubieran aplicado en PostgreSQL.
- Una actualización de PostgreSQL requiere planear el cambio de imagen y verificar compatibilidad/restauración antes del despliegue; la imagen actual está fijada, no usa `latest`.
- El esquema de `simulation_sessions` en PostgreSQL refleja el lifecycle integrado por PR-08: sesión pendiente sin vencimiento, completadas con retención e índice parcial para una sesión pendiente por usuario.

## Cross-Cutting Validation

- [ ] Las rutas reales de la API usan PostgreSQL en tests y staging; no queda adaptador SQLite en el camino runtime.
- [ ] Un usuario no puede leer/modificar sesiones, historial ni planes ajenos antes ni después de reiniciar el proceso.
- [ ] La instalación limpia crea las tablas, reconstituye el catálogo desde código y conserva los datos escritos después del primer arranque al recrear contenedores.
- [ ] La aplicación arranca solo después de que PostgreSQL esté sano y las migraciones terminen; readiness falla claramente si no puede conectar.
- [ ] Existe backup PostgreSQL fuera del volumen y un procedimiento documentado de restore probado.

## Open Questions

- Definir destino de backups fuera del host/volumen y su retención antes de habilitar usuarios reales.
