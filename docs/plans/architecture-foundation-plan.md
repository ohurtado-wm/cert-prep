# Plan de arquitectura fundacional de Cert Prep

## Propósito

Definir una arquitectura que permita desarrollar Cert Prep como producto web bilingüe, mantener límites claros entre interfaz, servicios y contratos, y desplegar UI y API como una sola aplicación.

## Criterios de arquitectura

- Mantener un origen único: Vike sirve la aplicación web y monta Hono bajo `/api/*` dentro del mismo proceso Bun.
- Separar responsabilidades mediante workspaces: interfaz en `apps/web`, lógica de servidor en `apps/api` y esquemas Zod públicos en `packages/contracts`.
- Mantener pruebas transversales en `tests/`; pueden importar los workspaces sin trasladar las reglas de producto a la suite.
- Usar PostgreSQL como base de datos runtime y Drizzle para esquema, consultas y migraciones.
- Ejecutar migraciones como una tarea explícita antes de iniciar la aplicación. La API no compite por aplicar migraciones durante el arranque.
- Resolver la identidad con el gateway de West Monroe. El backend deriva el propietario desde la respuesta verificada de `/users/me` y nunca confía en un `userId` enviado por el navegador.
- Conservar en el servidor las claves correctas, credenciales y datos de sesión que no deban llegar al cliente.
- Compartir los contratos HTTP públicos con Zod; los detalles de PostgreSQL y los modelos internos pertenecen a `apps/api`.

## Responsabilidad por workspace

| Workspace | Responsabilidad | Límites |
|---|---|---|
| `apps/web` | Vike, React, páginas, componentes, estilos, preferencias, clientes HTTP y montaje del servidor web | No guarda secretos, respuestas correctas ni lógica de acceso a PostgreSQL |
| `apps/api` | Aplicación Hono, rutas, casos de uso, identidad, generación con IA, persistencia y migraciones | Deriva el usuario del gateway; valida solicitudes y respuestas en límites externos |
| `packages/contracts` | Esquemas y tipos Zod compartidos por navegador, API y pruebas | No incluye dependencias de UI, base de datos ni secretos |
| `tests` | Pruebas unitarias, de rutas e integración entre workspaces | Sustituye proveedores externos por dobles salvo una evaluación manual autorizada |

## Estructura prevista

```text
cert-prep/
├── AGENTS.md
├── README.md
├── package.json
├── bun.lock
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── pages/
│   │   └── src/
│   └── api/
│       ├── package.json
│       ├── drizzle/
│       └── src/
├── packages/
│   └── contracts/
│       ├── package.json
│       └── src/
├── tests/
└── docs/
    ├── architecture.md
    ├── decisions/
    └── plans/
```

## Datos y persistencia

- PostgreSQL es el único dialecto runtime. Las tablas de sesiones, resultados, planes, guías y coordinación persistente usan claves e índices que permiten aislar por usuario y operar entre procesos.
- Las migraciones PostgreSQL viven en `apps/api/drizzle/postgresql/`. El historial SQLite se conserva como referencia técnica y no participa en el runtime.
- Una instalación limpia crea el esquema desde migraciones, obtiene el catálogo desde el código y genera guías bajo demanda. No importa datos de una base SQLite.
- Los resultados guardan métricas agregadas. No se conserva texto de preguntas, opciones, respuestas ni claves en el historial.
- La retención, leases, rate limits y ciclo de vida de sesiones se documentan en sus planes funcionales específicos.

## Despliegue y operación

- Bun instala los workspaces desde un único lockfile raíz.
- Docker Compose coordina PostgreSQL, una tarea de migración de una sola ejecución y un único servicio de aplicación web/API.
- PostgreSQL permanece en una red privada y usa un volumen persistente. Las credenciales se entregan desde el entorno y no se guardan en Git.
- El healthcheck HTTP verifica la disponibilidad de `/api/healthz`.
- Los respaldos deben almacenarse fuera del volumen principal y su restauración debe poder probarse en una base descartable.

## Criterios de aceptación

- Las dependencias del navegador, API y contratos se declaran en sus respectivos workspaces y el lockfile vive en la raíz.
- UI y API comparten origen; las rutas de API mantienen el prefijo `/api/*`.
- La API valida contratos Zod, obtiene la identidad desde el gateway y aplica aislamiento por propietario en cada operación privada.
- Ningún secreto ni clave correcta de una pregunta real aparece en el bundle o en las respuestas del navegador antes de finalizar la sesión.
- Migraciones, pruebas y comandos de desarrollo se pueden ejecutar desde la raíz o desde los scripts definidos por workspace.
- Compose inicia la aplicación solo después de que PostgreSQL esté sano y la migración haya terminado.

## Riesgos y decisiones relacionadas

- Un solo host no ofrece alta disponibilidad ante pérdida de host o disco; respaldos externos y restauración probada son necesarios para uso real.
- La composición web/API en un proceso mantiene el mismo origen y simplifica el despliegue. La separación futura en servicios requiere una decisión nueva.
- La decisión sobre workspaces y proceso único se registra en [ADR-0001](../decisions/0001-workspaces-single-runtime.md). Los requisitos del producto se detallan en [FEATURE_IMPLEMENTATION_PLAN.md](FEATURE_IMPLEMENTATION_PLAN.md) y [docs/architecture.md](../architecture.md).
