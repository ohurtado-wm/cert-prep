# Plan propuesto: administrar certificaciones desde un formulario

**Estado:** Propuesta; pendiente de aprobación de alcance y decisiones de autorización.

## Problema

La definición de certificaciones como datos mantenidos en código hace que cada alta o actualización requiera cambios técnicos y despliegue. Un catálogo administrable necesita preservar la procedencia de sus fuentes y controlar qué certificaciones aparecen para estudio.

## Objetivo

Permitir que una persona administradora autorizada cree, revise, publique, edite y retire certificaciones mediante una interfaz, con validación de fuentes y trazabilidad de cambios.

## Modelo de datos propuesto

Cada certificación contiene:

- Proveedor o plataforma, como Google Cloud o Microsoft Azure.
- ID estable, nombre en español e inglés y código del examen.
- Fuentes oficiales con tipo y URL: guía del examen, página de certificación y recursos de aprendizaje.
- Estado de publicación: borrador, publicada o retirada.
- Versión del catálogo y metadatos suficientes para relacionar guías, sesiones e historial.

El proveedor selecciona en servidor la allowlist y el contexto de generación. Una persona administradora puede escoger fuentes dentro de esa política, pero no puede agregar dominios confiables desde el formulario.

## Flujo propuesto

1. Crear un borrador con metadatos y fuentes oficiales.
2. Validar ID, campos requeridos, tipos de fuente, HTTPS y dominio permitido para el proveedor.
3. Solicitar una vista previa. El sistema genera una guía, valida citas y pesos, y muestra fuentes, dominios y ruta para revisión.
4. Publicar después de la revisión autorizada. Solo las certificaciones publicadas aparecen en el catálogo de estudio.
5. Al editar fuentes, invalidar o versionar la guía para evitar reutilizar contenido basado en URLs anteriores.
6. Al retirar una certificación, ocultarla de sesiones nuevas sin borrar su identidad ni referencias necesarias para historial y planes existentes.

## Componentes

- Migraciones para proveedor, metadatos, fuentes múltiples, estado, versión y auditoría.
- API administrativa CRUD con autorización explícita; el endpoint público devuelve solo certificaciones publicadas.
- Formulario con validación, estados de error, vista previa de fuentes y guía, publicación y retiro.
- Registro auditable de creación, edición, publicación y retiro.
- Invalidación/versionado de guías cuando cambien datos que afectan su generación.
- Pruebas de autorización, URLs, transiciones de estado, publicación y conservación de historial.

## Seguridad e invariantes

- La allowlist vive en configuración o código del servidor y nunca se deriva de campos editables.
- El ID publicado es inmutable; una modificación de identidad oficial requiere una entrada nueva.
- Se prefiere el retiro lógico al borrado para no romper sesiones, resultados y planes.
- Solo una identidad con rol administrativo puede gestionar el catálogo. No se presupone que la identidad del gateway incluya ese rol.

## Criterios de aceptación

- Un usuario no autorizado no puede crear, editar, previsualizar, publicar ni retirar certificaciones.
- El catálogo público expone solo entradas publicadas y conserva IDs y URLs válidos.
- Una fuente que no pertenece al proveedor o no usa HTTPS se rechaza.
- Cambiar fuentes impide reutilizar una guía generada con otra versión del catálogo.
- Retirar una certificación no elimina historial ni invalida referencias de sesiones y planes ya creados.
- Cada transición administrativa deja un evento de auditoría atribuible a una identidad autorizada.

## Decisiones pendientes antes de implementar

- Definir cómo se asigna y verifica el rol administrativo.
- Determinar si publicar requiere aprobación de una segunda persona y qué rol puede aprobar.
- Definir reglas de versionado e invalidación de guías y cómo se representa una versión retirada en resultados antiguos.
- Aprobar el alcance, la migración de certificaciones existentes y el plan de recuperación antes de reemplazar la fuente estática.

Esta iniciativa es independiente de los planes de catálogo y generación; no debe ampliar las allowlists ni cambiar el contrato público sin una decisión aprobada.
