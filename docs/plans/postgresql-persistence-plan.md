# Plan de persistencia PostgreSQL y operación local

## Objetivo

Usar PostgreSQL como única base runtime de Cert Prep para desarrollo y producción local. La instalación parte de una base vacía y coordina entre procesos las sesiones, los límites de uso y la generación concurrente.

## Alcance y decisiones

- Usar `pg` con Drizzle `node-postgres`, un pool limitado y `DATABASE_URL`.
- Mantener un esquema PostgreSQL con claves foráneas e índices para consultas por propietario, vencimiento y fecha.
- Representar fechas con `timestamptz`/`Date` y datos estructurados con `jsonb`.
- Mantener migraciones en `apps/api/drizzle/postgresql/` y ejecutarlas mediante un comando/tarea explícita antes de iniciar la aplicación.
- PostgreSQL es el único dialecto runtime; no importar datos de SQLite ni mantener un segundo adaptador.
- La topología de Docker Compose incluye PostgreSQL, un servicio de migración de una sola ejecución y una aplicación web/API. La aplicación y PostgreSQL se comunican por una red privada.
- El catálogo se carga desde el código; las guías se generan bajo demanda.
- Fuera de alcance: elegir un proveedor de nube administrado, cambiar UI o alterar reglas de negocio ajenas a la persistencia y concurrencia.

## Persistencia y concurrencia

- Usar leases persistentes con token y vencimiento para coordinar generación por usuario y renovación de guías entre procesos.
- Registrar inicios exitosos y fallidos de forma compartida para que el límite por hora no dependa de memoria local.
- Mantener atómicos los conteos de inicio y la creación o reemplazo de sesión; liberar leases solo con su token y permitir recuperación por vencimiento.
- Asegurar aislamiento por `gatewayUserId` en sesiones, historial, planes y otras operaciones privadas.
- Aplicar el ciclo de vida de [sesiones reanudables](resumable-simulations-implementation-plan.md): una sesión pendiente por usuario sin expiración; sesiones completadas con retención limitada.

## Contenedores y operación

- Fijar una versión de la imagen oficial PostgreSQL; no usar `latest`.
- Guardar datos en un volumen persistente y configurar un healthcheck con `pg_isready`.
- No publicar el puerto PostgreSQL en producción; usar un rol de aplicación sin privilegios de superusuario.
- Mantener secretos fuera del repositorio y entregar las credenciales mediante variables de entorno.
- Iniciar migraciones después de que PostgreSQL esté sano y antes de que arranque la aplicación.
- Documentar backups periódicos fuera del host o volumen y probar restauraciones en una instancia descartable.
- Un solo host no ofrece alta disponibilidad ni sobrevive a la pérdida del disco; los backups y la recuperación son requisitos operativos.

## Touchpoints

| Área | Responsabilidad | Verificación prevista |
|---|---|---|
| `apps/api/src/db/schema.ts` | Tablas, relaciones, timestamps, JSONB e índices | Instalación sobre base vacía |
| `apps/api/src/db/client.ts` | Pool PostgreSQL, límites de conexión y cierre | Inicio, healthcheck y apagado |
| `apps/api/src/db/migrate.ts`, `apps/api/drizzle.config.ts` | Aplicación explícita de migraciones | Migración limpia e idempotencia |
| `apps/api/src/use-cases/simulation-service.ts`, `apps/api/src/catalog/repository.ts` | Leases, cuotas y coordinación persistente | Dos conexiones no duplican trabajo ni exceden límites |
| `Dockerfile`, `compose.yaml`, `compose.dev.yaml` | Servicio PostgreSQL, migración y app | Readiness, red privada y volumen persistente |
| `tests/api.test.ts`, `tests/simulations.test.ts`, `tests/certification-guide.test.ts` | Pruebas sobre PostgreSQL aislado | Transacciones, leases, identidad y concurrencia |
| `package.json`, `.env.example`, `README.md` | Scripts, variables y procedimiento operativo | Instalación desde cero y guía de respaldo/restauración |

## Secuencia de implementación

1. Definir tipos PostgreSQL para todas las entidades y restricciones de propiedad.
2. Configurar cliente, pool, schema y migración inicial.
3. Implementar leases y rate limits persistentes.
4. Configurar Compose, healthchecks, roles, secretos y volumen.
5. Ejecutar pruebas de integración con una base aislada y dos conexiones concurrentes.
6. Documentar instalación limpia, migración, backup y restauración.

## Criterios de aceptación

- Una base vacía se crea desde las migraciones y repetirlas no duplica cambios.
- Todas las rutas privadas aíslan sesiones, historial y planes por usuario, también tras reiniciar procesos.
- Dos instancias que comparten la base coordinan leases y límites sin duplicar generaciones.
- La app arranca solo tras healthcheck de PostgreSQL y finalización de las migraciones.
- La base mantiene sus datos al recrear el contenedor mediante el volumen persistente.
- Un backup guardado fuera del volumen puede restaurarse en una instancia descartable.
- No se requieren archivos SQLite ni se exponen respuestas o claves al cliente por persistir en PostgreSQL.

## Decisiones operativas pendientes

- Definir destino y retención de backups externos al volumen.
- Dimensionar CPU, memoria y almacenamiento según tráfico y límites del host; no fijar recursos sin mediciones.
- Si la aplicación se mueve a un proveedor administrado, escoger PostgreSQL aprobado en esa nube y actualizar la configuración de red/secretos.
