# Plan: mostrar las respuestas elegidas en los resultados

**Estado: Implementado; plan aprobado por el usuario.**

## Objetivo

En la pantalla de resultados, mostrar qué opción eligió la persona para cada pregunta y distinguir sus respuestas correctas e incorrectas. Mantener visibles la respuesta correcta y la explicación cuando estén disponibles. Aplicar la revisión a simulación real, tanto con preguntas de IA como con Práctica avanzada, y a práctica guiada.

## Situación actual

- La sesión activa guarda las preguntas, el número de intentos y el resultado (`first_try`, `retry`, `incorrect` o `revealed`), pero no los IDs de las opciones elegidas. Por ello, las elecciones de sesiones previas no pueden recuperarse.
- En simulación real, al responder se avanza automáticamente; la respuesta final incluye las preguntas, respuestas correctas y explicaciones disponibles. Las respuestas correctas no se entregan antes de terminar.
- En práctica guiada pueden existir varios intentos y se puede revelar una respuesta. El resultado considera la puntuación al primer intento y distingue reintentos y respuestas reveladas. Actualmente la hoja imprimible incluye pregunta y respuesta correcta, pero la pantalla no presenta la revisión individual.
- El estado completado en PostgreSQL descarta las preguntas; el historial conserva agregados. La revisión avanzada se mantiene solo durante la visita; la simulación normal conserva el último resultado temporalmente en el cliente durante la visita.

## Diseño propuesto

1. En el estado de cada pregunta activa, guardar en orden los IDs de las opciones que se enviaron, con un máximo acorde a los intentos ya permitidos. Validar que cada ID corresponda a la pregunta. El estado antiguo sin esa lista seguirá siendo válido; no inventar selecciones que no se guardaron. Si una pregunta anterior tenía intentos y luego recibe otros tras actualizar, conservar los nuevos pero marcar el historial como incompleto y mantener la numeración real.
2. Generar la información de revisión en el servidor al finalizar: texto de cada selección y si fue correcta, respuesta correcta, resultado de la pregunta y explicación disponible. En real habrá un intento; en práctica se distinguirán primer intento, reintentos y revelación sin tratar una respuesta revelada como selección correcta. Si se reveló sin responder, indicarlo explícitamente. Mantener la puntuación existente.
3. Extender de forma compatible el contrato compartido de la respuesta final. Los campos nuevos serán opcionales para aceptar respuestas y sesiones anteriores; la UI mostrará «selección no disponible» si falta la información histórica. Mantener las claves y correcciones fuera de las respuestas de simulación real hasta su finalización.
4. Adaptar la revisión actual de resultados para ambas modalidades: mostrar pregunta, selección o selecciones con etiquetas accesibles de correcta/incorrecta, respuesta correcta cuando corresponda y explicación. Usar textos en español e inglés y conservar el idioma inglés de las preguntas avanzadas. No depender solo del color para indicar el resultado; mantener contraste y navegación con teclado en modo claro y oscuro.
5. Conservar la generación de explicaciones avanzadas en segundo plano, sus reintentos y su aviso de retención temporal. Mantener la hoja imprimible actual sin añadir selecciones por defecto, y no agregar respuestas individuales al historial ni al estado completado. El estado activo ya se almacena en JSON: no se prevé migración SQL.

La decisión de representación y retención se documenta en el [ADR 0004](../decisions/0004-simulation-answer-review.md), aceptado explícitamente por el usuario.

## Aceptación y validación

- Una simulación real terminada muestra las 20 selecciones, identifica las correctas e incorrectas y muestra cada respuesta correcta; esto funciona para ambas fuentes. Antes de terminar no se revela la clave ni la corrección.
- Al retomar una sesión activa nueva, se conservan las selecciones anteriores; en una sesión creada antes del cambio se indica cuándo no están disponibles. Si una pregunta tiene intentos tanto anteriores como posteriores a la actualización, se identifican los intentos faltantes sin atribuir los nuevos al primer intento. No se inventan datos.
- En práctica guiada, se muestran los intentos en orden y se distinguen reintentos, selección incorrecta y respuesta revelada; el marcador y el puntaje al primer intento permanecen iguales.
- La revisión funciona con ambos idiomas y temas, sin depender exclusivamente del color. El historial y los snapshots completados siguen sin contener preguntas o respuestas individuales. Se conservan los límites de propiedad y retención de la revisión avanzada.
- Añadir pruebas de contrato y de integración PostgreSQL para respuestas correctas e incorrectas, reanudación, varios intentos, revelación sin selección, sesión antigua y ausencia de claves antes de terminar; pruebas de renderizado para ambos idiomas y estados. Ejecutar `bun run typecheck`, `bun run build` y las pruebas pertinentes. Revisar en navegador el diseño y accesibilidad si el entorno lo permite.

## Secuencia y reversión

Tras la aprobación: actualizar estado y contratos; construir el resultado final y adaptar la UI; ejecutar las validaciones y registrar los resultados reales. Una reversión puede dejar las elecciones adicionales en JSON de sesiones activas, pero debe comprobar compatibilidad con la versión anterior y no eliminar historial ni resultados.

## Validación realizada

- `bun run typecheck` y `bun run build` pasaron.
- Pasaron 18 pruebas específicas de simulaciones normales y avanzadas y de la revisión renderizada; incluyen PostgreSQL temporal, reanudación, intentos antiguos incompletos, respuestas correctas e incorrectas, respuestas reveladas y ausencia de correcciones antes del final.
- Pasaron otras 12 pruebas de práctica de temas débiles, cobertura de temas y acceso al resultado temporal.
- No se ejecutó una revisión visual o de navegación en un navegador. El usuario aceptó explícitamente el ADR 0004.
