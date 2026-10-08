# Propuesta: administrar certificaciones desde un formulario

**Estado:** Propuesta para trabajo futuro; no forma parte del alcance de AI-901.

## Problema

El catálogo actual está declarado en `server/catalog/certifications.ts`. Cada nueva certificación requiere un cambio de código y despliegue. Además, sus fuentes y generación de contenido dependen de reglas codificadas para proveedores específicos.

## Objetivo

Permitir que una persona administradora autorizada cree, revise, publique, edite y retire certificaciones desde una pantalla de administración, sin modificar código para cada alta.

## Propuesta

Crear un formulario administrativo respaldado por un catálogo persistido en la base de datos. Cada registro tendría, como mínimo:

- Proveedor/plataforma, por ejemplo Google Cloud o Microsoft Azure.
- ID estable, nombre en inglés y español y código del examen.
- Fuentes oficiales con tipo y URL: guía del examen, certificación y recursos de aprendizaje.
- Estado: borrador, publicado o retirado.

El proveedor determinaría en el servidor la allowlist de dominios válidos y el contexto de los prompts. La persona administradora podría elegir fuentes, pero no agregar dominios confiables a la allowlist desde el formulario.

## Flujo propuesto

1. La persona administradora crea un borrador con metadatos y enlaces oficiales.
2. El backend valida el ID, campos requeridos, tipos de fuente, HTTPS y que cada URL corresponda a un dominio oficial permitido para el proveedor.
3. La persona administradora solicita una vista previa. El sistema genera la guía usando la guía oficial, verifica citas y suma de pesos, y muestra los dominios, fuentes y ruta de estudio para revisión.
4. La persona administradora publica el registro. Solo las certificaciones publicadas aparecen en el catálogo de estudio.
5. Ediciones a fuentes invalidan o versionan la guía generada para que no se reutilice contenido basado en enlaces anteriores.
6. Retirar una certificación la oculta de nuevas sesiones, pero conserva el registro y sus referencias para historial y planes existentes.

## Componentes que requeriría

- Migración para guardar proveedor, metadatos, fuentes múltiples, estado y versión del catálogo.
- API administrativa CRUD con autorización de rol; el endpoint público de catálogo expone solo elementos publicados.
- Pantalla y formulario con validación de campos, estados de error y vista previa de fuentes/guía.
- Registro de auditoría para altas, cambios, publicación y retiro.
- Invalidación/versionado de guías al cambiar el contenido o las fuentes, manteniendo trazabilidad con simulaciones previas.
- Pruebas de autorización, validación de URLs, transición de estados, publicación y preservación del historial.

## Seguridad y decisiones pendientes

- La allowlist de dominios debe seguir siendo código/configuración del servidor, separada de los datos que ingresa el formulario.
- La publicación requiere una identidad con rol administrativo. Antes de implementar, definir de dónde proviene ese rol: el flujo actual identifica al usuario, pero esta propuesta no asume que exista autorización de administración.
- El ID publicado debe ser inmutable; para corregir una certificación se edita su metadata o se crea un nuevo registro si cambia su identidad oficial.
- Preferir retiro lógico sobre borrado para no romper sesiones, resultados y planes persistidos.
- Determinar si una vista previa de guía requiere aprobación explícita antes de publicar y qué rol puede aprobarla.

## Secuencia sugerida para trabajo futuro

1. Fijar modelo de datos, roles administrativos y reglas de publicación.
2. Agregar persistencia, API administrativa, allowlists y auditoría.
3. Implementar formulario, vista previa y publicación; migrar las certificaciones actuales al catálogo persistido.
4. Retirar la lista hardcodeada solo después de verificar el catálogo persistido y las rutas públicas existentes.

## Fuera del alcance actual

Esta propuesta no se implementa con el plan de AI-901. Ese trabajo agregará `azure-ai-fundamentals` al catálogo actual y preparará el sistema multi proveedor manteniendo por ahora la definición de certificaciones en código.
