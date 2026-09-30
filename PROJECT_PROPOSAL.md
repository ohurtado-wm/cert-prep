# Propuesta: simulador local de certificaciones

**Estado:** PoC aprobado e implementado  
**Alcance:** prueba de concepto (PoC)

## Objetivo

Crear una aplicación web sencilla para practicar preguntas de certificación, recibir retroalimentación al responder y reconocer los temas que conviene estudiar más. La primera versión usará un archivo JSON local con 20 preguntas para Google Cloud **Professional Cloud Developer**.

## Alcance del PoC

- Una aplicación web que corre localmente y carga su banco desde JSON; no requiere API, base de datos externa ni cuenta de usuario.
- Una certificación disponible: Professional Cloud Developer. La interfaz y el formato de datos quedarán preparados para agregar otras certificaciones después.
- Veinte preguntas originales, en español, de opción única y alineadas con la guía oficial vigente.
- Preguntas distribuidas según el peso aproximado de los cuatro dominios del examen: 7, 5, 4 y 4 preguntas, respectivamente. La distribución es una aproximación para un banco pequeño, no una reproducción exacta del examen.
- Retroalimentación por pregunta, resumen al finalizar y desglose de desempeño por tema.

### Dominios iniciales

| Dominio de la guía oficial | Peso aproximado | Preguntas propuestas |
|---|---:|---:|
| Diseñar aplicaciones nativas de la nube escalables, disponibles y confiables | 33% | 7 |
| Compilar y probar aplicaciones | 26% | 5 |
| Implementar aplicaciones | 19% | 4 |
| Integrar aplicaciones con servicios de Google Cloud | 22% | 4 |

Cada pregunta tendrá además un servicio o concepto asociado, como GKE, IAM, Cloud Run, Pub/Sub, Cloud SQL o Secret Manager. Los servicios se elegirán según los temas de la guía, sin exigir que cada servicio aparezca con la misma frecuencia.

## Propuesta tecnológica

| Área | Decisión para el PoC | Motivo |
|---|---|---|
| Aplicación web | React + TypeScript estricto + Vike sobre Vite | Sigue el estándar recomendado y permite construir una interfaz de una sola aplicación. |
| Ejecución y empaquetado | Vike genera la aplicación estática; Bun no es requisito de ejecución para este PoC | La sesión corre en el navegador y no necesita un backend. |
| UI | Tailwind CSS | Estilos y diseño responsivo sin incorporar otra capa de componentes. |
| Banco de preguntas | JSON local publicado como recurso estático | Es suficiente para las 20 preguntas y no requiere persistencia ni consultas a una base de datos. |
| Carga y caché | `fetch` nativo con TanStack Query | Carga el JSON y centraliza los estados de carga, error y caché. |
| Validación de datos | Zod al cargar el JSON | Detecta contenido inválido en tiempo de ejecución, además de los tipos estáticos de TypeScript. |
| Estado de la sesión | Estado local de React y Context si se comparte entre pantallas; sin Zustand | El avance y el resultado solo viven durante la sesión actual. |
| Backend y datos persistentes | No incluir Bun + Hono ni Drizzle/SQLite/PostgreSQL todavía | No hay API, edición remota del banco ni historial que los necesite. |
| IA | No incluir Vercel AI SDK (`ai`) en el PoC | No hay una función de IA aprobada para esta fase. |

Vike permite generar una salida estática que no necesita un servidor de producción, y sus recursos estáticos pueden incluir el JSON del banco. Como ese JSON incluye la respuesta correcta, el navegador podrá inspeccionarla; esto es aceptable para una herramienta local de estudio, pero no para un examen seguro publicado a usuarios externos.

Si después se requiere persistir resultados, administrar preguntas o proteger respuestas, la siguiente evolución propuesta es una API con Bun + Hono y Drizzle sobre SQLite para uso local. PostgreSQL tendría sentido al desplegar la solución para múltiples usuarios. Si se aprueba una función de IA, el Vercel AI SDK se integraría en el backend para mantener las credenciales fuera del navegador.

## Experiencia propuesta

### Inicio

- Permitir elegir una certificación; el PoC mostrará Professional Cloud Developer.
- Mostrar cantidad de preguntas y dominios que cubre el banco.
- Iniciar una sesión con las 20 preguntas.

### Simulación

- Presentar una pregunta a la vez, con progreso y opciones seleccionables.
- **Enviar** valida la opción elegida. Si es correcta, resalta la respuesta, muestra el dominio y servicio relacionados y habilita **Siguiente**.
- Si es incorrecta, informa el resultado y habilita **Volver a intentar**.
- **Mostrar cuál es la correcta** revela y resalta la respuesta; después permite avanzar.
- Al reintentar, una respuesta correcta puede cerrar la pregunta como aprendida, pero el diagnóstico registra si se acertó al primer intento o si se necesitó ayuda.

### Resultado

- Mostrar el total de aciertos al primer intento, preguntas reintentadas y respuestas reveladas.
- Mostrar aciertos y errores por dominio y listar los temas con más respuestas incorrectas o reveladas.
- Usar ese desglose como guía de estudio, sin presentar un umbral de aprobación como equivalente al examen oficial.

## Datos locales

Un archivo, por ejemplo `public/data/certifications.json`, contendrá los metadatos de cada certificación, sus dominios y preguntas. Estructura propuesta:

```json
{
  "certifications": [
    {
      "id": "gcp-professional-cloud-developer",
      "name": "Google Cloud Professional Cloud Developer",
      "language": "es",
      "source": "https://cloud.google.com/learn/certification/guides/cloud-developer?hl=es-419",
      "topics": [
        { "id": "design", "name": "Diseñar aplicaciones nativas de la nube", "weight": 33 }
      ],
      "questions": [
        {
          "id": "gcpd-001",
          "topicId": "design",
          "focus": "Elegir una plataforma de ejecución",
          "service": "Cloud Run",
          "question": "Texto de la pregunta",
          "answers": [
            { "id": "a", "text": "Opción A", "isCorrect": false },
            { "id": "b", "text": "Opción B", "isCorrect": true }
          ],
          "explanation": "Por qué la opción correcta resuelve el escenario."
        }
      ]
    }
  ]
}
```

La explicación no es estrictamente necesaria para validar, pero se recomienda para que la retroalimentación ayude a estudiar. El navegador cargará el JSON mediante el servidor de desarrollo o de vista previa de Vike; abrir la página directamente como archivo puede impedir la lectura del JSON por restricciones del navegador.

## Criterios de aceptación

1. La pantalla de inicio muestra certificación, cantidad de preguntas y dominios.
2. Se puede completar una sesión de 20 preguntas, una por pantalla.
3. Enviar una respuesta correcta o incorrecta produce el flujo de retroalimentación correspondiente; también se puede revelar la respuesta correcta.
4. La pantalla final presenta resultado general y desglose por dominio/tema, incluyendo preguntas resueltas con ayuda.
5. El JSON contiene exactamente 20 preguntas válidas; cada una referencia un tema existente, un servicio, opciones y una única respuesta correcta.
6. El flujo funciona con los datos locales y no depende de servicios externos.

## Fuera del alcance

- Cuentas, perfiles, persistencia de resultados entre sesiones o sincronización.
- Backend, base de datos remota, publicación en la nube o panel para administrar preguntas.
- Temporizador, banco aleatorio adaptativo o modos de examen configurables.
- Otras certificaciones en esta primera entrega.
- Funciones de IA. Se considerarían después de probar y aprobar el PoC.

## Supuestos por confirmar

- “GCP Developer” se refiere a **Professional Cloud Developer**. Google también ofrece certificaciones de otros niveles y especialidades; si se buscaba otra, hay que cambiar el banco antes de redactar las preguntas.
- Las preguntas serán de práctica, redactadas para este proyecto y no copiadas de exámenes reales o materiales propietarios.
- Para identificar los temas débiles se usará el resultado del primer intento y se reportarán aparte los reintentos y respuestas reveladas.

## Siguiente paso

El PoC fue aprobado. La evolución de producto final —IA, sesiones bilingües e historial de resultados— está planificada en [FEATURE_IMPLEMENTATION_PLAN.md](FEATURE_IMPLEMENTATION_PLAN.md). La implementación queda pendiente de revisar ese plan y resolver las preguntas abiertas allí.

## Referencia

- [Guía oficial del examen Professional Cloud Developer — Google Cloud](https://cloud.google.com/learn/certification/guides/cloud-developer?hl=es-419). Consultada el 30 de septiembre de 2026. Sus cuatro dominios y pesos aproximados se usan como base para esta propuesta.
