# Plan de implementación: ampliar certificaciones de Google Cloud

**Estado:** PR-01 y P2-T01–T04 integrados en `main` mediante PR #15; PR-02 completo en la rama local `codex/gcp-certifications-pr02`, pendiente de revisión.
**Última actualización:** 2026-10-05

## Objetivo

Ampliar el catálogo activo a cinco certificaciones profesionales: conservar Professional Cloud Developer y agregar Cloud Architect, Cloud Database Engineer, Data Engineer y Cloud DevOps Engineer. Cada una debe tener recursos oficiales, guía bilingüe generada con IA, simulaciones, historial y planes asociados a un ID estable.

## Estado actual

- El catálogo de cinco certificaciones y el recorrido por `certificationId` están integrados en `main` mediante PR #15.
- La guía se cachea 30 días y se renueva bajo demanda mediante una lease por certificación.
- El modelo no tenía navegación web. El antiguo lector HTML solo manejaba Cloud Developer y no estaba conectado al servicio de generación.
- El esquema PostgreSQL ya tiene `sourceHash`, `sourceSnapshot` y `lastSourceCheckedAt`; no se anticipa migración.
- La rama `codex/gcp-certifications-pr02` agrega el bloqueo del selector mientras se consulta la guía o se inicia una simulación, toma el nombre de certificación desde la sesión activa y refuerza las instrucciones bilingües para generar simulaciones alineadas al examen sin copiar preguntas oficiales.

## Decisión de implementación

- Usar el proveedor OpenAI Responses con la herramienta alojada `web_search` y exigir una búsqueda en cada generación o renovación de guía.
- Reutilizar guías preexistentes durante su TTL de 30 días aunque todavía no tengan citas guardadas; incorporar las citas en la siguiente renovación exitosa. Solo las guías sin fecha de generación o con 30 días o más requieren renovación.
- Restringir la búsqueda a `cloud.google.com`, `services.google.com`, `skills.google` y `cloudskillsboost.google`. El modelo recibe los enlaces oficiales del catálogo, incluida la URL de la guía del examen aunque sea PDF.
- La aplicación no descarga, extrae ni parsea PDFs. OpenAI lee el contenido durante la búsqueda; el servidor guarda las URLs citadas, una huella estable y la fecha de consulta.
- Rechazar la publicación cuando no haya una cita al exam guide o a la página oficial de la certificación. Mostrar los enlaces citados en la interfaz.
- Permitir porcentajes fraccionarios, validar números de sección únicos y exigir que los pesos sumen 100%. No hay una comparación local contra el documento; las citas permiten revisar la salida, pero la lectura del modelo puede equivocarse.
- Conservar generación bajo demanda y caché de 30 días. La búsqueda añade costo y latencia a la generación de cada guía, no a cada simulación.

## Certificaciones y URLs oficiales

| ID | Certificación | Guía | Certificación | Ruta de aprendizaje |
|---|---|---|---|---|
| `gcp-professional-cloud-developer` | Professional Cloud Developer | [Exam guide](https://cloud.google.com/learn/certification/guides/cloud-developer) | [Certificación](https://cloud.google.com/learn/certification/cloud-developer) | [Ruta](https://www.skills.google/paths/19) |
| `gcp-professional-cloud-architect` | Professional Cloud Architect | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-architect) | [Ruta](https://www.skills.google/paths/12) |
| `gcp-professional-cloud-database-engineer` | Professional Cloud Database Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_database_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-database-engineer) | [Ruta](https://www.skills.google/paths/22) |
| `gcp-professional-data-engineer` | Professional Data Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/data-engineer) | [Ruta](https://www.skills.google/paths/16) |
| `gcp-professional-cloud-devops-engineer` | Professional Cloud DevOps Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_devops_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-devops-engineer) | [Ruta](https://www.skills.google/paths/20) |

## Estado de los PRs

| PR | Alcance | Estado | Gate |
|---|---|---|---|
| `PR-01` | Búsqueda oficial obligatoria, verificación de citas, snapshot y pesos fraccionarios | Integrado mediante PR #15 | Suite completa con generadores falsos; no se hicieron llamadas reales a OpenAI |
| `PR-02` | Catálogo de cinco certificaciones, recorrido por ID e instrucciones operativas | Implementado; cambios finales en `codex/gcp-certifications-pr02` | Catálogo, guías por ID, recorrido, bloqueo durante IA y prompt bilingüe de simulación; falta abrir el PR |

## PR-01: Generación basada en búsqueda oficial

### Tareas

- [x] `P1-T01` Configurar OpenAI Responses con `web_search` obligatorio y allowlist de dominios oficiales de Google.
- [x] `P1-T02` Enviar al modelo los enlaces oficiales del exam guide, la certificación y la ruta; pedir números y porcentajes del examen sin redondear ni redistribuir.
- [x] `P1-T03` Extraer solo las citas URL devueltas por web search, validarlas contra HTTPS y la allowlist, y requerir una cita al exam guide o a su página oficial.
- [x] `P1-T04` Persistir citas, hash de citas y fecha de consulta en las columnas existentes; exponerlas en la API y mostrarlas como enlaces.
- [x] `P1-T05` Admitir pesos decimales en las guías y mantener la asignación proporcional de preguntas.
- [x] `P1-T06` Eliminar el lector local desconectado y actualizar README y contexto consolidado.

### Validación

- [x] Typecheck y build.
- [x] Pruebas puras: allowlist y citas del prompt; asignación y rechazo de pesos fraccionarios inválidos.
- [x] Pruebas de integración del servicio y catálogo ejecutadas contra PostgreSQL temporal; los generadores son falsos.
- [x] Generadores falsos cubren en código: fuentes oficiales guardadas, fuente externa rechazada, peso fraccionario, suma inválida, caché/renovación y preservación de la última guía válida.
- [x] No se hicieron llamadas reales ni pagadas a OpenAI; la integración real se valida con el uso normal del usuario y las fuentes citadas en pantalla.

## PR-02: Catálogo y recorrido

### Tareas

- [x] `P2-T01` Agregar cuatro IDs nuevos y sus URLs oficiales, manteniendo Cloud Developer primero para no cambiar la selección inicial actual.
- [x] `P2-T02` Añadir contratos de catálogo y cobertura de pesos fraccionarios.
- [x] `P2-T03` El flujo usa `certificationId` para catálogo, guía, simulación, historial, planes y temas débiles.
- [x] `P2-T04` Actualizar README y mostrar las fuentes citadas y su fecha en la interfaz.
- [x] `P2-T05` Bloquear el selector durante la carga/renovación de la guía y el inicio de la simulación; mostrar la certificación asociada al ID de la sesión activa.
- [x] `P2-T06` Mejorar las instrucciones en español e inglés para generar preguntas que reflejen el formato y el razonamiento del examen vigente, usando los dominios y temas como alcance y evitando copiar preguntas oficiales.

### Validación

- [x] `GET /api/v1/certifications` devuelve los cinco IDs en el orden definido.
- [x] Para cada ID, la API devuelve una guía estructurada con una cita al exam guide oficial y pesos que suman 100%.
- [x] Simulación, historial, plan y temas débiles conservan el ID seleccionado; Cloud Developer sigue como opción inicial. Las pruebas de integración cubren esos recorridos con generadores falsos.
- [x] El selector se bloquea mientras la consulta de guía está pendiente o activa y mientras inicia la simulación; quiz y resultados usan el ID de la sesión activa. Typecheck/build pasaron.
- [x] Revisión manual de la UI en inglés y español: el catálogo muestra las cinco opciones y Cloud Developer inicia seleccionado. No se simuló una demora real de IA.
- [x] Revisión del prompt de simulación en ambos idiomas; no se ejecutaron llamadas reales a OpenAI.

## Fuera de alcance

- Descargar o parsear PDFs en el servidor.
- Incorporar otras certificaciones, renovación de credenciales o un banco estático de preguntas.
- Hacer una llamada real de OpenAI durante pruebas automáticas o el proceso de compilación.

## Riesgo aceptado

La aplicación comprueba que el modelo consultó y citó fuentes de Google, que los dominios tengan secciones únicas y que sus pesos sumen 100%. Como el servidor no extrae el PDF ni compara los porcentajes con una transcripción independiente, una lectura incorrecta del modelo puede publicarse. El usuario podrá abrir las citas desde la guía para revisar su procedencia.

**Validación de PR-02:** `bun run typecheck`, `bun run build`, `git diff --check` y `bun test` pasaron. Las 55 pruebas cubren 11 archivos y corrieron contra PostgreSQL temporal; OpenAI quedó deshabilitado. La UI local y el prompt de simulación se revisaron en ambos idiomas. La ruta de bloqueo durante una solicitud demorada se confirmó en la condición de UI y compilación, pero no se forzó una llamada real o demorada a IA.
