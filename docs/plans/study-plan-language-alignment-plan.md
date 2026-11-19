# Plan: alinear el idioma del plan de estudio

**Estado: Aprobado e implementado — revisión manual y de integración pendientes.**

## Objetivo

Evitar que un plan guardado en otro idioma se presente sin explicación y reducir la posibilidad de guardar recomendaciones generadas en un idioma distinto del solicitado.

## Contexto confirmado

- La generación envía el idioma seleccionado y solicita a la IA que lo use en todas las frases. El servidor comprueba que el campo `language` coincida con la solicitud, pero no determina el idioma del texto generado.
- `GET /api/v1/study-plans/latest` devuelve el último plan del usuario y la certificación, sin filtrar por idioma. El panel muestra el contenido guardado y su indicador `EN` o `ES`, aunque haya cambiado el idioma de la interfaz.
- Los planes incluyen texto generado, nombres localizados de dominios y temas, métricas calculadas por el servidor y enlaces de la guía. El historial de simulaciones puede aportar nombres de tecnologías y focos en cualquiera de los dos idiomas.
- Regenerar crea un plan nuevo basado en el historial reciente y utiliza la IA. No traduce literalmente el plan anterior y puede consumir tokens.

## Alcance propuesto

1. En Plan de estudio, si el idioma del plan guardado difiere de la preferencia actual, mostrar un aviso en el idioma de la interfaz que explique la diferencia y que **Regenerar plan** generará nuevas recomendaciones en el idioma seleccionado. Mantener visible el plan existente, identificar el idioma de su contenido y conservarlo si la generación falla. No iniciar generación automáticamente.
2. Indicar explícitamente al modelo el idioma solicitado por nombre y por código. Pedir que el resumen, títulos, justificaciones y acciones estén en ese idioma, conservando nombres de productos, siglas y términos técnicos cuando corresponda. Los IDs, fuentes y métricas siguen bajo control del servidor.
3. Añadir una comprobación conservadora del idioma del texto generado antes de guardar: detectar únicamente evidencia suficiente de prosa predominantemente en el idioma opuesto, considerando el texto generado en conjunto y sin tratar nombres propios o términos técnicos aislados como errores. Si se detecta una discrepancia clara, rechazar el resultado mediante el error recuperable existente y ofrecer reintento; no guardar ni registrar el texto. Esta comprobación es heurística: no garantiza detectar todas las mezclas ni convierte un modelo en traductor infalible.
4. Aplicar los mensajes y estados en español e inglés. Si el idioma cambia durante una generación, mostrar el aviso si el plan recibido ya no coincide con la selección actual.

## Fuera de alcance

- Traducir automáticamente planes existentes o modificar su contenido guardado.
- Recuperar el último plan por idioma, modificar endpoints, contratos, esquema, migraciones o agregar dependencias.
- Generar o reintentar automáticamente con IA, agregar llamadas de verificación de pago o garantizar detección perfecta del idioma.

## Criterios de aceptación

1. Un plan en inglés con la interfaz en español, y el caso inverso, muestran un aviso comprensible y permiten regenerar explícitamente. Un plan del idioma seleccionado no muestra el aviso.
2. La acción de regeneración envía el idioma seleccionado al momento de iniciarla. El plan anterior sigue accesible si la solicitud falla, sin crear solicitudes adicionales al cambiar preferencias.
3. El prompt solicita explícitamente el idioma correcto para todos los campos narrativos y permite nombres oficiales y términos técnicos.
4. Con evidencia clara de prosa inglesa para una solicitud en español, y viceversa, la API rechaza el resultado antes de persistirlo. Texto correcto con siglas, nombres de servicios o términos técnicos del otro idioma no se rechaza por ese motivo. Los casos ambiguos no se consideran un error de idioma de forma automática.
5. Las reglas existentes de métricas, recursos oficiales, propiedad de usuario y validación de contratos permanecen intactas.
6. Las pruebas no requieren llamadas reales a IA ni registran contenido generado o datos privados.

## Implementación y validación

- `apps/web/src/components/StudyPlanPanel.tsx`, `apps/web/src/i18n/messages.ts` y `apps/web/src/styles.css`: aviso accesible, bilingüe y coherente con los estados de carga y error existentes.
- `apps/api/src/study-plans/plan-generator.ts`: instrucciones explícitas por idioma. `apps/api/src/study-plans/` y `apps/api/src/use-cases/study-plan-service.ts`: comprobación conservadora de prosa generada antes de guardar, sin afectar IDs ni contenido oficial.
- Pruebas de presentación para ambos idiomas, coincidencias y diferencias, generación pendiente y error. Pruebas unitarias de detección para español, inglés, texto mixto, evidencia insuficiente y nombres técnicos; pruebas de servicio con generador simulado para confirmar rechazo sin persistencia cuando haya PostgreSQL disponible.
- Ejecutar `bun run typecheck`, `bun run build` y pruebas pertinentes. Ejecutar las pruebas de integración solo si existe `TEST_DATABASE_URL` apropiado; documentar cualquier validación visual o integración pendiente y no afirmar resultados no ejecutados.

## Riesgos y reversión

- Las heurísticas pueden no detectar algunas respuestas incorrectas o rechazar prosa válida: usar un umbral conservador, probar ejemplos realistas y comunicar errores sin perder el plan previo.
- Un cambio de idioma durante una solicitud puede dejar un plan válido en otro idioma: el aviso debe comparar contra la preferencia vigente, no contra el idioma al iniciar la solicitud.
- Revertir los cambios de interfaz, prompt y validación restaura el comportamiento anterior sin migraciones ni modificación de planes guardados.

## Aprobación

El usuario aprobó la implementación del plan.

## Evidencia de implementación

- El panel avisa si el plan guardado y el idioma seleccionado son distintos; conserva el plan anterior y no dispara una generación automática. Las partes generadas identifican su idioma para lectores de pantalla.
- El prompt identifica el idioma y los campos narrativos; una validación conservadora rechaza evidencia clara de prosa en el idioma opuesto antes de guardar. No se agregaron dependencias ni llamadas de IA.
- `bun run typecheck` y `bun run build` finalizaron correctamente. Pasaron 23 pruebas seleccionadas del panel, comprobación de idioma, prompt y datos bilingües.
- Se añadió una prueba de integración para rechazar ambos idiomas incorrectos sin reemplazar un plan previo, pero no se ejecutó porque `TEST_DATABASE_URL` no estaba configurado. No se ejecutaron llamadas reales a IA ni revisión interactiva en navegador.
