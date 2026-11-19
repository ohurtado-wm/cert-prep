# Plan: mostrar sesiones en progreso en simulaciones recientes

**Estado: Aprobado e implementado — revisión manual pendiente.**

## Objetivo

Mostrar la sesión en progreso en **Recent simulations / Simulaciones recientes**, junto a las simulaciones completadas de la certificación seleccionada, y permitir continuarla desde esa sección.

## Aclaración de alcance

- **Practice weak topics** conserva su botón actual **Start focused practice** y su comportamiento de inicio, incluida la confirmación existente si una sesión pendiente sería reemplazada.
- No es necesario identificar si la sesión activa es enfocada o estándar. Esta información no está registrada actualmente y no se agregará para este cambio.

## Contexto confirmado

- La app permite una sola sesión activa por usuario. `GET /api/v1/simulations/active` devuelve su estado, certificación, modo, idioma, fecha e índice actual.
- `GET /api/v1/simulation-history` devuelve los resultados completados de la certificación seleccionada. El historial y la sesión activa son consultas independientes.
- `resumeSession` ya restaura una sesión guardada en su certificación, modo, idioma y pregunta actuales, sin generar preguntas nuevas.
- La pantalla de progreso ofrece continuar una sesión de la certificación seleccionada cuando no hay historial, pero la sección de simulaciones recientes no muestra la sesión activa cuando sí hay resultados completados.

## Comportamiento propuesto

- Mostrar en **Simulaciones recientes** una tarjeta identificada como **En progreso**, con certificación, modo, fecha, progreso y botón **Continuar**. La sesión activa no tendrá puntaje ni fecha de finalización ficticios.
- Si hay resultados completados, mostrar la sesión en progreso junto a ellos. Si no hay resultados completados pero sí hay una sesión activa de la certificación seleccionada, mostrar la misma tarjeta y un mensaje claro de que todavía no hay resultados completados.
- Si la sesión activa pertenece a otra certificación, no mostrarla como parte de la certificación seleccionada. El recordatorio del dashboard continúa disponible.
- Si no hay sesión activa ni resultados completados para la certificación seleccionada, conservar el estado vacío que invita a iniciar una simulación desde el dashboard.
- Continuar utiliza la sesión y el flujo de reanudación existentes. No genera preguntas, no consume un nuevo inicio y conserva el idioma, modo y progreso guardados.
- Mantener separados los estados de carga y error de la sesión activa y del historial. Un error de cualquiera de las consultas no se presenta como ausencia de sesiones; ofrecer reintento sin ocultar datos disponibles de la otra consulta.
- Mantener los controles y textos en español e inglés, con acceso por teclado y diseño adaptable.

## Criterios de aceptación

1. Con resultados completados y una sesión activa de la certificación seleccionada, la sección muestra ambos y **Continuar** abre la pregunta guardada.
2. Con sesión activa pero sin resultados completados, se muestra la tarjeta en progreso y se aclara que todavía no hay resultados completados.
3. Sin sesión activa ni resultados, se mantiene el estado vacío con una acción para ir al inicio.
4. Una sesión activa de otra certificación no aparece como si perteneciera a la certificación seleccionada.
5. La reanudación conserva el estado guardado en práctica guiada y modo real, sin llamar al generador de IA ni consumir la cuota de inicio.
6. Carga y errores de historial y sesión activa son distinguibles; un fallo ofrece reintento y no elimina el contenido disponible de la otra consulta.
7. **Practice weak topics** conserva su botón de inicio y las reglas actuales para reemplazar una sesión.
8. La interfaz funciona en español e inglés, con teclado y en móvil; no expone respuestas privadas antes de finalizar una simulación real.

## Archivos previstos

- `apps/web/pages/index/+Page.tsx`: integrar la sesión activa con el componente de simulaciones recientes y reutilizar `resumeSession`.
- `apps/web/src/i18n/messages.ts`: etiquetas bilingües de estado y errores si son necesarias.
- `apps/web/src/styles.css`: presentación de la tarjeta de sesión activa y sus estados.
- Pruebas pertinentes de presentación y reanudación según la infraestructura del repositorio.
- No se prevén cambios en API, contratos, datos, migraciones ni dependencias.

## Secuencia y validación prevista

1. Integrar la sesión activa en Simulaciones recientes, tanto con historial vacío como con resultados existentes, manteniendo las consultas independientes.
2. Conectar **Continuar** al flujo de reanudación existente y preservar los estados de carga y error.
3. Añadir textos y estilos bilingües y verificar la presentación adaptable.
4. Cubrir los escenarios de historial vacío y poblado, sesión de la misma u otra certificación, carga/error y continuación. Verificar que Practice weak topics conserva su comportamiento.
5. Ejecutar `bun run typecheck`, `bun run build` y las pruebas pertinentes; revisar manualmente los modos de práctica, idiomas, teclado y móvil. Reportar únicamente resultados reales y no hacer llamadas pagadas a IA en pruebas automáticas.

## Riesgos y reversión

- El estado activo puede cambiar en otro dispositivo. Mantener los errores de sesión recuperables y actualizar la consulta cuando corresponda.
- No confundir una sesión en curso con un resultado final ni duplicarla en el historial al completarla.
- Revertir el cambio de frontend restaura la presentación anterior sin afectar datos o sesiones guardadas.

## Evidencia de implementación

- `bun run typecheck` y `bun run build` finalizaron correctamente.
- `bun test tests/active-session-resume.test.ts apps/web/src/components/SimulationHistory.test.tsx tests/certification-ui-data.test.ts`: 17 pruebas aprobadas. Cubren historial vacío y poblado, certificaciones distintas, errores y carga independientes, sesión completada ya presente en el historial y revalidación de la sesión.
- Continuar vuelve a consultar la sesión activa y solo reanuda si el ID y la certificación coinciden. Si cambió, se muestra un error recuperable; no se llama al endpoint de inicio desde ese flujo.
- La revisión manual de los modos de práctica, teclado y móvil queda pendiente: el navegador no estaba disponible en esta sesión. No se ejecutó integración PostgreSQL ni se hicieron llamadas pagadas a IA.

## Aprobación

El usuario aprobó la implementación. La revisión manual indicada arriba sigue pendiente.

## Ajustes posteriores a la revisión

- La tarjeta de sesión en progreso permite descartarla con confirmación, carga y error en la pantalla de progreso. El recordatorio no incorpora esta acción.
- El resultado y las preguntas imprimibles de la última simulación completada durante la visita se conservan en memoria y se pueden volver a abrir desde progreso para la misma cuenta y certificación. Se eliminan al cerrar sesión, cambiar de cuenta o borrar el historial; no sobreviven a una recarga.
- `bun run typecheck` y `bun run build` finalizaron correctamente. Las 22 pruebas seleccionadas de historial, reanudación, acceso al resultado y datos de interfaz pasaron. La revisión interactiva en navegador sigue pendiente.
