# Plan de implementación: Azure AI Fundamentals y catálogo multi proveedor

**Estado:** Implementación y diagnóstico de errores completados en `codex/ai-901-multi-provider`; validación automatizada pendiente.
**Última actualización:** 2026-10-08

## Source Materials

- [Plan del catálogo GCP](gcp-certifications-implementation-plan.md) — fija el flujo actual de catálogo, guías y simulaciones.
- [Certificación Azure AI Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/), [guía AI-901](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901), [ruta de conceptos](https://learn.microsoft.com/en-us/training/paths/ai-concepts/), [ruta de aplicaciones y agentes](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/) y [curso AI-901](https://learn.microsoft.com/en-us/training/courses/ai-901t00) — fuentes oficiales para el nuevo registro.

## Status

- Completado: alcance acordado: agregar únicamente Azure AI Fundamentals (AI-901) y hacer que el recorrido existente acepte fuentes y prompts de más de un proveedor.
- En progreso: validación automatizada y manual de `PR-01`.
- Completado: cambios de código, catálogo, prompts, documentación, expectativas existentes, logs detallados de fallos de IA y ponderaciones oficiales por rango.

## PR Status

| PR | Alcance | Estado | Depende de | Gate de validación |
|---|---|---|---|---|
| `PR-01` | Agregar AI-901 y habilitar el flujo para GCP y Microsoft Azure | Implementado; validación pendiente | — | Guía citada de AI-901, simulación por su ID y regresión GCP |

## Goal

Agregar Azure AI Fundamentals con el examen AI-901 al catálogo existente y permitir que tanto guías como simulaciones funcionen con certificaciones de Google Cloud y Microsoft Azure, sin cambiar el recorrido de las cinco certificaciones GCP.

## Scope and Constraints

- En alcance: solo AI-901; proveedor tipado por certificación; búsqueda y validación de fuentes oficiales por proveedor; prompts bilingües y aviso de afiliación neutrales; pruebas y README actualizados.
- Fuera de alcance: otras certificaciones Azure, formulario de administración del catálogo, banco estático de preguntas y cambios a la experiencia de autenticación.
- Restricción: conservar IDs GCP, historial, planes y selección inicial actual de Professional Cloud Developer.
- Despliegue: todo junto en `PR-01`.
- Supuesto: el proveedor es metadato del catálogo en código y no requiere persistencia; la tabla existente usa IDs y URLs de texto. No se anticipa migración de base de datos.

## Implementation Shape

- Ejecución: `GET /api/v1/certifications` expone el catálogo; al solicitar una guía, el servicio busca las fuentes registradas, genera y guarda la guía por `certificationId`; las simulaciones se generan desde esa guía.
- Extensión: conservar el flujo y agregar `provider` al contrato del catálogo. Usar ese dato para seleccionar dominios oficiales permitidos y el lenguaje del prompt. Mantener las listas de dominios cerradas en el servidor; el formulario futuro queda fuera de este plan.
- AI-901: registrar la guía de estudio como `exam-guide`, la página de certificación y sus dos rutas oficiales de aprendizaje. Conservar el contrato actual de una URL principal por paso; usar la ruta de aplicaciones y agentes como enlace de los pasos y mostrar ambas rutas en las fuentes oficiales.
- Orden: definir contrato/proveedor; registrar AI-901; adaptar verificación de fuentes y generación; actualizar textos, documentación y pruebas.

## Codebase Touchpoints

| Área / archivo | Cambio previsto | Prueba asociada |
|---|---|---|
| `src/api/certification-contracts.ts` | Añadir proveedor al contrato de catálogo y el tipo de fuente para detalles del examen | Validación del esquema y respuesta del catálogo |
| `server/catalog/certifications.ts` | Registrar `azure-ai-fundamentals`, código `AI-901`, guía, página de examen, certificación y URLs de aprendizaje | Unicidad del ID, tipos de fuente y URLs HTTPS |
| `server/catalog/guide-generator.ts` | Permitir dominios oficiales por proveedor; extraer citas desde resultados de herramienta, acciones de apertura y fuentes de respuesta; normalizar variantes de Microsoft Learn | Citas oficiales aceptadas; dominios externos rechazados; GCP sin regresión |
| `server/logger.ts` | Emitir errores de servidor en consola fuera de desarrollo y resumir metadatos de excepciones sin serializar objetos completos | Logs detallados en fallos de generación; mensajes truncados y credenciales comunes redactadas |
| `server/simulations/question-generator.ts` | Generar preguntas alineadas con el proveedor y la guía recibida | Prompts inglés/español correctos por proveedor |
| `src/i18n/messages.ts` | Generalizar el aviso de no afiliación | Mensajes inglés/español |
| `pages/index/+Page.tsx` | Etiquetar detalles del examen y usar una clave de fuente única | Fuentes oficiales mostradas sin claves duplicadas |
| `tests/certification-catalog.test.ts`, `tests/certification-guide.test.ts`, `tests/guide-generator.test.ts`, `tests/question-generator.test.ts` | Actualizar expectativas GCP y agregar cobertura Azure | Contrato, integración con generadores falsos y restricciones de fuentes |
| `README.md` | Documentar el catálogo mixto y las fuentes oficiales permitidas | Revisión del texto y de los comandos existentes |

## PR / Review Strategy

- `PR-01`: entregar la certificación y el recorrido multi proveedor completo en un PR, con pruebas de guía y simulación más una pasada manual en UI. Anterior: ninguno; siguiente: ninguno.
- Stacking: un PR; el cambio comparte el contrato del catálogo y la política de fuentes.
- Merge guidance: no integrar AI-901 si las fuentes oficiales no pueden ser citadas o si alguna ruta GCP cambia su comportamiento.

## Parallel Execution Notes

- Ruta crítica: contrato de proveedor → selección de allowlist/prompts → prueba de guía y simulación con AI-901.
- En paralelo tras fijar el contrato: ajuste de prompts de simulación, aviso bilingüe, README y pruebas correspondientes.
- Punto de serialización: el proveedor debe llegar en el mismo objeto de certificación a la guía y al generador de preguntas.

## PR 1: AI-901 y soporte multi proveedor

**PR ID:** `PR-01`
**Estado:** Implementado; validación pendiente
**Objetivo:** agregar AI-901 al catálogo y validar el recorrido completo con fuentes Microsoft, preservando el recorrido GCP.
**Depende de:** ninguno.
**Paralelismo:** el contrato de proveedor define la interfaz; después se pueden trabajar en paralelo prompts, textos y pruebas.

### Tasks

- [x] `P1-T01` Añadir un campo `provider` al contrato del catálogo y asignarlo a todos los registros actuales; conservar IDs y orden inicial.
- [x] `P1-T02` Registrar `azure-ai-fundamentals` con `AI-901`, nombres ES/EN y enlaces oficiales al exam guide, detalles del examen, certificación y las rutas de conceptos y aplicaciones/agentes; usar la segunda como URL principal de los pasos de estudio bajo el contrato actual.
- [x] `P1-T03` Cambiar la allowlist y la validación de citas de una lista exclusiva de Google a políticas explícitas por proveedor. Para Azure permitir las páginas oficiales `learn.microsoft.com` requeridas por AI-901, sin aceptar dominios arbitrarios.
- [x] `P1-T04` Adaptar prompts de guía y preguntas en inglés/español para nombrar el proveedor de la certificación y basarse en sus dominios oficiales; conservar la prohibición de copiar preguntas del examen.
- [x] `P1-T05` Generalizar el aviso de no afiliación y actualizar el README para el catálogo GCP + Azure.
- [x] `P1-T06` Actualizar las expectativas existentes de catálogo y endpoint; el test de integración de guía recorre el catálogo completo, incluido AI-901.
- [x] `P1-T07` Emitir los detalles del error original y las URLs de citas observadas en logs; extraer fuentes de respuesta y URLs abiertas por la búsqueda, comparar variantes de Microsoft Learn e instruir explícitamente al modelo para citar fuentes oficiales del examen.
- [x] `P1-T08` Preservar los rangos de ponderación oficiales, derivar el punto medio para asignación interna y mantener un esquema estructurado compatible con el modo estricto de OpenAI.

### Validation Criteria

- [ ] El catálogo API conserva las cinco certificaciones GCP y añade exactamente AI-901 con fuentes oficiales; Professional Cloud Developer sigue siendo la selección inicial.
- [ ] La política acepta citas oficiales de Google y Microsoft según proveedor, exige cita al exam guide o página de certificación y rechaza fuentes externas.
- [ ] Guía de AI-901 generada con el examen oficial como autoridad; la UI conserva los rangos de porcentaje publicados y la simulación usa puntos medios que suman 100%, con recursos oficiales visibles.
- [ ] Simulación de AI-901 usa solo dominios/temas de su guía y produce preguntas válidas en inglés y español; sesiones, historial y plan conservan `azure-ai-fundamentals`.
- [ ] Typecheck, build y suite automatizada pasan con llamadas a IA sustituidas por generadores falsos. Hacer una validación manual de la primera generación real de guía y una simulación desde la UI, sin incorporarla a CI.

> No se ejecutaron pruebas, typecheck ni build en esta implementación.

### Risks / Open Questions

- La guía oficial de AI-901 publica rangos de ponderación. La UI conserva y muestra esos rangos; las simulaciones usan sus puntos medios como pesos internos, que para AI-901 suman 100%.
- El catálogo actual persiste una URL principal de ruta de aprendizaje por certificación. Registrar más recursos en el catálogo los muestra en fuentes oficiales, pero los pasos de estudio generados enlazan a una ruta principal; no ampliar ese contrato en este alcance.

## Cross-Cutting Validation

- [ ] Comprobar el selector, la guía, una simulación, el historial y el plan de estudio con el ID AI-901.
- [ ] Comprobar que las cinco rutas GCP existentes siguen funcionando y siguen aislando sus guías e historial por ID.
- [ ] No usar preguntas oficiales ni ejecutar llamadas pagadas a IA desde pruebas automatizadas.

## Open Questions

- Ninguna bloqueante para el alcance definido.
