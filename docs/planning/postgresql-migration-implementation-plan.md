# Implementation Plan: Migrar Cert Prep de SQLite a PostgreSQL

**Status:** Draft  
**Last Updated:** 2026-10-01

## Source Materials

- [FEATURE_IMPLEMENTATION_PLAN.md](../../FEATURE_IMPLEMENTATION_PLAN.md) - define SQLite para una instancia, PostgreSQL para varias y deja el destino de despliegue abierto.
- [README.md](../../README.md) - documenta la configuración y persistencia actuales.
- [Drizzle: PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql) - referencia de integración Drizzle con PostgreSQL y `node-postgres`.
- [Docker Official Image: PostgreSQL](https://hub.docker.com/_/postgres) - imagen, credenciales y persistencia en volumen.

## Status

- Completado: API, casos de uso y persistencia Drizzle funcionan sobre SQLite; las tablas separan historial y sesiones por usuario.
- En curso: nada para esta migración.
- Pendiente: PostgreSQL en desarrollo y producción Docker, base nueva vacía y validación de coordinación entre procesos.

## PR Status

| PR | Alcance | Estado | Dependencia | Gate de validación |
|---|---|---|---|---|
| `PR-DB-01` | Cambiar persistencia runtime a PostgreSQL, ejecutar app + base con Docker y cerrar brechas de concurrencia entre procesos | No iniciado | Host local con Docker Compose y volumen persistente | Suite de integración contra PostgreSQL y ensayo limpio de despliegue/reinicio |

## Goal

Usar PostgreSQL como único dialecto runtime de Cert Prep, tanto localmente como en producción Docker. La instalación inicia con una base nueva: no se importa ni se conserva el SQLite actual. Mantener aislamiento por identidad verificada y coordinar en PostgreSQL los límites que deben funcionar entre procesos.

## Scope and Constraints

- Incluye: ocho tablas actuales, esquema Drizzle, conexión/pool, migraciones PostgreSQL, pruebas de persistencia, configuración y documentación de operación.
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
- **Contenedores:** fijar una versión mayor estable de la imagen oficial `postgres` (no `latest`), usar volumen nombrado para `PGDATA`, healthcheck con `pg_isready`, reinicio automático, rol de aplicación sin privilegios de superusuario y secretos fuera del repositorio. No publicar `5432` en producción.
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
| `server/db/schema.ts` | Tablas PostgreSQL, JSONB, timestamps, índices y lease de generación por usuario | Esquema/migración en PostgreSQL vacío |
| `server/db/client.ts`, `+server.ts`, `server/db/migrate.ts` | Pool PostgreSQL, cierre de conexión y migración como comando separado del arranque | Arranque, readiness, apagado y migración repetible |
| `drizzle.config.ts`, `drizzle/postgresql/` | Configuración e historial PostgreSQL separados del historial SQLite | Crear y aplicar migraciones en una base descartable |
| `server/use-cases/simulation-service.ts`, `server/catalog/repository.ts` | Contar intentos fallidos de forma persistente y usar leases SQL para generación/actualización concurrente | Dos servicios/conexiones no duplican generación ni exceden límites por usuario |
| `Dockerfile`, `compose.yaml`, `.dockerignore` | Compose para PostgreSQL local y stack app + PostgreSQL de producción; red privada, volumen y healthcheck | Levantar limpio, verificar readiness y conservar PG al recrear contenedores |
| `tests/api.test.ts`, `tests/simulations.test.ts`, `tests/certification-guide.test.ts` | Sustituir `:memory:` SQLite por base PostgreSQL aislada; mantener fixtures y limpiar entre casos | Rutas, transacciones, leases, errores e aislamiento de identidad |
| `package.json`, `.env.example`, `README.md` | Driver/comandos/configuración `DATABASE_URL`, Compose, migración, backups y arranque limpio | Seguir desde cero las instrucciones documentadas |
| `FEATURE_IMPLEMENTATION_PLAN.md` | Resolver decisión SQLite/PostgreSQL y retirar la validación futura ambigua del dialecto | El plan activo refleja el stack y gate PostgreSQL elegidos |

## PR / Review Strategy

- `PR-DB-01`: un único PR para backend PostgreSQL, Docker Compose, coordinación compartida, pruebas y documentación. Gate: validación completa sobre una instalación limpia y ensayo de restauración de backup PostgreSQL. Anterior: `PR-08` (cierra primero el lifecycle y la retención de sesiones); siguiente: ninguno.
- Stacking: un PR; evitar que cambios de `simulation_sessions` o su expiración se desarrollen en paralelo con la nueva migración base.
- Orden de revisión: contrato del esquema e invariantes de concurrencia; luego contenedores, instalación limpia y configuración operativa.
- El plan [Resume Pending Simulations](resumable-simulations-implementation-plan.md) modifica `simulation_sessions` y se ejecuta antes de `PR-DB-01`. Incorporar su esquema final de lifecycle, índice de sesión pendiente y vencimiento nullable en la migración PostgreSQL inicial; no desarrollar ambos cambios de esquema en paralelo.

## Parallel Execution Notes

- Camino crítico: fijar topología del host → cerrar esquema de sesiones → migración PostgreSQL → integración Compose → validación concurrente → ensayo de backup/restore.
- Puede avanzar en paralelo: preparar pruebas de base vacía y casos de persistencia mientras se revisa el esquema PostgreSQL; redactar instrucciones de Compose tras cerrar nombres de servicio y variables.
- Serialización: `server/db/schema.ts`, migración PostgreSQL y los tres tests de servicio comparten tipos/estado de base; no integrar sus cambios sin el contrato de fechas, JSON y leases acordado.
- Mantener el despliegue en una instancia hasta que las pruebas demuestren que dos procesos comparten correctamente leases, rate limits y persistencia.

## PR 1: PostgreSQL runtime en Docker

**PR ID:** `PR-DB-01`  
**Status:** No iniciado  
**Objective:** Cambiar la fuente de verdad a PostgreSQL, desplegar app + base en Docker sobre un host y demostrar aislamiento y comportamiento entre procesos desde una base vacía.  
**Depends On:** Host local de producción con Docker Compose y almacenamiento persistente disponible.  
**Parallelism:** La matriz de pruebas de base vacía y el Dockerfile pueden prepararse en paralelo; driver, schema y migraciones deben acordarse antes de adaptar servicios y pruebas.

### Tasks

- [ ] `DB1-T01` Añadir `pg` y Drizzle `node-postgres`; leer `DATABASE_URL`, limitar el pool al presupuesto de conexiones del host y cerrar el pool al apagar el servidor.
- [ ] `DB1-T02` Convertir las ocho tablas a `pg-core`; migrar timestamps epoch-ms a `timestamptz`/`Date`, columnas JSON a `jsonb`, conservar claves externas e índices para lecturas por propietario.
- [ ] `DB1-T03` Crear migración PostgreSQL inicial en carpeta separada; mover `db:migrate` a un paso explícito de release y retirar la migración automática por proceso al iniciar la API.
- [ ] `DB1-T04` Cambiar el control de generación por usuario a un lease con token y vencimiento en PostgreSQL; guardar inicios fallidos junto a los exitosos para que el límite por hora sobreviva cambios de proceso. Mantener atómicos el conteo, la creación de sesión y el registro de inicio.
- [ ] `DB1-T05` Añadir `Dockerfile` y Compose: servicio PG para desarrollo local y app + PG + migrador para producción; usar versión mayor fijada, healthcheck, volumen persistente, red privada, rol DB de mínimo privilegio y secretos; no exponer el puerto PostgreSQL en producción.
- [ ] `DB1-T06` Mover pruebas de API, simulaciones y guías a una base PostgreSQL aislada; cubrir transacciones, dos conexiones/servicios, aislamiento entre usuarios, rate limit y leases concurrentes.
- [ ] `DB1-T07` Actualizar `.env.example`, `README.md` y `FEATURE_IMPLEMENTATION_PLAN.md` con instalación limpia, Compose, migraciones, backups y restauración; declarar que SQLite y sus datos se descartan.
- [ ] `DB1-T08` Ensayar arranque limpio: levantar PostgreSQL, aplicar migraciones, validar catálogo sembrado desde código, comprobar generación de guía bajo demanda, iniciar la app y recrear contenedores verificando persistencia en el volumen.
- [ ] `DB1-T09` Documentar y probar `pg_dump`/restauración a una instancia descartable; indicar que rollback posterior al inicio de uso requiere restaurar datos PostgreSQL o corregir hacia adelante, nunca volver al SQLite vacío/obsoleto.

### Validation Criteria

- [ ] Base PostgreSQL vacía se crea desde las migraciones y una segunda ejecución no cambia el esquema ni duplica migraciones.
- [ ] Las pruebas de rutas/casos de uso corren contra PostgreSQL y verifican identidad, historial, planes, sesiones, borrado, claves foráneas y persistencia después de reiniciar el proceso.
- [ ] Dos instancias de `simulation-service` usando la misma base no generan preguntas dos veces para el mismo usuario; intentos fallidos y exitosos respetan juntos el límite horario.
- [ ] Dos solicitudes sobre la misma respuesta mantienen la protección optimista existente; solicitudes concurrentes de guías comparten una lease y publican una sola actualización.
- [ ] Base nueva no requiere `data/cert-prep.sqlite`; el catálogo de certificaciones se siembra desde código y la guía se crea bajo demanda.
- [ ] `docker compose up` espera PostgreSQL sano y migraciones exitosas; la app responde desde el mismo host sin publicar el puerto DB.
- [ ] Recrear el contenedor PostgreSQL conserva datos en el volumen; restaurar backup en una instancia descartable recupera el estado esperado.
- [ ] `bun run typecheck`, `bun test`, `bun run build`, `bun run db:migrate` y chequeos de formato/documentación pasan contra la configuración final.

### Risks / Open Questions

- Un único host Docker no ofrece failover ni sobrevive a la pérdida del host/disco; los backups externos y una prueba de restore son requisito para uso real.
- El bloqueo de generación y los fallos hoy viven en memoria (`generationInProgress`, `failedStartAttempts`). PostgreSQL por sí solo no comparte esos valores; `DB1-T04` es requisito antes de correr varias instancias.
- Las migraciones actuales y snapshots son SQLite; marcarlos como legado y no reescribirlos como si se hubieran aplicado en PostgreSQL.
- La imagen Docker con `latest` arriesga upgrades mayores accidentales; fijar versión mayor y planear upgrades con backup/restore.
- `PR-08` define el lifecycle y la retención final de `simulation_sessions` antes de iniciar `PR-DB-01`; reflejar ese contrato en la migración PostgreSQL inicial.

## Cross-Cutting Validation

- [ ] Las rutas reales de la API usan PostgreSQL en tests y staging; no queda adaptador SQLite en el camino runtime.
- [ ] Un usuario no puede leer/modificar sesiones, historial ni planes ajenos antes ni después de reiniciar el proceso.
- [ ] La instalación limpia crea las tablas, reconstituye el catálogo desde código y conserva los datos escritos después del primer arranque al recrear contenedores.
- [ ] La aplicación arranca solo después de que PostgreSQL esté sano y las migraciones terminen; readiness falla claramente si no puede conectar.
- [ ] Existe backup PostgreSQL fuera del volumen y un procedimiento documentado de restore probado.

## Open Questions

- Definir destino de backups fuera del host/volumen y su retención antes de habilitar usuarios reales.
