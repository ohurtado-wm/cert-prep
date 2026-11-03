# Plan de implementación: historial de simulaciones por certificación

## Objetivo

Conservar hasta cinco resultados recientes por usuario y certificación, y mostrar en la pantalla de inicio solo el historial de la certificación seleccionada. El análisis de temas débiles también se limita a esa certificación.

## Alcance y decisiones

- Mantener `MAX_SIMULATION_HISTORY_ITEMS` configurable y usar 5 como valor recomendado.
- Al completar una simulación, depurar resultados antiguos solo para la misma identidad y certificación.
- Permitir filtrar la lectura por `certificationId`; conservar el comportamiento general del endpoint para consumidores que no envíen el filtro.
- Incluir la certificación seleccionada en la consulta y en la clave de caché de TanStack Query.
- Mantener el análisis weak-topic aislado por certificación.
- El botón para borrar historial sigue siendo global; debe explicar que elimina los resultados y planes cubiertos por la operación, de todas las certificaciones.
- Fuera de alcance: cambiar la cuota de inicios por hora, el umbral de temas débiles, la clasificación de errores o borrar una sola certificación de forma independiente.
- No se requiere una migración de datos: la certificación ya forma parte de los resultados.

## Diseño

1. Al completar una sesión, ordenar los resultados del propietario por certificación y conservar los más recientes hasta el límite configurado.
2. Añadir un filtro opcional `certificationId` a la lectura de historial y mantener siempre el filtro obligatorio por `gatewayUserId`.
3. Solicitar desde la UI el historial de la certificación activa. Al cambiarla, actualizar la clave de consulta para que no se muestren resultados de otra opción.
4. Mantener la acción de borrado global con confirmación bilingüe que explique su alcance.
5. Usar en análisis de temas débiles únicamente resultados de la certificación seleccionada.

## Touchpoints

| Área | Responsabilidad | Cobertura prevista |
|---|---|---|
| `apps/api/src/use-cases/simulation-service.ts` | Retención por usuario y certificación | Llegar al límite de A no elimina resultados de B ni de otro usuario |
| `apps/api/src/use-cases/simulation-history-service.ts`, `apps/api/src/routes/simulations.ts` | Filtro de lectura opcional y borrado global | Filtros obligatorios de propietario y compatibilidad del endpoint |
| `apps/web/src/api/simulations.ts` | Solicitud filtrada y validación | La llamada envía la certificación seleccionada |
| `apps/web/pages/index/+Page.tsx` | Historial visible para la certificación activa | Cambiar selección actualiza la lista |
| `apps/api/src/config/runtime-limits.ts`, `.env.example`, `README.md` | Configuración y texto del límite | El valor del entorno y la documentación concuerdan |
| `apps/web/src/i18n/messages.ts` | Confirmación global de borrado | Español e inglés explican las certificaciones afectadas |
| `tests/` | Retención, aislamiento, filtros y regresión weak-topic | Casos de usuario, certificación y límite |

## Criterios de aceptación

- Completar una sexta simulación de A conserva las cinco más recientes de A sin eliminar resultados de B ni de otro usuario.
- Una lectura filtrada devuelve solo la certificación solicitada; una lectura sin filtro mantiene el contrato existente.
- La UI incluye la certificación en la consulta, su clave de caché y la representación del historial.
- El análisis de temas débiles de A no usa métricas de B, aunque compartan IDs de tema.
- El borrado comunica y conserva su alcance global, incluidos los planes que elimina.
- Los resultados guardan datos agregados y no preguntas, opciones ni respuestas.

## Riesgos

- La retención por certificación aumenta el máximo total por usuario a medida que crece el catálogo. Con seis certificaciones y un límite de cinco, se pueden conservar hasta 30 resultados.
- Los resultados ya depurados por una política anterior no pueden recuperarse; la nueva regla aplica hacia adelante.
- El endpoint no filtrado debe conservarse por compatibilidad; la UI utilizará el filtro explícito.
