# Plan: selección inicial de idioma y apariencia

**Estado: Aprobado e implementado — revisión manual pendiente.**

## Objetivo

Al iniciar Cert Prep, pedir el idioma y la apariencia en un modal obligatorio cuando alguna de esas preferencias todavía no esté guardada. El diálogo debe ser comprensible tanto en español como en inglés y permitir entrar a la aplicación únicamente mediante la confirmación.

## Contexto confirmado

- `apps/web/pages/index/+Page.tsx` carga las preferencias al iniciar; `apps/web/src/i18n/preferences.ts` las guarda en `localStorage` como `cert-helper-locale` (`es`/`en`) y `cert-helper-theme` (`system`/`light`/`dark`).
- Si falta un idioma válido, la interfaz usa español; si falta una apariencia válida, usa Sistema. Actualmente `readThemePreference` devuelve `system` tanto cuando está guardado como cuando falta o falla la lectura, por lo que no permite distinguir esos casos.
- La apariencia Sistema escucha cambios del dispositivo. Configuración permite modificar ambas preferencias después del inicio.
- La app usa React/Vike con la API Hono en el mismo proceso y `/api/*` del mismo origen; las preferencias son locales al navegador.

## Propuesta de experiencia

1. Antes de permitir la interacción con la app, comprobar en el navegador si ambas claves contienen valores válidos. Mientras se comprueban, no mostrar brevemente el contenido interactivo ni presentar el modal por una diferencia entre renderizado del servidor e hidratación.
2. Si falta **cualquiera de las dos** preferencias o alguna tiene un valor inválido, presentar un modal con ambas preguntas:
   - Idioma / Language: Español y English.
   - Apariencia / Appearance: Sistema / System, Claro / Light y Oscuro / Dark.
3. Mostrar los textos esenciales del modal en ambos idiomas desde el primer momento. Al seleccionar un idioma se puede actualizar el texto de apoyo y la previsualización, manteniendo identificables las dos opciones de idioma.
4. Preseleccionar cualquier preferencia válida ya guardada. Para la que falte, proponer Español para idioma y Sistema para apariencia como valores iniciales visibles; la persona puede cambiar cualquiera de las dos antes de confirmar. **Supuesto para revisión:** la confirmación acepta explícitamente esos valores propuestos si no se cambian.
5. Confirmar aplica y guarda ambas elecciones en sus claves actuales. Las preferencias siguen disponibles para cambio posterior en Configuración. Si ambas claves ya contienen valores válidos al iniciar, entrar directamente sin mostrar el modal.
6. No incluir botón de cerrar ni permitir descartar mediante Escape, clic fuera o navegación en segundo plano. El único control que termina el modal es **Confirmar / Confirm**.
7. Si hay una sesión de simulación guardada, la selección inicial no la descarta ni la reemplaza. Tras confirmar, la navegación y la opción de continuar siguen disponibles.

## Almacenamiento y recuperación

- Distinguir valores válidos, ausentes o inválidos y errores de lectura, sin tratar el valor predeterminado `system` como si estuviera guardado. No introducir una tercera clave de «configuración completada»: las dos preferencias existentes son la fuente de verdad.
- Si el almacenamiento no permite guardar una o ambas elecciones, mostrar un aviso bilingüe claro, aplicar ambas durante la sesión y permitir continuar mediante Confirmar. No afirmar que se guardaron; en una visita o recarga posterior el modal puede aparecer nuevamente para las claves que no se guardaron.
- No bloquear permanentemente a la persona si el navegador impide leer o escribir `localStorage`. Respetar una preferencia válida existente cuando solo falta la otra, salvo que la persona la cambie explícitamente antes de confirmar.

## Accesibilidad y estados

- Usar un diálogo modal con nombre y descripción accesibles, foco inicial dentro, foco contenido mediante Tab/Shift+Tab y fondo inerte para teclado, puntero y tecnologías de asistencia. No cerrar con Escape ni al pulsar el fondo; tras confirmar, devolver o trasladar el foco a un punto lógico de la página.
- Los grupos de opciones tienen etiquetas accesibles, estado seleccionado visible y controles de teclado nativos. El botón de confirmar permanece disponible con las opciones iniciales visibles.
- Funcionar en móvil y escritorio, con ampliación de texto, en ambos temas y sin ocultar el botón de confirmar; si el contenido no cabe, permitir desplazamiento dentro del modal.
- Evitar solicitudes de guía que puedan iniciar generación de IA antes de completar la selección; documentar qué consultas de datos se mantienen o posponen. La configuración inicial no debe depender de catálogo, identidad, base de datos ni red para poder confirmarse.

## Alcance y archivos previstos

- `apps/web/src/i18n/preferences.ts`: lectura explícita de presencia y validez, manejo de fallos de lectura/escritura y compatibilidad con preferencias actuales.
- `apps/web/pages/index/+Page.tsx` y un componente nuevo en `apps/web/src/components/`: estado de inicialización, modal, aplicación de las preferencias y coordinación con consultas y sesión guardada.
- `apps/web/src/i18n/messages.ts` y `apps/web/src/styles.css`: textos bilingües, controles y estilos responsive de ambos temas.
- Pruebas relacionadas con preferencias y flujo inicial en `tests/` o el workspace web, según la infraestructura disponible.
- Sin cambios previstos en API, contratos compartidos, identidad, PostgreSQL, migraciones ni dependencias. Mantener Vike/Hono en un proceso y `/api/*` del mismo origen.

## Criterios de aceptación

- **INI-01:** con ambas preferencias válidas guardadas, la app inicia con ellas y no muestra el modal.
- **INI-02:** con ambas ausentes o inválidas, aparece el modal bilingüe con las dos opciones iniciales visibles; solo Confirmar permite continuar.
- **INI-03:** si solo falta o es inválida una preferencia, el modal pregunta ambas y conserva la válida como selección inicial. Al confirmar se aplican y guardan las elecciones actuales.
- **INI-04:** con una apariencia Sistema guardada, se reconoce como una elección válida y sigue el dispositivo, incluso tras cambiar la apariencia mientras la app está abierta.
- **INI-05:** Escape, clic fuera, Tab/Shift+Tab y navegación de fondo no permiten cerrar ni interactuar detrás del modal; los controles funcionan con teclado y tecnologías de asistencia.
- **INI-06:** si el almacenamiento falla, la confirmación permite seguir con las preferencias elegidas durante la sesión y comunica que podrían no persistir.
- **INI-07:** no se pierde ni modifica una simulación pendiente y no se inicia una generación de guía con IA antes de confirmar.
- **INI-08:** Configuración sigue permitiendo cambiar idioma y apariencia posteriormente, y una recarga con ambas elecciones guardadas no vuelve a pedirlas.

## Secuencia y validación prevista

1. Diseñar el estado de inicialización y las lecturas/escrituras, incluyendo valores heredados y fallos parciales.
2. Crear el modal bilingüe accesible y controlar el foco y la interacción del fondo.
3. Conectar la confirmación con los temas claro, oscuro y Sistema y posponer las consultas de guía hasta finalizar la configuración.
4. Cubrir con pruebas valores presentes, faltantes, inválidos, fallos de almacenamiento y preservación de una sesión pendiente; comprobar que el modal no puede descartarse sin confirmar.
5. Ejecutar `bun run typecheck`, pruebas pertinentes y `bun run build`. Revisar manualmente teclado, lector de pantalla, tamaños de pantalla, idiomas, temas, recarga y cambios posteriores desde Configuración. Reportar solo resultados ejecutados.

## Riesgos y mitigación

- Los valores predeterminados no deben confundirse con preferencias guardadas; comprobar presencia y validez por separado.
- Una escritura parcial puede hacer reaparecer el modal después de recargar; comunicar la limitación y evitar bloquear la visita actual.
- Un modal obligatorio puede impedir el uso de la app si el foco, el almacenamiento o el contenido fallan; probar explícitamente esos casos.
- Evitar que la inicialización dispare llamadas de IA antes de que la persona confirme sus preferencias.

## Evidencia de implementación

- `bun run typecheck` y `bun run build` finalizaron correctamente.
- `bun test tests/initial-preferences.test.ts tests/theme-preferences.test.ts tests/certification-ui-data.test.ts apps/web/src/components/InitialPreferencesDialog.test.tsx`: 16 pruebas aprobadas. Cubren valores existentes, faltantes, inválidos, fallos de almacenamiento, preferencias de tema y el contenido inicial del diálogo.
- Las consultas de identidad, catálogo y guía se habilitan después de confirmar o encontrar ambas preferencias válidas. La configuración inicial no modifica la sesión pendiente.
- La revisión manual de foco, Escape, navegación, lector de pantalla y presentación en navegador queda pendiente: el navegador no estaba disponible en esta sesión.

## Reversión y aprobación

Revertir los cambios de interfaz y preferencias de este plan; las dos claves actuales permanecen compatibles y no hay migraciones. El usuario aprobó la implementación.
