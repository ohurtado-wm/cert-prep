# Plan de implementación: reanudar simulaciones pendientes

## Objetivo

Permitir que una persona salga de una simulación y continúe después desde la misma pregunta, con el mismo conjunto generado y el progreso guardado por el servidor. Cada usuario puede tener una sola sesión pendiente.

## Invariantes de sesión

- Una sesión pendiente no vence por inactividad; permanece hasta que se complete, se descarte explícitamente o una nueva sesión válida la reemplace.
- Las sesiones completadas mantienen su retención corta de dos horas; los resultados agregados siguen el plan de historial.
- Reanudar no llama al generador, no consume tokens de IA y no descuenta un nuevo inicio por hora.
- Una nueva simulación estándar o weak-topic reemplaza la pendiente solo después de que análisis, generación y validación finalizan correctamente.
- Si elegibilidad, análisis, generación o validación fallan, la sesión pendiente anterior se conserva.
- El almacenamiento está asociado al `gatewayUserId` verificado; preguntas y respuestas no se guardan en `localStorage`.
- La respuesta no revela la clave de una pregunta aún no resuelta. En práctica se puede restaurar el número de intentos y la retroalimentación ya revelada.

## Diseño de API y UI

- Añadir `GET /simulations/active` para devolver la única sesión pendiente del propietario o `null`. Registrar esta ruta estática antes de `GET /simulations/:sessionId`.
- Al salir de la pantalla, conservar la sesión y volver a inicio. Mostrar una tarjeta con **Continuar** y **Descartar**.
- Continuar carga el estado del servidor y muestra la pregunta correspondiente al `currentIndex` sin regenerar el banco.
- Descartar requiere confirmación y borra únicamente la sesión pendiente del usuario autenticado.
- Antes de iniciar una sesión estándar o weak-topic, advertir si reemplazará progreso guardado.
- Limpiar la caché del usuario al cerrar sesión o cambiar de identidad.

## Persistencia y concurrencia

- Representar estados pendientes y completados explícitamente; una sesión pendiente no tiene fecha de expiración y una completada conserva la retención configurada.
- Garantizar en PostgreSQL, mediante índice o restricción equivalente, una sola sesión pendiente por usuario.
- Si existen filas pendientes duplicadas durante la instalación, conservar la más reciente antes de activar la restricción.
- Ejecutar el trabajo costoso de IA antes de la transacción corta que sustituye la sesión anterior. La validación y reemplazo se confirman juntos.
- Mantener los límites de nuevos inicios para intentos fallidos y exitosos. La ruta de reanudación no cuenta como nuevo inicio.

## Touchpoints

| Área | Responsabilidad | Cobertura prevista |
|---|---|---|
| `apps/api/src/use-cases/simulation-service.ts` | Consulta, reanudación y reemplazo atómico | Propietario correcto, fallos preservan sesión previa |
| `apps/api/src/routes/simulations.ts` | Ruta estática de sesión activa y descarte | Orden de rutas y autenticación |
| `apps/api/src/db/schema.ts`, `apps/api/drizzle/postgresql/` | Ciclo de vida, expiración e invariante de sesión única | Migración PostgreSQL e instalación limpia |
| `packages/contracts/src/simulation-contracts.ts` | Respuesta nullable y snapshot seguro | No expone claves de preguntas pendientes |
| `apps/web/src/api/simulations.ts` | Consulta, continuación y descarte | Validación de respuesta y errores |
| `apps/web/pages/index/+Page.tsx`, `apps/web/src/components/SimulationScreens.tsx` | Tarjeta, confirmación y restauración visual | Salir, recargar y continuar en modo práctica y real |
| `apps/api/src/simulations/state.ts` | Estado mínimo para intentos y retroalimentación | Restauración sin revelar respuestas no resueltas |
| `tests/simulations.test.ts` | Integración de API, servicio y persistencia | Aislamiento, concurrencia, reemplazo y cuota |

## Criterios de aceptación

- El propietario puede salir, recargar y continuar en la misma pregunta con el mismo banco; la reanudación no invoca IA.
- La práctica restaura intentos y retroalimentación ya revelada; el modo real no filtra claves antes de finalizar.
- Otro usuario no puede listar, leer, reanudar ni descartar la sesión.
- El descarte elimina solo la sesión seleccionada; completar conserva el resultado agregado.
- La sesión permanece hasta completar, descartar o reemplazar después de una generación válida.
- Nunca hay más de una sesión pendiente por usuario, incluso ante inicios concurrentes.
- Los fallos de generación o elegibilidad preservan la sesión anterior.
- Iniciar una sesión nueva mantiene los límites de frecuencia; reanudar no los consume.

## Dependencias

- El contrato de ciclo de vida de sesión se define antes del esquema y del snapshot de reanudación.
- El límite de una sesión pendiente debe formar parte de la persistencia PostgreSQL desde la migración inicial.
- El historial por certificación define el tratamiento de los resultados completados; la rotación de temas usa agregados, no las preguntas reanudables.
