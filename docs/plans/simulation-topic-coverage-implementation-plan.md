# Plan de implementación: cobertura y variedad de temas

## Objetivo

Mantener la distribución oficial por dominios y rotar las simulaciones estándar de 20 preguntas hacia temas de la guía que la persona haya visto menos recientemente. La asignación usa solo agregados por usuario, certificación y versión de guía.

## Alcance e invariantes

- Aplicar cobertura por tema a simulaciones estándar completas de 20 preguntas.
- Conservar cuotas por dominio derivadas de los pesos oficiales. Para los pesos actuales de 25/20/20/20/15, la distribución es 5/4/4/4/3.
- Repartir la cuota de cada dominio entre sus temas menos expuestos; resolver empates por ID de tema estable.
- Considerar hasta dos exposiciones: con una sesión activa, contar temas mostrados hasta `currentIndex` y el resultado completo más reciente; sin sesión activa, usar los dos resultados completos más recientes.
- Filtrar por propietario autenticado, certificación y `guideVersion`. Ignorar guías anteriores.
- Contar resultados estándar y weak-topic como exposiciones previas. Las simulaciones enfocadas conservan su selección y cuotas actuales.
- Pasar cuotas exactas a generador y validador, con un indicador de alcance separado para diferenciar simulación completa de enfoque weak-topic.
- Guardar únicamente `topicBreakdown` y `guideVersion`; no guardar preguntas, opciones, respuestas ni embeddings.
- Esta política mejora cobertura respecto a los temas de la guía; no prueba que la guía contenga todos los objetivos oficiales ni garantiza deduplicación semántica.

## Diseño

1. Antes de generar, cargar la sesión activa del usuario y los resultados agregados compatibles.
2. Si existe una sesión activa, contar solo las preguntas visibles hasta el índice actual junto con el último resultado completado; de lo contrario, usar los dos últimos resultados.
3. Por dominio, asignar su cuota de preguntas a los temas con menor exposición y usar el ID estable como desempate determinístico.
4. Enviar `requiredQuestionsByTopic` junto a un indicador explícito de alcance. En estándar se consideran todos los temas; en weak-topic solo los temas elegidos.
5. Validar en servidor cuotas exactas de dominio y tema antes de crear o devolver la sesión.
6. Al completar, persistir el desglose agregado para que la siguiente ejecución rote con evidencia reciente.

## Touchpoints

| Área | Responsabilidad | Cobertura prevista |
|---|---|---|
| `apps/api/src/use-cases/simulation-service.ts` | Historial compatible, cuotas y flujo de inicio | Aislamiento por usuario, certificación, guía y sesión activa |
| `apps/api/src/simulations/question-validation.ts` o módulo de asignación | Algoritmo determinístico y cuotas exactas | Totales, empates, historial vacío y guía nueva |
| `apps/api/src/simulations/question-generator.ts` | Alcance y cuotas en prompt | Instrucciones distintas para estándar y weak-topic |
| `tests/simulations.test.ts`, `tests/api.test.ts`, `tests/guide-weights.test.ts` | Contrato, servicio y API | Completar una simulación afecta la siguiente asignación |
| `tests/weak-topic-simulation.test.ts` | Mantener modo enfocado | Regresión de límites y prioridades |
| `tests/evaluation/simulation-topic-coverage/` | Rúbrica pequeña de diversidad y objetivos | Evaluación acotada sin PDFs completos ni preguntas retenidas |

## Criterios de aceptación

- Las cuotas de dominio siguen siendo enteras y suman exactamente 20; para los pesos actuales resultan 5/4/4/4/3.
- Las cuotas por tema suman la cuota de su dominio y el generador no puede asignar preguntas fuera de alcance.
- Con más temas que preguntas, se eligen primero los menos expuestos; asignaciones iguales se resuelven de forma determinística por ID.
- La sesión activa aporta solo los temas ya mostrados; una pregunta futura no cuenta como exposición.
- Un resultado de otro usuario, certificación o `guideVersion` no modifica la asignación.
- Un flujo API de inicio y finalización guarda el `topicBreakdown`, y el siguiente inicio del mismo propietario lo usa para rotar temas.
- El modo weak-topic conserva sus conteos exactos, elegibilidad y prioridad actuales.
- El historial continúa almacenando agregados y no se amplía con texto, claves, preguntas o vectores.
- Una rúbrica acotada evalúa diversidad de objetivos y variación de escenarios sin afirmar una garantía de no repetición semántica.

## Riesgos y límites

- IDs y nombres de tema dependen de la versión de la guía; filtrar por `guideVersion` evita mezclar inventarios distintos.
- La rotación de temas no evita que dos preguntas distintas prueben la misma decisión dentro de un mismo tema.
- Los agregados no permiten comparar semánticamente una pregunta nueva con bancos anteriores. Una garantía de deduplicación requeriría otra decisión de privacidad y retención.
- Una evaluación de calidad puede detectar omisiones técnicas frecuentes, pero no sustituye revisión de fuentes oficiales ni garantiza equivalencia con el examen.
