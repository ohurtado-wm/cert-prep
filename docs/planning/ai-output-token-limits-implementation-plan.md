# Plan de implementación: límites de IA y controles operativos configurables

**Estado:** Commit `8c5c46d` publicado en `codex/configurable-ai-token-limits`; typecheck, build y Compose pasan; pruebas de los nuevos ajustes pendientes; PR pendiente de autenticación GitHub
**Última actualización:** 2026-10-08

## Materiales fuente

- [FEATURE_IMPLEMENTATION_PLAN.md](../../FEATURE_IMPLEMENTATION_PLAN.md) — contexto consolidado y estado del producto.
- [Generador de guías](../../server/catalog/guide-generator.ts), [generador de preguntas](../../server/simulations/question-generator.ts) y [generador de planes de estudio](../../server/study-plans/plan-generator.ts) — contienen actualmente los tres valores `maxOutputTokens`.
- [Configuración de timeout de IA](../../server/ai/request-timeout.ts) — patrón existente para validar configuración numérica.
- [.env.example](../../.env.example) y [compose.yaml](../../compose.yaml) — configuración de ejemplo y variables que Compose entrega al contenedor.

## Estado

- **Contexto completado:** la rama base fijaba en código los máximos de salida de los tres generadores, la retención del historial, la cuota horaria y la vigencia de las guías.
- **Implementado:** límites de salida, retención de historial, cuota de inicios por hora y vigencia de guías configurables mediante entorno; cableado en Compose y documentación.
- **Validado tras la extensión:** typecheck, build, `git diff --check` y configuración de Compose pasan.
- **Pendiente:** pruebas focalizadas de los nuevos ajustes; la suite PostgreSQL completa requiere `TEST_DATABASE_URL`.

## Estado de PR

| PR | Alcance | Estado | Dependencia | Validación de salida |
|---|---|---|---|---|
| `PR-09` | Límites de salida de IA y controles operativos configurables | Commit `8c5c46d` publicado; PR pendiente de autenticación GitHub | Rama actual | Typecheck, build y Compose pasan; pruebas de los nuevos ajustes pendientes; suite PostgreSQL completa requiere `TEST_DATABASE_URL` |

## Objetivo

Permitir ajustar desde `.env` los máximos de salida de IA, el historial conservado, la cuota horaria de inicios y la vigencia de guías, sin editar código para cambiar esos valores.

## Alcance y restricciones

- **Incluye:** configuración independiente para los tres flujos de generación de IA; máximo de historial, inicios de simulación por hora y días de vigencia de guías; validación, Compose y documentación.
- **Excluye:** límite de tokens de entrada, cambios de modelo o proveedor, cambios de prompts y llamadas pagadas a IA. `MAX_SIMULATION_HISTORY_ITEMS` se limita al servidor; el esquema compartido de respuesta no fija un máximo para permitir valores de entorno mayores que 20.
- **Supuesto:** mantener un valor separado por generador conserva el comportamiento actual y permite elevar solo los límites necesarios.
- **Valores de referencia:** `.env.example` configura 10,000 tokens por flujo, historial 5, inicios 10 por hora y vigencia de guía 30 días; el servidor conserva fallback de historial 20 si la variable no está definida.
- **Despliegue:** entrega conjunta; cada entorno de producción debe establecer en `.env` los tres máximos de salida y los tres límites operativos según sus necesidades.

## Forma de implementación

- Crear un módulo de configuración del servidor que lea y valide los tres límites como enteros positivos seguros.
- Reemplazar cada literal `maxOutputTokens` por el valor correspondiente a su generador.
- Añadir las variables a `.env.example` y reenviarlas en el servicio `app` de `compose.yaml`; Compose debe fallar con un mensaje claro si falta alguna.
- Documentar que elevar los máximos puede permitir respuestas más largas, aumentar costo y latencia, y que el valor debe ser compatible con el modelo configurado.

## Archivos afectados

| Área / archivo | Cambio previsto | Impacto de pruebas |
|---|---|---|
| `server/ai/output-token-limits.ts` | Nuevo parser compartido y validación de variables requeridas | Pruebas unitarias de valores válidos, ausentes y malformados |
| `server/catalog/guide-generator.ts` | Usar el máximo configurado para guías | Prueba de cableado del valor hacia `generateText` |
| `server/simulations/question-generator.ts` | Usar el máximo configurado para preguntas | Prueba de cableado del valor hacia `generateText` |
| `server/study-plans/plan-generator.ts` | Usar el máximo configurado para planes | Prueba de cableado del valor hacia `generateText` |
| `.env.example`, `compose.yaml` | Documentar valores y pasarlos al contenedor | Validación de la configuración renderizada de Compose |
| `README.md` | Explicar las variables y la configuración de producción | Revisión documental |
| `tests/ai-output-token-limits.test.ts` y pruebas de generadores existentes | Cubrir validación y uso de cada límite sin llamadas reales al proveedor | Unitarias y de integración de configuración |

## Estrategia de PR / revisión

- `PR-09`: implementar límites de salida y controles operativos configurables (historial, cuota y vigencia) en un solo PR; anterior: ninguno; siguiente: ninguno previsto.
- Mantener configuración, consumidores y pruebas en el mismo PR para revisar conjuntamente los nombres de las variables y sus valores efectivos.
- No requiere migraciones de base de datos ni cambios de API o interfaz.

## Notas de ejecución paralela

- **Ruta crítica:** fijar primero los tres nombres de variable y el contrato de validación; luego cablear consumidores, Compose, documentación y pruebas.
- **Puede avanzar en paralelo:** documentación y actualización de Compose una vez fijados los nombres y valores de ejemplo.
- **Punto de coordinación:** las tres llamadas deben usar la variable correspondiente y `.env.example` debe coincidir con Compose.

## PR-09: límites de salida y controles operativos

**ID:** `PR-09`
**Estado:** Commit `8c5c46d` publicado; PR pendiente de autenticación GitHub
**Objetivo:** mover los límites de salida y los controles operativos acordados a configuración explícita del entorno, conservando los valores actuales por defecto.
**Depende de:** código actual de la rama base.
**Paralelismo:** después de acordar nombres y valores, consumidores, Compose y documentación pueden trabajarse en paralelo.

### Tareas

- [x] `P9-T01` Crear un parser compartido para `AI_GUIDE_MAX_OUTPUT_TOKENS`, `AI_QUESTION_MAX_OUTPUT_TOKENS` y `AI_STUDY_PLAN_MAX_OUTPUT_TOKENS`; rechazar variables ausentes, no enteras, cero o negativas con errores claros.
- [x] `P9-T02` Reemplazar los literales de 6,000, 10,000 y 3,000 en los generadores por sus variables correspondientes.
- [x] `P9-T03` Añadir los tres valores de referencia a `.env.example` y configurar `compose.yaml` para exigirlos y pasarlos al proceso `app`.
- [x] `P9-T04` Documentar en `README.md` el propósito, formato y ajuste de las variables para producción.
- [x] `P9-T05` Añadir pruebas unitarias del parser y pruebas de cableado que demuestren que cada generador entrega su propio límite a `generateText`, sin invocar OpenAI.

### Criterios de validación

- [x] `.env.example` configura 10,000 tokens para cada flujo de generación.
- [x] Los tres generadores leen su valor del entorno y no conservan máximos hardcodeados.
- [x] Una variable ausente o inválida genera un error de configuración claro antes de depender de una llamada real al modelo.
- [x] Compose entrega los seis valores al contenedor `app` y explica qué variable falta si no está configurada.
- [x] Las pruebas verifican valores personalizados para los tres flujos y los casos de configuración inválida.
- [x] Producción puede elevar los límites editando su configuración de entorno; no hace falta reconstruir la imagen.

### Riesgos

- Los valores altos pueden aumentar el costo y la latencia, o exceder el máximo admitido por el modelo; los valores de producción deben validarse contra el modelo activo.
- Al exigir los seis valores en Compose, los entornos existentes deberán incorporarlos antes de desplegar la versión nueva.

## Validación transversal

- [x] Ejecutar pruebas focalizadas de configuración y cableado para los tres generadores.
- [x] Ejecutar `bun run typecheck` y `bun run build`.
- [ ] Completar `bun test`; 33 pruebas pasaron y 6 pruebas PostgreSQL no pudieron inicializar porque falta `TEST_DATABASE_URL`.
- [x] Validar `docker compose --env-file .env.example config` y confirmar que las tres variables aparecen en el servicio `app`.
- [x] Revisar que las variables se usen solo en el servidor y no se incluyan en bundles ni respuestas al cliente.


### Extensión aprobada: controles operativos del servidor

- `MAX_SIMULATION_HISTORY_ITEMS` controla tanto el límite de lectura del historial como la retención de resultados; `.env.example` lo fija en 5 y el servidor usa 20 si la variable no está definida. Se movió a `server/config/runtime-limits.ts`; `SimulationHistoryResponseSchema` acepta la longitud configurada y ya no depende de una constante compartida con el frontend.
- `MAX_STARTS_PER_HOUR=10` controla los inicios permitidos en la ventana fija de una hora.
- `AI_GUIDE_MAX_AGE_DAYS=30` controla cuándo una guía generada queda vencida.
- Compose exige los tres ajustes operativos en `.env`; `.env.example` incluye esos valores junto con los tres límites de salida.

#### Tareas de la extensión

- [x] Mover el máximo del historial al entorno del servidor y desacoplar el esquema de respuesta compartido.
- [x] Mover la cuota de inicios y la vigencia de guías al entorno del servidor.
- [x] Actualizar `.env.example`, Compose, README y `.env.local` sin mostrar su contenido existente.
- [ ] Añadir y ejecutar pruebas focalizadas para los nuevos valores configurables.
- [x] Revalidar typecheck, build y Compose después de la extensión.
