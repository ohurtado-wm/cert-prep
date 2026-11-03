# Plan maestro de implementación: Cert Prep

## Propósito

Construir un simulador bilingüe para certificaciones cloud que use fuentes oficiales, genere guías y preguntas con IA, proteja las sesiones de práctica real y ayude a cada persona a estudiar a partir de sus resultados.

## Referencias del producto

- [Contexto del producto](../product-context.md), [alcance](../scope.md) y [arquitectura](../architecture.md).
- [Propuesta inicial del PoC](../../PROJECT_PROPOSAL.md), que define el primer flujo de preparación para Professional Cloud Developer.
- Guías oficiales de [Professional Cloud Developer](https://cloud.google.com/learn/certification/guides/cloud-developer) y la [página de certificación](https://cloud.google.com/learn/certification/cloud-developer).
- [Vercel AI SDK: generación de datos estructurados](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data).
- Planes especializados: [catálogo GCP](gcp-certifications-implementation-plan.md), [certificaciones multi proveedor](ai-901-provider-neutral-certifications-implementation-plan.md), [simulaciones reanudables](resumable-simulations-implementation-plan.md), [historial por certificación](per-certification-simulation-history-implementation-plan.md), [cobertura de temas](simulation-topic-coverage-implementation-plan.md), [persistencia PostgreSQL](postgresql-persistence-plan.md) y [límites de IA](ai-output-token-limits-implementation-plan.md).

## Resultado esperado

La persona selecciona una certificación y un idioma, revisa dominios y recursos oficiales, practica preguntas generadas para esa guía y consulta resultados asociados a su identidad. Puede retomar una sesión pendiente, imprimir sus preguntas al finalizar y recibir recomendaciones basadas en métricas verificables de su historial.

## Criterios funcionales

- **FAC-01 — Guía oficial:** el catálogo ofrece certificaciones con IDs estables, nombres bilingües, códigos de examen y fuentes oficiales. La guía enumera dominios, pesos y pasos de estudio, conserva las fuentes citadas y se genera con búsqueda web oficial cuando vence su periodo de frescura.
- **FAC-02 — Simulación:** cada sesión tiene exactamente 20 preguntas originales, cuatro opciones y una respuesta correcta. Dominio, tema, idioma y servicio corresponden a la certificación seleccionada y validan contra contratos Zod.
- **FAC-03 — Modos de práctica:** la práctica guiada permite retroalimentación, revelar explicación y reintentar. El modo real avanza con un clic; el navegador no recibe la clave ni la explicación hasta que la sesión finaliza.
- **FAC-04 — Identidad e historial:** cada resultado pertenece al ID estable devuelto por el gateway. El historial se recupera entre dispositivos para la misma identidad y puede borrarse mediante una acción cuyo alcance se comunica claramente.
- **FAC-05 — Estudio personalizado:** las recomendaciones y simulaciones enfocadas usan únicamente estadísticas del historial del propietario, explican las prioridades con esas métricas y se apoyan en recursos oficiales.
- **FAC-06 — Seguridad:** claves de proveedor, respuestas correctas y contenido privado permanecen en servidor. Fallos de identidad, almacenamiento o generación producen errores recuperables y no crean sesiones parciales.
- **FAC-07 — Bilingüismo:** interfaz, errores, preguntas, explicaciones, planes y estados de carga funcionan en español e inglés; los IDs de certificación, dominio y tema permanecen estables entre idiomas.
- **FAC-08 — Hoja imprimible:** al finalizar, la persona puede imprimir las 20 preguntas con sus respuestas correctas en texto de al menos 12 pt. La hoja se entrega únicamente en la respuesta de finalización; el historial conserva agregados.

## Alcance

### Incluye

- Catálogo inicial de Professional Cloud Developer, Professional Cloud Architect, Professional Cloud Database Engineer, Professional Data Engineer y Professional Cloud DevOps Engineer; agregar Azure AI Fundamentals (AI-901) con reglas por proveedor.
- Selección de certificación, generación de guías, citas oficiales, preguntas, práctica guiada, simulación real, historial, reanudación, planes de estudio y simulación de temas débiles.
- Identidad mediante `/users/me`, aislamiento de datos por propietario, persistencia PostgreSQL, configuración de operación y ejecución local con Docker Compose.
- Experiencia completa en español e inglés y controles de privacidad en UI, API, logs y prompts.

### Límites

- No crear cuentas, contraseñas ni autenticación paralela al gateway.
- No copiar preguntas oficiales, predecir resultados de aprobación ni prometer equivalencia con un examen real.
- No enviar preguntas, opciones, IDs personales, correo ni avatar a la IA para calcular recomendaciones.
- No descargar ni parsear PDFs en el servidor; las citas brindan procedencia, no una verificación independiente de cada afirmación del modelo.
- No realizar llamadas pagadas a IA en pruebas automáticas, compilación o CI.

## Invariantes de datos y seguridad

- El backend obtiene `gatewayUserId` de la respuesta validada de `/users/me`; nunca acepta como autoridad el ID enviado por el cliente.
- Sesiones, planes e historial se consultan y modifican dentro del ámbito del propietario autenticado.
- El historial guarda métricas agregadas, IDs estables, versión de guía, fecha, idioma y modo. No guarda texto de preguntas, respuestas, opciones ni claves.
- La IA recibe agregados mínimos calculados por servidor, sin identificadores personales.
- Las preferencias de idioma y tema pueden vivir en `localStorage`; el backend es la fuente de verdad para sesiones, resultados y planes.
- Las respuestas de modo real se revelan al completar. Reanudar una sesión no regenera preguntas ni consume una nueva cuota de generación.

## Arquitectura objetivo

- `apps/web`: Vike, React, páginas, clientes HTTP y presentación.
- `apps/api`: Bun + Hono, casos de uso, gateway, proveedores de IA, PostgreSQL y migraciones.
- `packages/contracts`: contratos Zod públicos compartidos.
- `tests`: pruebas unitarias, de rutas, integración y evaluación acotada.
- Vike monta Hono dentro del mismo proceso Bun; la UI y `/api/*` usan el mismo origen.
- PostgreSQL es la base runtime. Compose inicia PostgreSQL, ejecuta migraciones como tarea separada y luego inicia la aplicación.

## Política de guías y generación

- Las guías se conservan por certificación y versión de fuentes. Al alcanzar 30 días, una petición puede solicitar su actualización bajo demanda.
- Una lease SQL con vencimiento evita generar la misma guía en paralelo. Si la renovación falla, la última guía válida se conserva y la UI muestra un error recuperable.
- Los dominios, pesos y pasos se validan con Zod. Los pesos oficiales pueden ser fraccionarios y deben sumar 100%; las fuentes oficiales del proveedor deben citarse.
- La generación de preguntas usa salida estructurada y validación server-side. Se permite una reparación acotada y se cancela la creación si la salida continúa inválida.
- Las cuotas por dominio respetan los pesos oficiales. La cobertura de temas rota según exposiciones recientes y valida cuotas exactas de extremo a extremo.

## Sesiones, historial y recomendaciones

- Mantener una sesión pendiente por usuario. Salir de la pantalla conserva el progreso; descartar es explícito. Una sesión nueva reemplaza la anterior solo después de completar análisis, generación y validación.
- Una sesión completada conserva su resultado agregado según la política de retención. El historial se limita por usuario y certificación; la UI muestra la certificación seleccionada.
- El borrado de historial comunica si también elimina planes de estudio y si su alcance incluye todas las certificaciones del usuario.
- Los planes se basan en estadísticas calculadas en servidor. La IA puede redactar explicaciones y pasos, pero no inventa métricas ni cambia prioridades calculadas.
- La simulación de temas débiles mantiene una selección determinística basada en exactitud, errores y recencia; el umbral inicial de 80% es configurable y no equivale al puntaje oficial de aprobación.

## Configuración y operación

- Configurar límites de salida por generador, historial, inicios por hora, vigencia de guías y timeout mediante variables de entorno validadas en servidor.
- Documentar valores y requisitos en `.env.example`, README y Compose. Las credenciales no se guardan en Git.
- Ejecutar migraciones como paso explícito. Una base PostgreSQL vacía debe arrancar sin importar datos SQLite.
- Mantener PostgreSQL en red privada con volumen persistente, usuario de privilegios mínimos, healthcheck y restauración de backups probada fuera del volumen.

## Secuencia de implementación

1. Definir contratos Zod, límites de workspace, identidad y modelo de persistencia.
2. Implementar el catálogo y la generación de guías con fuentes oficiales, citas, frescura y coordinación concurrente.
3. Construir la interfaz bilingüe y la selección de certificación.
4. Implementar generación de preguntas, práctica guiada, modo real y aislamiento de respuestas.
5. Añadir historial, retención por certificación, borrado explícito, planes y simulaciones de temas débiles.
6. Añadir reanudación segura y rotación de cobertura temática con agregados privados.
7. Cerrar configuración operativa, migraciones PostgreSQL, Compose, backups y documentación.

## Validación prevista

- Verificar esquemas, errores y límites con pruebas determinísticas y proveedores falsos.
- Probar aislamiento entre usuarios, ausencia de claves en respuestas de modo real, retención, borrado, reanudación y persistencia tras reinicio.
- Ejecutar integración sobre PostgreSQL aislado; cubrir migraciones limpias y repetibles, concurrencia de leases, rate limits y transacciones.
- Recorrer la aplicación en español e inglés y verificar catálogo, guía, simulación, resultado, historial y recomendaciones.
- Hacer evaluaciones de salida de IA acotadas y autorizadas; no incluir llamadas pagadas en la suite automática.
- Revisar los bundles, logs y respuestas HTTP para descartar secretos, datos personales y claves de respuesta.

## Decisiones pendientes

- Confirmar qué certificación AWS, código y nivel de examen se incorporaría antes de añadir su fuente oficial.
- Definir el proveedor/modelo de IA aprobado, presupuesto y límites de latencia por flujo.
- Confirmar el umbral inicial de 80% con datos de uso.
- Definir ubicación, frecuencia y retención de backups PostgreSQL fuera del host.
- Establecer el proceso de autorización para evaluaciones manuales con llamadas reales a IA.
