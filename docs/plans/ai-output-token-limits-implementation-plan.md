# Plan de implementación: límites de IA y controles operativos

## Objetivo

Configurar desde el entorno los límites de salida para cada flujo de generación y los controles operativos del servidor, con validación clara y valores documentados. Cambiar estos valores no requiere editar código.

## Alcance

- Configurar límites independientes para generación de guías, preguntas y planes de estudio.
- Configurar la cantidad de resultados retenidos por certificación, los inicios permitidos por hora y la vigencia de las guías.
- Validar en el servidor que los valores sean enteros positivos seguros y reportar el nombre de una variable ausente o inválida.
- Mantener la configuración solo del lado del servidor; no añadirla a contratos públicos ni respuestas HTTP.
- Documentar variables y valores de ejemplo en `.env.example`, `compose.yaml` y `README.md`.

## Fuera de alcance

- Límites de tokens de entrada, cambio de proveedor/modelo, cambios de prompts o de las rutas HTTP.
- Ajustes de reglas de negocio no relacionados con límites y operación.
- Llamadas reales o pagadas al proveedor desde pruebas automáticas.

## Contrato de configuración

| Variable | Uso | Valor de ejemplo |
|---|---|---:|
| `AI_GUIDE_MAX_OUTPUT_TOKENS` | Salida de guías | 10000 |
| `AI_QUESTION_MAX_OUTPUT_TOKENS` | Salida de preguntas | 10000 |
| `AI_STUDY_PLAN_MAX_OUTPUT_TOKENS` | Salida de planes | 10000 |
| `MAX_SIMULATION_HISTORY_ITEMS` | Resultados recientes retenidos por certificación | 5 |
| `MAX_STARTS_PER_HOUR` | Intentos de inicio por usuario en una ventana de una hora | 10 |
| `AI_GUIDE_MAX_AGE_DAYS` | Vigencia de una guía antes de renovarla | 30 |

El fallback runtime y el valor documentado en `.env.example` son 5 para `MAX_SIMULATION_HISTORY_ITEMS` y 10 para `MAX_STARTS_PER_HOUR`. Mantener esos valores alineados.

## Diseño de implementación

1. Crear funciones de configuración server-only que lean y validen cada límite con el nombre de la variable en el error.
2. Reemplazar los máximos literales de cada generador por su variable independiente.
3. Conectar los límites de historial, cuota horaria y frescura con sus consumidores actuales sin cambiar sus contratos externos.
4. Pasar los valores desde el entorno del servicio `app` en Compose y documentar requisitos en `.env.example` y README.
5. Probar valores válidos, ausentes, no enteros, fuera de rango y el cableado de cada variable con un proveedor falso.

## Touchpoints

| Área | Cambio | Verificación |
|---|---|---|
| `apps/api/src/ai/output-token-limits.ts` | Parser de límites de generación | Valores válidos e inválidos identifican la variable correspondiente |
| `apps/api/src/catalog/guide-generator.ts` | Límite de guías | El generador recibe el valor configurado |
| `apps/api/src/simulations/question-generator.ts` | Límite de preguntas | El generador recibe el valor configurado |
| `apps/api/src/study-plans/plan-generator.ts` | Límite de planes | El generador recibe el valor configurado |
| `apps/api/src/config/runtime-limits.ts` | Historial, cuota y vigencia | Cada consumidor usa su control específico |
| `.env.example`, `compose.yaml`, `README.md` | Valores y operación | Compose entrega la configuración al servidor |
| `tests/` | Parser y cableado de límites | Pruebas sin llamadas reales al proveedor |

## Criterios de aceptación

- Cada flujo usa su propio máximo y un límite inválido no se interpreta silenciosamente como cero o infinito.
- El servidor valida los controles operativos antes de procesar solicitudes que los necesitan.
- Compose entrega variables al servicio de aplicación y comunica las que son requeridas.
- La configuración no se envía a la UI ni aparece en el bundle del navegador.
- El README explica el efecto de elevar límites: mayor salida puede aumentar costo y latencia o superar la capacidad del modelo.
- Los valores por defecto del runtime y los valores recomendados en `.env.example` son coherentes.

## Riesgos

- Los valores altos pueden aumentar costo y latencia, o exceder el máximo admitido por el modelo.
- Los despliegues deben recibir sus valores de entorno antes de activar una versión que los requiera.
- Los valores de entorno deben validarse en cada entorno para evitar límites no intencionados.
