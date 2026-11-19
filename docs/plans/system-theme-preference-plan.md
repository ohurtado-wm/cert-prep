# Plan: preferencia de apariencia del sistema

**Estado: Aprobado e implementado — revisión visual pendiente.**

## Objetivo

Permitir que cada persona elija en Configuración entre tema claro, oscuro o el tema del sistema operativo, y conservar esa preferencia en el navegador.

## Contexto actual

- `apps/web/pages/index/+Page.tsx` lee `cert-helper-theme` en `localStorage`. Si contiene `light` o `dark`, aplica esa preferencia; de lo contrario consulta una vez `prefers-color-scheme`.
- Configuración ofrece un botón que alterna entre claro y oscuro. Actualmente no escucha cambios posteriores en la apariencia del sistema.
- El tema efectivo también controla `data-theme`, `color-scheme` y el favicon.

## Propuesta

- Ofrecer tres opciones en Configuración: **Sistema**, **Claro** y **Oscuro**, con etiquetas en español e inglés y el estado seleccionado accesible.
- Usar **Sistema** cuando no exista una preferencia válida guardada. En este modo, consultar `matchMedia('(prefers-color-scheme: dark)')` y actualizar la interfaz si el dispositivo cambia de apariencia mientras la aplicación está abierta.
- En Claro u Oscuro, conservar el tema elegido independientemente de cambios del sistema.
- Guardar la elección en la clave existente `cert-helper-theme`, con valores `system`, `light` o `dark`; respetar los valores `light` y `dark` ya guardados. Si el almacenamiento no está disponible, aplicar la elección durante la sesión.
- Si `matchMedia` no está disponible, usar claro como alternativa para Sistema. No cambiar el tema del dispositivo.
- Sin cambios en contratos, API, base de datos ni dependencias.

## Criterios de aceptación

1. Configuración muestra las tres opciones, indica la seleccionada y aplica los cambios inmediatamente.
2. Sistema sigue la preferencia del dispositivo al cargar y mientras la aplicación permanece abierta; se deja de seguir cuando se elige Claro u Oscuro.
3. La preferencia persiste al recargar y los valores guardados existentes de claro y oscuro se respetan.
4. `data-theme`, `color-scheme`, favicon y controles se actualizan con el tema efectivo en ambos idiomas.
5. La interfaz continúa utilizable si falla `localStorage` o no está disponible `matchMedia`; no se acumulan listeners al cambiar de opción o desmontar la aplicación.

## Archivos y secuencia

1. En `apps/web/src/i18n/preferences.ts`, definir lectura y escritura de la preferencia de tema, con compatibilidad para las claves actuales.
2. En `apps/web/pages/index/+Page.tsx`, separar la preferencia elegida del tema efectivo y gestionar la suscripción a cambios del sistema.
3. Actualizar etiquetas en `apps/web/src/i18n/messages.ts` y estilos de los controles en `apps/web/src/styles.css`.
4. Cubrir preferencias guardadas, cambios de sistema, modos fijos y errores de almacenamiento con pruebas pertinentes; revisar manualmente Configuración y ambos temas.

## Riesgos y validación

- Una preferencia fija no debe reemplazarse automáticamente por la del sistema durante la migración.
- El navegador puede exponer una preferencia diferente de la del sistema operativo; la aplicación sigue la preferencia comunicada por el navegador.
- Ejecutar `bun run typecheck`, las pruebas pertinentes y `bun run build`; verificar cambios en vivo, recarga y ambos idiomas. Reportar lo que efectivamente se ejecute.

### Evidencia

- `bun run typecheck` y `bun run build` finalizaron correctamente.
- `bun test tests/theme-preferences.test.ts tests/certification-ui-data.test.ts`: 12 pruebas aprobadas, incluyendo valores guardados, ausencia de almacenamiento, cambios de sistema y limpieza del listener.
- La revisión manual en navegador y el cambio del tema del dispositivo real quedan pendientes: el navegador de esta sesión no estaba disponible.

## Reversión

Revertir los cambios de frontend. Los valores anteriores `light` y `dark` siguen siendo compatibles; si se revierte después de guardar `system`, la versión anterior consulta el tema del sistema una vez al iniciar.
