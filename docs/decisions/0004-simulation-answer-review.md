# ADR 0004: Selecciones de respuestas en la revisión final

**Estado:** Propuesto

## Contexto

El resultado conserva agregados, pero el estado activo no registra las opciones seleccionadas, por lo que no se pueden mostrar en la revisión final. En práctica guiada puede haber varios intentos o una respuesta revelada. El resultado y la retención actuales deben seguir funcionando para sesiones anteriores.

## Propuesta

- Guardar temporalmente, en el JSON de la sesión activa y por pregunta, los IDs ordenados de las opciones enviadas. Validar sus límites y pertenencia a la pregunta.
- Al finalizar, resolver en el servidor las selecciones y su corrección y devolverlas como campos compatibles de la revisión final. No incluir correcciones en las respuestas de una simulación real activa.
- Conservar el borrado de preguntas y selecciones del estado completado, la retención temporal existente y el historial agregado. Tratar las selecciones faltantes de sesiones anteriores como desconocidas.

## Alternativas y consecuencias

Guardar solo el último intento ocultaría los errores previos de práctica guiada; guardar la lista limitada permite explicar el resultado sin modificar la puntuación. Guardar preguntas y selecciones permanentemente permitiría reabrir cualquier revisión, pero alteraría la retención acordada. Las selecciones de sesiones que ya comenzaron antes del cambio pueden ser incompletas.

## Validación y referencias

Comprobar aislamiento por propietario, ausencia de respuestas correctas antes de finalizar, reanudación, límites, compatibilidad y limpieza del estado completado. Véanse el [plan de revisión de respuestas](../plans/simulation-result-answer-review-plan.md) y el [ADR 0003](0003-advanced-question-source-and-review.md).
