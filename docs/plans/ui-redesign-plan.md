# Plan de rediseño y navegación de Cert Prep

**Estado: Aprobado para implementación — en curso.**

## Objetivo

Organizar Cert Prep en pantallas para que el dashboard se concentre en iniciar o continuar una simulación y las demás actividades tengan su propio espacio. Refinar la interfaz actual para que sea más armónica y moderna mediante ajustes pequeños, conservando los colores de West Monroe, la experiencia bilingüe, los temas claro y oscuro y los flujos existentes.

## Contexto confirmado

- Hoy la página `apps/web/pages/index/+Page.tsx` reúne el inicio, la sesión pendiente, historial, práctica enfocada, plan de estudio y recursos; también controla las pantallas de simulación y resultados.
- El encabezado muestra la marca, `v1`, controles de idioma y tema. Idioma y tema ya se guardan en `localStorage`, mediante las claves `cert-helper-locale` y `cert-helper-theme`.
- `/api/v1/me` entrega un ID, correo opcional y avatar opcional; ni el esquema local del gateway ni el contrato público incluyen un nombre completo. El repositorio no documenta qué campos de nombre devuelve `/users/me`; hay que verificar su respuesta real o documentación antes de definir el mapeo.
- El historial, el análisis de temas débiles, el plan y la guía se consultan para la certificación seleccionada. Hay como máximo una simulación pendiente por usuario. Reanudarla conserva su certificación, modo y progreso; iniciar otra pide confirmación si reemplaza la pendiente.
- `src/styles.css` contiene los temas, estilos responsive y reglas de impresión. La arquitectura conserva Vike y Hono en el mismo proceso y `/api/*` en el mismo origen, conforme al ADR 0001.

## Experiencia propuesta

### Navegación y usuario

- Reemplazar en la barra superior el indicador de versión y los controles de idioma y tema por el correo de la persona en sesión, o el ID si no hay correo. Mostrar el correo también dentro del menú de usuario. La marca lleva al dashboard.
- El nombre completo queda pendiente hasta conocer el campo real de `/users/me`. Hay un TODO en la UI; no se deduce el nombre a partir del ID o correo.
- Al activar la identidad, abrir un menú con **Dashboard**, **Tu progreso**, **Plan de estudio**, **Recursos** y **Configuración**. El menú se cierra al elegir una opción, al presionar Escape o al interactuar fuera; debe funcionar con teclado y anunciar su estado accesiblemente.
- Mostrar estados de carga y error de identidad sin inventar un nombre ni impedir el acceso a configuración. Las acciones que requieren identidad mantienen sus restricciones actuales.
- Permitir regresar al dashboard y moverse entre pantallas. Propuesta: usar vistas con URLs y navegación del navegador, manteniendo el estado necesario del usuario, certificación y sesión; definir los detalles de Vike al implementar. Una recarga o navegación atrás durante una simulación debe permitir recuperar la sesión guardada sin perder respuestas confirmadas.

### Dashboard

- Conservar el mensaje introductorio, selector de certificación, selección de modo e inicio de una simulación.
- Colocar encima de esos elementos un recordatorio compacto cuando exista una simulación pendiente, con acción **Continuar** y control para cerrar el recordatorio.
- Cerrar el recordatorio solo lo oculta; no descarta la simulación ni evita la confirmación al reemplazarla. Supuesto propuesto: se oculta durante la visita actual y vuelve a aparecer al recargar si la sesión sigue pendiente. Conservar una acción explícita para descartar la sesión, con confirmación.
- Mostrar los estados de carga y error necesarios para identidad, catálogo, guía y sesión pendiente, manteniendo la posibilidad de reintentar.

### Tu progreso

- Mostrar las simulaciones recientes de la certificación seleccionada, sus resultados y la información de progreso existente. Mantener la posibilidad de cambiar de certificación de forma clara y coherente entre pantallas.
- Ubicar aquí el análisis de temas débiles y la acción de práctica enfocada, conservando la elección de modo y las validaciones actuales.
- Conservar la acción de borrar historial y planes con su confirmación actual, que comunica que afecta a todas las certificaciones.

### Plan de estudio

- Presentar el plan de estudio en una pantalla propia, con la certificación seleccionada, prioridades, evidencia y enlaces a recursos oficiales.
- Mantener la consulta del último plan, la generación y regeneración, así como los estados de carga, error y falta de historial.

### Recursos

- Presentar los dominios y pesos del examen, la ruta de aprendizaje y las fuentes oficiales de la certificación seleccionada. Conservar la información disponible sobre la guía y sus estados de carga, vigencia y error.

### Configuración

- Mover aquí la selección de idioma español/inglés y de tema claro/oscuro. Aplicar los cambios inmediatamente y conservarlos en el navegador para próximas visitas; reutilizar las claves actuales para mantener preferencias existentes. Si el almacenamiento no está disponible, aplicar la preferencia durante la visita.
- Mostrar la información de versión actualmente disponible (`v1`) y una breve descripción general de la aplicación. Evitar afirmar que `v1` es la versión del paquete: el manifiesto actualmente declara `0.1.0` y no hay una fuente de versión de despliegue establecida.

### Disposición y desplazamiento

- Sustituir la página principal larga por las pantallas descritas. Permitir desplazamiento dentro de cada pantalla cuando el contenido lo necesite, especialmente con preguntas o recursos extensos, ventanas pequeñas y ampliación de texto. Mantener accesibles todos los controles sin recortar contenido.
- Conservar las pantallas de simulación y resultados, sus interacciones, estados y hoja imprimible; adaptarlas visualmente a la nueva navegación.

### Refinamiento visual

- Partir de los componentes y patrones actuales; ajustar de forma moderada espaciados entre secciones y controles, padding, alineación y jerarquía tipográfica para lograr una presentación más uniforme.
- Mantener la paleta de West Monroe ya presente. Revisar los pares de texto y fondo, bordes y estados de interacción para mejorar el contraste en ambos temas; utilizar el color de acento de forma consistente para acciones y foco.
- Afinar los radios de los controles existentes y la separación entre superficies, respetando las pautas de marca aplicables. Mantener una apariencia coherente entre botones, selectores, menú, tarjetas y estados de carga o error.
- Mejorar el modo oscuro con superficies, texto, bordes y controles distinguibles; revisar en particular selección, hover, foco, controles deshabilitados y mensajes de estado. Conservar su preferencia actual.
- Usar el skill `west-monroe-brand-for-ui-ux` como guía de marca durante el diseño e implementación, aplicando primero la solicitud del usuario y reutilizando los patrones disponibles en el proyecto.

## Alcance y límites

- El trabajo de navegación y presentación se concentra en `apps/web`. Se aplaza la ampliación de identidad hasta confirmar el dato de nombre del gateway; el ID estable sigue siendo la autoridad para asociar datos al usuario.
- No se prevén cambios de persistencia, generación de IA ni migraciones. Mantener las claves de respuesta del modo real en servidor hasta finalizar. Registrar en `docs/decisions/` una propuesta de decisión para el cambio de contrato; no aceptarla sin aprobación explícita.
- Mantener marca y logotipos actuales. La dirección visual acordada es un refinamiento contenido de la interfaz existente, sin reemplazar su identidad visual ni incorporar un sistema de componentes ajeno.

## Criterios de aceptación

- **UIR-01:** la barra muestra el correo o, si no está disponible, el ID, y un menú accesible con acceso a dashboard, progreso, plan, recursos y configuración. Versión, idioma y tema ya no aparecen como controles directos en la barra. El nombre completo queda pendiente por indicación del usuario.
- **UIR-02:** configuración permite cambiar idioma y tema; ambos se mantienen tras recargar y se respetan las preferencias guardadas antes del cambio. Muestra versión e información general.
- **UIR-03:** el dashboard contiene introducción y configuración de una simulación nueva. Si hay sesión pendiente, muestra arriba un recordatorio cerrable que permite continuar. Cerrarlo no borra la sesión; reemplazarla o descartarla sigue requiriendo la confirmación correspondiente.
- **UIR-04:** progreso muestra resultados recientes y práctica enfocada de la certificación seleccionada, y conserva la acción de borrar historial con su alcance explícito.
- **UIR-05:** plan de estudio y recursos tienen pantallas propias con los datos y acciones indicados; todas reflejan la certificación seleccionada y sus estados vacíos, de carga y error.
- **UIR-06:** la navegación entre pantallas, atrás/adelante y recarga conserva o recupera el estado pertinente sin perder respuestas confirmadas ni mostrar información de otra certificación o persona. La simulación activa y los resultados siguen siendo utilizables.
- **UIR-07:** las pantallas funcionan en escritorio, tablet y móvil, en ambos idiomas y temas; el contenido largo puede desplazarse y permanece legible al ampliar texto. Se conservan navegación por teclado, foco visible, contraste, movimiento reducido y hoja imprimible.
- **UIR-08:** el ID estable y el aislamiento por usuario se conservan. Las reglas de simulación se conservan y las claves correctas del modo real no llegan al navegador antes de finalizar. El contrato de identidad no cambia mientras el nombre quede pendiente.
- **UIR-09:** las pantallas reutilizan la paleta de WM y muestran espaciados, padding, alineación y radios coherentes con el refinamiento acordado. En ambos temas, el texto normal alcanza al menos 4.5:1 y el texto grande 3:1 frente a su fondo; los estados de interacción, foco, selección y deshabilitado se distinguen y son legibles.

## Archivos previstos

- `apps/web/pages/index/+Page.tsx` y nuevas páginas o componentes en `apps/web/pages/` y `apps/web/src/components/`: composición de pantallas, navegación y estado compartido.
- `apps/web/src/components/SimulationScreens.tsx`, `StudyPlanPanel.tsx` y `AiTokenUsage.tsx`: integración y presentación coherente de las pantallas existentes.
- `apps/web/src/styles.css`: layout, menú, temas, pantallas, accesibilidad responsive e impresión.
- `apps/web/src/i18n/messages.ts` y `preferences.ts`: textos bilingües y reutilización de preferencias existentes.
- [ADR 0002](../decisions/0002-gateway-display-name.md): propuesta de decisión sobre el dato de perfil y su contrato, pendiente de aprobación.

## Secuencia propuesta

1. Definir composición visual, rutas de las pantallas y manejo compartido de identidad, certificación y sesión; precisar el comportamiento de recarga y navegación atrás.
2. Crear el encabezado con menú de usuario usando el correo disponible; trasladar idioma, tema y versión a configuración, conservando las preferencias guardadas.
3. Separar el dashboard y añadir el recordatorio cerrable sin cambiar la sesión guardada.
4. Crear las pantallas de progreso, plan de estudio y recursos, conservando las acciones y estados actuales por certificación.
5. Integrar la simulación, resultados y hoja imprimible con la nueva navegación; resolver comportamiento de salida y recuperación de sesión.
6. Refinar componentes existentes con ajustes moderados de espaciado, padding, radios y contraste; revisar especialmente el modo oscuro. Completar estilos para ambos idiomas, tamaños de pantalla, accesibilidad y contenido extenso.
7. Revisar recorridos completos y documentar resultados reales de validación.

## Validación prevista

- Ejecutar `bun run typecheck` y `bun run build`; añadir o ejecutar pruebas pertinentes para navegación, preferencias, recordatorio y conservación de estado según la implementación.
- Recorrer menú, configuración y cada pantalla en español e inglés y en ambos temas; recargar y comprobar preferencias y navegación atrás/adelante.
- Verificar selección y cambio de certificación, historial vacío y existente, estados de carga/error, plan y recursos correspondientes.
- Comprobar cerrar el recordatorio, reanudar, descartar y reemplazar una sesión; navegar o recargar durante la simulación y recuperar respuestas confirmadas.
- Revisar práctica guiada, modo real y resultados; comprobar que las respuestas correctas permanecen ocultas antes de terminar y que la impresión sigue funcionando.
- Revisar teclado, foco, cierre del menú, etiquetas, contraste, movimiento reducido y desplazamiento con contenido largo y texto ampliado en móvil y escritorio. Medir contrastes de texto en ambos temas y comprobar visualmente estados de controles y coherencia entre componentes.

### Evidencia de implementación

- `bun run typecheck` y `bun run build` terminaron correctamente.
- `bun test tests/gateway.test.ts tests/certification-ui-data.test.ts`: 11 pruebas aprobadas. No se ejecutó la integración PostgreSQL.
- La revisión visual y de navegación en navegador está pendiente: el servicio de navegador no estaba disponible en esta sesión.
- Por indicación del usuario se usa el correo y se deja el nombre completo como TODO hasta confirmar el campo real del gateway.

## Riesgos y decisiones pendientes

- Falta confirmar si el gateway entrega el nombre completo y con qué estructura. El esquema existente elimina campos no declarados; sin verificar la fuente no se puede garantizar que el nombre llegue a la interfaz. Si el gateway no lo proporciona, acordar una fuente autorizada antes de implementar esa parte.
- Conservar la certificación y el progreso al navegar o recargar requiere coordinar URL, estado de interfaz y sesión guardada; no depender de estado de React que se pierde en una recarga.
- El usuario confirmó que puede haber scroll dentro de cada pantalla cuando sea necesario. El detalle de las rutas y los valores específicos de espaciado y componentes queda por definir durante el diseño, dentro del alcance de ajustes pequeños.
- El recordatorio se propone oculto solo durante la visita actual; confirmar otra duración si se desea.
- El indicador actual `v1` y la versión `0.1.0` del manifiesto tienen significados que no están documentados. La pantalla debe etiquetar el indicador sin presentarlo como versión de despliegue verificada.

## Despliegue y reversión

El rediseño se despliega con la aplicación actual y no requiere migraciones. Se puede revertir el cambio de frontend sin restaurar datos; las claves de preferencias existentes se conservan.

## Aprobación

El usuario aprobó implementar este plan y posteriormente indicó aplazar el nombre completo. La propuesta del ADR permanece pendiente de aceptación explícita y el mapeo del nombre del gateway requiere confirmación.
