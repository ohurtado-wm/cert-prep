# ADR 0003: Fuente de preguntas y revisión temporal de simulaciones reales

**Estado:** Aceptado
**Fecha de aceptación:** 2026-11-19

## Contexto

Práctica avanzada usa un banco estático autorizado y comparte las reglas de simulación real con las preguntas generadas por IA. Ambas muestran las respuestas y explicaciones únicamente después de finalizar. El historial actual conserva agregados, pero no preguntas ni respuestas, y las sesiones anteriores deben seguir siendo legibles.

## Decisión

- Mantener `practice` y `real` como modos y registrar por separado la fuente de preguntas. La fuente ausente se interpreta como IA para conservar compatibilidad.
- Persistir únicamente la fuente junto a los resultados agregados, sin agregar preguntas ni respuestas al historial.
- Mantener el banco en el servidor, validar las cuotas existentes por dominio y tema y bloquear el inicio ante mapeos o capacidad insuficientes.
- Al cambiar la guía, comparar sus dominios y temas con la guía de referencia usando IA y enviar únicamente las descripciones de las guías, nunca las preguntas ni las claves del banco. Reutilizar una asignación solo cuando el tema nuevo cubra el anterior; excluir las asociaciones sin correspondencia y rechazar el inicio si no se satisfacen las cuotas exactas. Guardar la compatibilidad temporalmente en memoria. La comprobación es probabilística y requiere una llamada de IA para cada guía nueva por proceso.
- Tras finalizar una simulación real, mostrar la revisión en memoria. Reutilizar las explicaciones de preguntas generadas por IA y generar las del banco en segundo plano; los reintentos deben estar limitados y vinculados al propietario, la sesión y una pregunta realmente seleccionada.
- No permitir recuperar la revisión avanzada después de salir ni de recargar. Los datos temporales de revisión y explicaciones no se escriben en el historial; su expiración y un reinicio del proceso pueden impedir reintentos posteriores.

## Alternativas y consecuencias

Agregar un tercer modo mezclaría la fuente con las reglas de respuesta. Persistir preguntas completas permitiría reabrir la revisión, pero contradiría la retención solicitada. La revisión temporal preserva esa preferencia a costa de no sobrevivir a reinicios; la UI debe mostrar el resultado y las respuestas aunque la generación de explicaciones falle.

## Validación prevista

Comprobar compatibilidad de sesiones antiguas, cuotas, aislamiento de propietario, respuestas ocultas antes de finalizar, reintentos y limpieza, y migraciones PostgreSQL. No registrar contenido privado ni ejecutar llamadas pagadas en las pruebas.

## Referencias

- [Plan de Práctica avanzada](../plans/advanced-practice-cloud-developer-plan.md)
- [ADR 0001: runtime web/API único](0001-workspaces-single-runtime.md)
