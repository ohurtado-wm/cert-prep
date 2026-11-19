# Plan técnico: Práctica avanzada para Professional Cloud Developer

**Estado: Aprobado — implementación en curso; mapeo automático habilitado por autorización del usuario.**

## Objetivo y decisiones confirmadas

Agregar **Práctica avanzada** para `gcp-professional-cloud-developer`, utilizando preguntas de seis archivos Markdown facilitados por el usuario. La opción actual de preguntas generadas con IA permanece disponible.

- La práctica avanzada funciona **solo en simulación real**, sin cronómetro: un intento por pregunta y respuestas correctas visibles únicamente al finalizar.
- El control de Práctica avanzada está desactivado por defecto y solo se puede habilitar si **Simulación real** está activada. Al desactivar Simulación real, también se desactiva automáticamente Práctica avanzada. Con el control avanzado apagado se usa IA para generar las preguntas; con él encendido se usa el banco estático.
- En **ambas simulaciones reales**, la persona verá al finalizar cada pregunta, su respuesta correcta y una explicación breve generada con IA. Los resultados y las respuestas aparecen inmediatamente. En la simulación normal se reutilizan las explicaciones ya generadas junto con las preguntas; en Práctica avanzada las explicaciones se generan en segundo plano con un indicador por pregunta. Si falla una explicación, se conserva la respuesta correcta y se ofrece un botón para generarla de nuevo individualmente.
- Las preguntas del banco están en inglés. La interfaz permanece en el idioma seleccionado y se indica que este modo solo está disponible con preguntas en inglés. Google Cloud informa que el examen oficial se ofrece en inglés y japonés, no en español: [Professional Cloud Developer](https://cloud.google.com/learn/certification/cloud-developer?hl=es-419).
- En Práctica avanzada, la revisión completa solo está disponible al finalizar, durante la visita. Un aviso indica que al salir no se podrá consultar nuevamente. El historial conserva los resultados agregados y distingue Práctica avanzada de las simulaciones generadas con IA. Está pendiente confirmar si esa restricción también sustituirá el acceso temporal existente a resultados y preguntas de la simulación normal.
- El usuario confirmó que tiene autorización para reproducir las preguntas internamente y pidió mantener el aviso y crédito detallados más abajo.

## 1. Flujo actual y restricciones

- El inicio permite elegir certificación y `mode: practice | real`. Ambas modalidades generan actualmente 20 preguntas con IA. En real se responde una vez y se avanza; en práctica guiada se puede reintentar o revelar una respuesta con explicación.
- No existe cronómetro de examen ni navegación libre entre preguntas anteriores. Mantener esos comportamientos actuales; el contador de carga de IA no es un temporizador de examen.
- `allocateQuestionsByWeight` calcula cuotas por dominio mediante la parte entera y los mayores restos, con el orden de la guía como desempate. `allocateQuestionsByTopic` reparte cada cuota entre temas y asigna el resto según exposición reciente e ID. Ambas funciones están en `apps/api/src/simulations/question-validation.ts` y **no se modificarán para redistribuir la cobertura**.
- La guía procede de la aplicación y puede renovarse. En la base local consultada, la versión 1 del 18 de noviembre de 2026 tenía pesos **32/23/24/21**, que producen **6/5/5/4** preguntas para 20. Son una observación del entorno local, no valores fijos para otros entornos o versiones.
- La sesión activa contiene preguntas y claves en el servidor. Al completar, el estado almacenado elimina las preguntas y conserva el resultado; la respuesta final entrega una hoja imprimible. El historial guarda agregados, no las preguntas ni explicaciones.
- El modo real actual no muestra una revisión individual en pantalla. El usuario confirmó que la nueva revisión estará disponible tanto para la simulación real normal como para Práctica avanzada. Las preguntas generadas por IA ya contienen explicaciones, que deben reutilizarse al finalizar.

## 2. Experiencia propuesta

En el inicio, mostrar el control **Práctica avanzada** únicamente para la certificación indicada y mantenerlo desactivado y sin seleccionar por defecto. Solo se habilita después de activar **Simulación real**; al desactivar Simulación real, se apaga y vuelve a quedar deshabilitado. Seleccionar Práctica avanzada nunca debe activar Simulación real de forma implícita. Al cambiar a una certificación no compatible se desactiva la opción avanzada. La fuente es IA con el control apagado y el banco estático con el control encendido. El servidor también debe rechazar combinaciones de fuente y modo no admitidas, incluso si se envían directamente.

Al elegir Práctica avanzada, mostrar el aviso de procedencia, crédito, enlace e idioma antes de iniciar. Con interfaz en español, controles, mensajes y resultados permanecen en español; preguntas y opciones permanecen en inglés. Identificar el idioma del contenido para accesibilidad. La selección y la reanudación deben conservar fuente y modo sin sustituir una sesión activa sin la confirmación existente.

La guía, sus categorías y cobertura siguen siendo la fuente de verdad. El origen de preguntas no cambia el cálculo del resultado, la retención de historia, los límites de inicio ni el aislamiento por usuario. La guía puede requerir su propio proceso de preparación existente; el banco avanzado no usa IA para generar ni completar preguntas.

## 3. Selección y cobertura

1. Obtener la guía vigente para la certificación y calcular las cuotas exactas por dominio y por tema mediante las funciones actuales, incluidas las reglas de historial y desempate existentes.
2. Cargar desde el servidor exclusivamente las preguntas del banco cuyo mapeo revisado corresponda a la estructura de la guía. Usar identificadores estables de banco y conservar los originales sin modificarlos.
3. Comprobar que cada tema con cuota positiva tiene al menos esa cantidad de preguntas elegibles y distintas. Seleccionar aleatoriamente sin reemplazo dentro de cada tema y mezclar el conjunto de 20; evitar el mismo enunciado normalizado dentro de un intento.
4. Validar que el total sea exactamente 20 y que las cuotas por dominio y tema coincidan. Conservar el balanceo de posiciones de respuesta y las demás validaciones aplicables, sin enviar claves al navegador antes de finalizar.
5. Si el mapeo, la versión o la capacidad son insuficientes, rechazar el inicio con un error recuperable y conservar la sesión pendiente. No cambiar cuotas, no reasignar preguntas silenciosamente y no usar IA como fuente alternativa.

Un mapeo por dominio no garantiza capacidad por tema. Debe auditarse cada pregunta contra temas de la guía y conservar la evidencia de revisión antes de activar el modo. La renovación de la guía requiere una comprobación de compatibilidad del mapeo —incluidos cambios de nombres, significado y temas, no solo IDs— y debe bloquear la selección hasta que se revise si la estructura cambió.

## 4. Inventario y mapeo propuesto

Los archivos `gcp-professional-cloud-developer-quiz-test #1.md` a `#6.md` están en la carpeta de documentos facilitada y tienen 170 preguntas numeradas cada uno. La inspección encontró 1.020 enunciados normalizados distintos, cuatro opciones A–D, una respuesta correcta coincidente con la opción marcada y ningún campo separado de explicación. Esto no valida la calidad técnica ni descarta duplicados semánticos.

| Etiqueta del banco | Cantidad | Porcentaje observado | Candidato de la guía local | Peso local |
|---|---:|---:|---|---:|
| `Designing highly scalable, available, and reliable cloud-nat` | 360 | 35,29 % | `section-1`: diseño de aplicaciones cloud-native | 32 % |
| `Building and testing applications` | 192 | 18,82 % | `section-2`: construcción y pruebas | 23 % |
| `Deploying applications` | 215 | 21,08 % | `section-3`: configuración para despliegue | 24 % |
| `Integrating applications with Google Cloud services` | 253 | 24,80 % | `section-4`: integración con servicios | 21 % |

La primera etiqueta está truncada; estas correspondencias son propuestas, no una clasificación aprobada de cada pregunta. Los archivos no contienen IDs de tema de la aplicación. El curso declara 36/23/20/21 en el orden anterior; la diferencia frente al banco y la guía se documenta, sin sustituir la configuración vigente. [Curso de Udemy](https://www.udemy.com/course/google-cloud-platform-professional-cloud-developer-practice-exams/).

## 5. Diseño técnico propuesto

- Mantener `mode: practice | real` y agregar una fuente separada, por ejemplo `questionSource: ai | advanced`, a solicitud, snapshot y estado activo. La fuente ausente en solicitudes o estados anteriores se interpreta como `ai`; validar que `advanced` solo acepte `real` y la certificación habilitada.
- Incorporar la fuente a `simulation_results` con migración PostgreSQL y valor predeterminado compatible para los resultados existentes. Exponerla en el contrato de historial para identificar las tarjetas. No agregar preguntas, respuestas ni explicaciones al historial.
- Incorporar un cargador y validador en `apps/api/src/` y un manifiesto de mapeo revisado. Asegurar que el empaquetado y Docker incluyan los datos solo del lado del servidor; nunca colocarlos en `apps/web/public` ni en el bundle del cliente. No distribuir el banco fuera del alcance autorizado.
- La estructura existente exige `focus`, `service` y `explanation`. Definir metadatos de clasificación únicamente cuando estén sustentados; adaptar los esquemas para la ausencia de explicación y de metadatos no disponibles sin inventarlos. La validación del generador actual debe seguir exigiendo sus explicaciones, y los resultados y análisis no deben atribuir focos ficticios.
- Separar idioma del contenido y de la interfaz para el modo avanzado. El idioma registrado de las preguntas será inglés; los controles de la app seguirán el idioma seleccionado. Los modos anteriores conservan su comportamiento.
- Al terminar la última respuesta de cualquiera de las dos simulaciones reales, confirmar el resultado y devolver solo entonces las preguntas, respuestas y explicaciones disponibles para la revisión común. En la simulación normal, reutilizar las explicaciones ya generadas y no solicitar otras de forma innecesaria; en Práctica avanzada, mostrar el resultado sin esperar la IA y solicitar explicaciones en segundo plano. Validar la entrega, el reintento y el fallo parcial sin impedir ver la respuesta correcta.
- Para regeneración individual, proponer un contexto temporal en memoria del servidor, asociado al usuario y sesión completada, que identifique solo las preguntas seleccionadas en el banco. Los endpoints deberán autenticar, verificar propietario, sesión completada y pertenencia de la pregunta; aplicar límites de tamaño, concurrencia, tiempo y reintentos para evitar abuso y llamadas duplicadas. No aceptar preguntas arbitrarias del cliente ni exponer contenido de otros usuarios.
- La revisión avanzada y sus explicaciones viven solo en memoria durante la visita; al salir se descartan y se solicita limpiar el contexto temporal. Ante cierre inesperado se usa expiración acotada. Un reinicio del proceso o una expiración puede impedir regenerar explicaciones: mostrar un error recuperable durante la visita sin perder las respuestas ya mostradas. No recuperar la revisión avanzada desde historial o después de recargar. El acceso temporal existente de la simulación normal queda sujeto a la aclaración indicada abajo.
- No registrar preguntas, opciones, respuestas, prompts ni respuestas del modelo. Utilizar el proveedor y las opciones de privacidad existentes, sin agregar un backend independiente. Mantener `/api/*` en el mismo origen y validar entradas y salidas con Zod.

La fuente en contratos y datos, el contexto temporal y la nueva llamada de IA requieren documentar una decisión técnica con el skill `record-adr`. El ADR deberá presentarse como **propuesto**; su aceptación requiere aprobación explícita.

## 6. Validación de datos y errores

El cargador debe detectar archivos ausentes o duplicados, bloques incompletos, numeración incorrecta, enunciados vacíos, opciones distintas de A–D, opciones repetidas, letra o texto de respuesta inconsistente, etiquetas desconocidas y duplicados normalizados. Los reportes de mantenimiento podrán identificar archivo y número, sin registrar contenidos ni claves.

Revisar técnicamente las respuestas con documentación oficial antes de habilitar el banco. Verificar que el contenido no oficial no se describa como procedente del examen de Google. Los fallos de carga, mapeo, cobertura o IA deben tener mensajes bilingües claros; una explicación fallida no debe bloquear la puntuación ni ocultar la respuesta correcta.

## 7. Procedencia y advertencia

Mostrar antes del inicio el texto solicitado y su equivalente en inglés:

> Este modo utiliza preguntas de práctica del curso *Google Cloud Platform Professional Cloud Developer Practice Exams*, creado por Nex Arc y publicado en Udemy. El curso indica que las preguntas imitan la dificultad, el formato y la cobertura del examen; no se presentan como material oficial de Google. Úsalas como práctica complementaria y verifica los conceptos con la documentación oficial de Google Cloud.

Incluir [el enlace al curso](https://www.udemy.com/course/google-cloud-platform-professional-cloud-developer-practice-exams/) y crédito **Nex Arc — Udemy**. La autorización de reproducción interna fue confirmada por el usuario; el crédito por sí solo no constituye autorización de uso ni redistribución adicional.

## 8. Criterios de aceptación

1. Práctica avanzada aparece solo para Professional Cloud Developer y está desactivada por defecto. Solo se puede habilitar si Simulación real está activa; al apagar Simulación real se desactiva automáticamente. La opción avanzada nunca activa el modo real por sí misma y se desactiva al cambiar a una certificación no compatible.
2. Cada intento usa 20 preguntas distintas de los seis archivos y respeta exactamente las cuotas actuales por dominio y tema. No existe redistribución silenciosa ni generación de preguntas con IA.
3. El aviso de procedencia e idioma aparece antes de iniciar. La interfaz puede estar en español con preguntas en inglés; el texto sobre el examen oficial menciona inglés y japonés.
4. En ambas simulaciones reales no se muestran respuestas correctas ni explicaciones antes de completar. Los resultados, las 20 preguntas y sus respuestas correctas aparecen inmediatamente al finalizar, con la misma revisión en pantalla.
5. La simulación normal reutiliza las explicaciones ya generadas. Las explicaciones avanzadas se generan en segundo plano con indicador individual. Si una falla, se mantiene visible la respuesta correcta y se ofrece un reintento para esa pregunta, sin bloquear el resto.
6. En Práctica avanzada, un aviso explica que la revisión no podrá verse después de salir. No se guarda la revisión completa en el historial ni se recupera al recargar; los resultados agregados sí identifican la fuente avanzada. La retención temporal de la simulación normal queda pendiente de la aclaración siguiente.
7. Sesiones, usuarios y resultados antiguos conservan compatibilidad. La fuente se reanuda correctamente y las rutas de explicación verifican usuario, sesión y pregunta, con controles de consumo.
8. Fallos de autorización de datos, mapeo, guía renovada, capacidad insuficiente o banco inválido impiden iniciar sin borrar una sesión pendiente. No se incluyen claves en el cliente antes del final.
9. Con Práctica avanzada desactivada, las preguntas provienen del generador de IA; con ella activada, provienen del banco. Ambas opciones siguen las mismas reglas de Simulación real y no tienen cronómetro.

## 9. Riesgos, validación y fases

**Riesgos:** la clasificación por tema requiere revisión humana y puede descubrir capacidad insuficiente; las explicaciones de IA pueden ser incorrectas o fallar y deben identificarse como generadas; la guía renovada puede invalidar el mapeo; el contexto temporal desaparece ante reinicios; y la disponibilidad en inglés puede resultar incómoda con la interfaz en español. El usuario confirmó la autorización de reproducción interna y solicitó expresamente usar IA para las explicaciones; el diseño debe respetar las protecciones de datos y privacidad existentes al enviar las preguntas seleccionadas al proveedor.

**Alcance por aclarar:** la revisión con explicaciones ya está confirmada para ambas simulaciones reales. Actualmente la simulación normal permite volver a abrir el último resultado y su hoja imprimible desde Tu progreso durante la visita; confirmar si se elimina ese acceso para ambas fuentes al salir, o si se conserva solo para la normal.

**Fases:**

1. Clasificar y verificar las 1.020 preguntas y auditar capacidad por tema para la guía vigente. Preparar el ADR como propuesta y no marcarlo aceptado sin aprobación explícita.
2. Implementar parser, manifiesto y selección con las cuotas existentes; comprobar compatibilidad de guías y comportamiento ante errores.
3. Implementar contratos, estado, migración y datos de historial con compatibilidad hacia atrás y aislamiento de propietario.
4. Implementar revisión temporal, explicaciones en segundo plano y reintentos individuales con límites, limpieza y manejo de expiración.
5. Integrar interfaz bilingüe, advertencias y estados; ejecutar typecheck, build, pruebas unitarias y de integración PostgreSQL, y revisión manual de accesibilidad y navegación.

Las pruebas deben usar datos ficticios y un generador de explicaciones simulado, sin llamadas pagadas ni exposición de contenido privado. Cubrir selección sin reemplazo y cuotas exactas, guías incompatibles, ausencia de capacidad, claves ocultas, cambio de usuario, finalización sin espera, fallos parciales, límites, limpieza al salir y migración de resultados anteriores. Registrar únicamente validaciones ejecutadas.

**Reversión:** deshabilitar la fuente avanzada y revertir interfaz y rutas; mantener legibles los resultados históricos, tratando la fuente en versiones anteriores de forma compatible. Planificar explícitamente la reversión de migraciones y la limpieza del contexto temporal sin eliminar resultados del usuario.

## Aprobación

El usuario aprobó la implementación. La aceptación del ADR requiere aprobación explícita por separado. La decisión sobre conservar el acceso temporal existente de la simulación normal permanece pendiente.

## Avance y validación

- Se implementaron los contratos de fuente, migración, historial, selección avanzada por cuotas, controles y advertencia, revisión para ambos modos reales y explicaciones avanzadas temporales con reintentos. El ADR 0003 está propuesto.
- Los seis archivos se copiaron sin cambiar sus contenidos. Inicialmente se generó un mapeo propuesto para la guía local con `reviewed: false`.
- La propuesta revisable está en [advanced-practice-question-mapping-review.csv](advanced-practice-question-mapping-review.csv). `bank-<archivo>-<pregunta>` identifica el Markdown y su número de pregunta; `suggested_topic_id` y `alternative_topic_id` son sugerencias automáticas, no una garantía. La persona revisora debe indicar el tema comprobado en `confirmed_topic_id` y marcar `reviewed` solo después de revisar cada pregunta. Una vez completado, el manifiesto del servidor deberá actualizarse y validarse contra la guía vigente y sus cuotas antes de habilitarse.
- Se verificó un ejemplo concreto de incompatibilidad: `bank-1-23` viene etiquetada por el curso en el dominio de construcción y pruebas, pero pregunta sobre un despliegue canario en Cloud Run; la guía vigente trata ese contenido en despliegue y resiliencia. Por ello, copiar las propuestas automáticas sin revisión no acredita las cuotas solicitadas. El manifiesto incluye además una huella de las preguntas, opciones y respuestas: si el banco cambia después de su revisión, el inicio queda bloqueado hasta volver a comprobarlo.
- `bun run typecheck` y `bun run build` pasaron. La ejecución más reciente de `bun test` pasó con 130 pruebas, incluidas pruebas PostgreSQL con datos ficticios y explicaciones simuladas. Ejecuciones anteriores tuvieron un fallo intermitente en la prueba de concurrencia de actualización de guías y un error no capturado; la prueba de guías pasó por separado y la suite completa posterior terminó sin errores.
- No se ejecutaron llamadas reales de IA ni una revisión interactiva en navegador. La migración se probó en bases temporales; no se aplicó a la base de la aplicación.

### Autorización posterior para habilitar el mapeo

- El usuario indicó expresamente que se podía marcar el mapeo como revisado. Se habilitó la propuesta automática con `reviewed: true` por esa instrucción, sin atribuirle una revisión individual o humana de las 1.020 preguntas ni una comprobación técnica de todas las respuestas. Las indicaciones anteriores sobre revisión previa reflejan el plan original y quedan sustituidas por esta autorización.
- Se verificó que la huella del banco coincide, que la guía almacenada localmente coincide con el mapeo y que las cuotas de los 17 temas pueden satisfacerse en escenarios que favorecen cada tema. Esto comprueba capacidad, no exactitud semántica. Se conoce al menos una etiqueta de dominio del curso que no corresponde al contenido de la pregunta (`bank-1-23`).
- Se aplicó la migración aditiva de fuente de preguntas a la base local. La validación de las respuestas contra fuentes oficiales y la revisión interactiva en navegador siguen pendientes.

### Cambios posteriores al code review

- Se permite verificar una guía renovada frente a la guía de referencia: primero se normalizan diferencias de espacios y, si hay cambios de contenido, una llamada de IA compara los nombres y descripciones de dominios y temas sin recibir preguntas, respuestas ni claves del banco. Las asociaciones inciertas se excluyen y no se inicia si las preguntas restantes no cubren las cuotas originales. La compatibilidad se conserva en memoria por proceso; una guía incompatible o una falla del proveedor sigue impidiendo el inicio. Esta comprobación automática no garantiza equivalencia semántica y no valida las preguntas del banco.
- Se corrigieron 57 asignaciones detectadas durante la inspección, incluida `bank-1-23`, y se incorporaron excepciones explícitas para preguntas cuya etiqueta original de dominio no coincide con su contenido. Además se ajustaron mediante reglas otras 68 asignaciones de seguridad y pruebas. El mapeo sigue siendo en buena parte automático y no representa una revisión individual completa.
- Al volver a abrir un resultado previo generado con IA, se restablece su fuente para que reiniciar no utilice inadvertidamente el banco avanzado.

### Correcciones adicionales de clasificación

- Se reasignaron 150 preguntas adicionales de despliegues, seguridad, pruebas, APIs, observabilidad, datos y tareas asíncronas, entre ellas `bank-4-140` y `bank-1-160`. Se comprobaron las preguntas previamente asignadas a configuración de receptores y acceso a APIs y se sustituyeron las asignaciones incompatibles por preguntas sobre configuración de APIs.
- La mayoría de las preguntas propuestas para publicar y consumir mensajes trata de Cloud Tasks; se reclasificaron como trabajo asíncrono. Solo `bank-5-47` cubre claramente la entrega y consumo mediante una suscripción de Pub/Sub. La guía local solicita una pregunta de ese tema, por lo que puede completarse, pero esa pregunta se repetirá en cada simulación. Si una guía requiere más preguntas de ese tema, el inicio falla sin alterar las cuotas.
- Las correcciones combinan inspección y reglas; no se ha comprobado individualmente la clasificación de todas las preguntas ni la exactitud técnica de sus respuestas. El mapeo original automático sigue habilitado por autorización del usuario.
