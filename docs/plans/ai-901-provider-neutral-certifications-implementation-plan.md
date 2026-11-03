# Plan de implementación: Azure AI Fundamentals y catálogo multi proveedor

## Objetivo

Agregar Azure AI Fundamentals (AI-901) y hacer que el catálogo, las guías y las simulaciones admitan certificaciones de Google Cloud y Microsoft Azure sin cambiar el recorrido existente de Google Cloud.

## Fuentes oficiales

- [Azure AI Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/)
- [Guía de estudio AI-901](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901)
- [Ruta de conceptos de IA](https://learn.microsoft.com/en-us/training/paths/ai-concepts/)
- [Ruta de aplicaciones y agentes](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/)
- [Curso AI-901](https://learn.microsoft.com/en-us/training/courses/ai-901t00)

## Alcance y restricciones

- Agregar únicamente Azure AI Fundamentals (AI-901) en este plan.
- Incluir un `provider` tipado en los metadatos del catálogo y usarlo para seleccionar reglas de fuentes y contexto de generación.
- Mantener allowlists explícitas y controladas por el servidor; los datos del catálogo no pueden incorporar dominios confiables arbitrarios.
- Mantener IDs estables, historial, planes y selección inicial de Professional Cloud Developer.
- Conservar prompts bilingües y el aviso de no afiliación, y no reutilizar preguntas oficiales.
- Fuera de alcance: otras certificaciones Azure, formulario administrativo, banco estático de preguntas y cambios al gateway.
- El proveedor forma parte del catálogo en código; no requiere persistencia propia ni migración.

## Contrato del catálogo y flujo

1. `GET /api/v1/certifications` expone las certificaciones con su proveedor y fuentes tipadas.
2. La guía se genera por `certificationId` con fuentes del proveedor correspondiente y se guarda siguiendo la política de caché y renovación definida en el plan de catálogo.
3. Las simulaciones usan la guía de la certificación activa; sus dominios, pesos y temas validan contra esa guía.
4. El historial y los planes mantienen el mismo ID estable para no mezclar datos entre certificaciones.

Para AI-901, registrar la guía de estudio, la página de certificación y las dos rutas de aprendizaje oficiales. El contrato mantiene una URL principal por paso de estudio; usar la ruta de aplicaciones y agentes como enlace de los pasos y exponer ambos recursos en las fuentes oficiales.

## Reglas de generación

- Aplicar allowlists por proveedor: fuentes Google para GCP y `learn.microsoft.com` para Microsoft.
- Exigir al menos una cita a la guía oficial del examen o a la página oficial de certificación.
- Normalizar variantes de Microsoft Learn sin aceptar dominios externos.
- Preservar rangos oficiales de ponderación en la UI. Para cálculos de asignación interna, usar el punto medio del rango y verificar que los pesos derivados sumen 100%.
- Generar dominios, preguntas y explicaciones en español e inglés. Las preguntas deben reflejar objetivos y razonamiento del examen sin copiar preguntas oficiales.
- No incluir respuestas personales o claves de sesión en llamadas a IA.

## Touchpoints

| Área | Responsabilidad | Cobertura prevista |
|---|---|---|
| `packages/contracts/src/certification-contracts.ts` | Proveedor, catálogo, fuentes y rangos de peso | Validación de respuestas del catálogo y rangos oficiales |
| `apps/api/src/catalog/certifications.ts` | Registro de AI-901 y URLs oficiales | ID único, proveedor y fuentes HTTPS |
| `apps/api/src/catalog/guide-generator.ts` | Allowlist, extracción de citas y contexto por proveedor | Aceptar fuentes oficiales del proveedor y rechazar las demás |
| `apps/api/src/simulations/question-generator.ts` | Prompts bilingües por certificación | Dominios, idioma y objetivos del proveedor activo |
| `apps/api/src/logger.ts` | Errores operativos sin serializar datos sensibles | Diagnóstico sin credenciales, prompts o respuestas privadas |
| `apps/web/pages/index/+Page.tsx`, `apps/web/src/i18n/messages.ts` | Fuentes y avisos bilingües | Etiquetas accesibles y enlaces oficiales |
| `tests/` y `README.md` | Regresiones GCP/Azure y documentación | Pruebas con generadores falsos y fuentes fijas |

## Secuencia

1. Añadir `provider` al contrato y tipar todas las entradas actuales.
2. Registrar AI-901 con su guía, certificación y recursos oficiales.
3. Separar allowlists y validación de citas por proveedor.
4. Adaptar la guía, la generación de preguntas, logs y textos bilingües.
5. Cubrir los recorridos de Azure y regresión de GCP en catálogo, guía, simulación e historial.
6. Actualizar README con fuentes y certificaciones disponibles.

## Criterios de aceptación

- El catálogo conserva las cinco certificaciones GCP y agrega exactamente `azure-ai-fundamentals` con código AI-901.
- Professional Cloud Developer permanece como selección inicial.
- Las citas válidas pertenecen a la allowlist del proveedor y al menos una es fuente oficial del examen o certificación.
- La UI conserva rangos oficiales; los cálculos internos usan puntos medios que suman 100%.
- Guía y simulación de AI-901 usan solo sus dominios y temas, producen contenido bilingüe y conservan su ID en historial y planes.
- Los recorridos existentes de GCP siguen aislados por ID y no cambian de comportamiento.
- Pruebas automáticas usan proveedores falsos; una generación real requiere una evaluación manual autorizada.

## Riesgos y preguntas

- Las ponderaciones de AI-901 se publican como rangos. El punto medio es una convención interna de asignación, no un porcentaje oficial exacto.
- El modelo puede citar una fuente válida e interpretar incorrectamente su contenido; mostrar los enlaces no equivale a una verificación independiente.
- El catálogo de código es suficiente para este alcance. Un formulario administrativo necesita autorización de roles, auditoría y reglas de publicación definidas en un plan separado.
