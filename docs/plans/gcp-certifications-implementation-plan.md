# Plan de implementación: catálogo de certificaciones Google Cloud

## Objetivo

Ofrecer cinco certificaciones profesionales de Google Cloud con IDs estables, fuentes oficiales, guías bilingües, simulaciones, historial y recomendaciones asociadas a la certificación seleccionada. Professional Cloud Developer permanece como opción inicial.

## Fuentes oficiales

| ID | Certificación | Guía del examen | Página de certificación | Ruta de aprendizaje |
|---|---|---|---|---|
| `gcp-professional-cloud-developer` | Professional Cloud Developer | [Exam guide](https://cloud.google.com/learn/certification/guides/cloud-developer) | [Certificación](https://cloud.google.com/learn/certification/cloud-developer) | [Ruta 19](https://www.skills.google/paths/19) |
| `gcp-professional-cloud-architect` | Professional Cloud Architect | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-architect) | [Ruta 12](https://www.skills.google/paths/12) |
| `gcp-professional-cloud-database-engineer` | Professional Cloud Database Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_database_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-database-engineer) | [Ruta 22](https://www.skills.google/paths/22) |
| `gcp-professional-data-engineer` | Professional Data Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/data-engineer) | [Ruta 16](https://www.skills.google/paths/16) |
| `gcp-professional-cloud-devops-engineer` | Professional Cloud DevOps Engineer | [Exam guide](https://services.google.com/fh/files/misc/professional_cloud_devops_engineer_exam_guide_english.pdf) | [Certificación](https://cloud.google.com/learn/certification/cloud-devops-engineer) | [Ruta 20](https://www.skills.google/paths/20) |

## Decisiones de diseño

- El catálogo guarda el proveedor, ID estable, nombre ES/EN, código y fuentes oficiales permitidas.
- La generación de guías utiliza OpenAI Responses con `web_search` obligatorio y una allowlist de `cloud.google.com`, `services.google.com`, `skills.google` y `cloudskillsboost.google`.
- Cada guía consulta la URL del examen y cita al menos la guía oficial o la página de certificación. La interfaz presenta las fuentes y la fecha de consulta.
- El servidor valida citas HTTPS y dominios, secciones únicas, pesos positivos que suman 100% y nombres/temas en ambos idiomas. Los porcentajes fraccionarios se conservan.
- El sistema no descarga ni parsea PDFs. Las citas muestran procedencia, pero no prueban que el modelo haya leído correctamente cada porcentaje o dominio.
- Las guías se sirven desde caché por 30 días y se renuevan bajo demanda. Una lease persistente por certificación coordina solicitudes concurrentes. Una renovación fallida conserva la última guía válida y devuelve un error recuperable.
- La guía y todos los datos derivados usan `certificationId`; cambiar la certificación no mezcla fuentes, historial, planes ni temas.
- Los bancos de preguntas son originales y se alinean a los dominios oficiales sin reutilizar preguntas de exámenes.

## Flujo de implementación

1. Definir proveedor, contrato Zod, IDs y fuentes del catálogo.
2. Implementar búsqueda de fuentes, validación de citas y generación estructurada de dominios, pesos y pasos.
3. Añadir caché de 30 días, lease de actualización y publicación atómica de la nueva guía.
4. Hacer que catálogo, UI, simulaciones, historial y recomendaciones usen el mismo ID estable.
5. Incorporar las cuatro certificaciones adicionales manteniendo Professional Cloud Developer primero.
6. Mostrar fuentes y frescura en la UI y documentar el catálogo.

## Touchpoints y cobertura

| Área | Responsabilidad | Criterio de aceptación |
|---|---|---|
| `packages/contracts/src/certification-contracts.ts` | Proveedor, metadatos, fuentes, dominios y pesos oficiales | Los contratos aceptan decimales válidos y rechazan IDs, porcentajes o fuentes inválidas |
| `apps/api/src/catalog/certifications.ts` | IDs, nombres, códigos, dominios permitidos y URLs oficiales | Cinco entradas únicas, con URLs HTTPS y Cloud Developer primero |
| `apps/api/src/catalog/guide-generator.ts` | `web_search`, selección de fuentes, generación y validación | Requiere cita oficial, mantiene el idioma y rechaza citas fuera de allowlist |
| `apps/api/src/catalog/repository.ts` | Caché, huella de fuentes y lease de renovación | Solicitudes simultáneas comparten una sola actualización por certificación |
| `apps/web/pages/index/+Page.tsx` y `apps/web/src/i18n/messages.ts` | Selector, guía, fuentes, fechas y mensajes ES/EN | La certificación activa se mantiene durante la guía, sesión e historial |
| `tests/` | Fixtures, generadores falsos, aislamiento por ID y regresiones | La suite no llama a servicios pagados y cubre los fallos de fuente y renovación |

## Criterios de aceptación

- El catálogo expone los cinco IDs en el orden definido y mantiene Professional Cloud Developer como selección inicial.
- Cada guía contiene dominios de la certificación, pasos vinculados a IDs válidos, pesos positivos que suman 100% y fuentes oficiales citadas.
- Los pesos fraccionarios se muestran sin convertir rangos oficiales en porcentajes exactos; las simulaciones usan pesos internos que suman 100%.
- Las guías vigentes se sirven desde caché; al vencer el TTL, una sola actualización por certificación se publica de forma atómica.
- Una salida inválida o una falla del proveedor conserva la última guía válida, no crea una guía parcial y permite mostrar un error recuperable.
- Guía, simulación, historial, plan y temas débiles conservan el ID de certificación elegido.
- El catálogo funciona en español e inglés y mantiene estable la selección inicial.
- Las pruebas usan proveedores falsos; ninguna llamada real a OpenAI se ejecuta automáticamente.

## Riesgos y preguntas

- El modelo puede leer mal el contenido del PDF aunque cite una URL oficial; el usuario debe poder abrir las fuentes para revisar la guía.
- Las URLs oficiales pueden cambiar; cada entrada debe poder revisarse sin permitir que una configuración del catálogo amplíe la allowlist del servidor.
- Antes de incluir una certificación AWS, definir su nivel y código oficial de examen; SAA-C03 es solo una opción por evaluar.

El soporte de Azure AI Fundamentals y la selección de allowlists por proveedor se especifican en [AI-901 y catálogo multi proveedor](ai-901-provider-neutral-certifications-implementation-plan.md).
