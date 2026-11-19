# ADR 0002: Nombre completo desde la identidad del gateway

**Estado:** Propuesto
**Fecha:** 2026-11-18

## Contexto

El menú de usuario requiere mostrar el nombre completo. El contrato existente de `/api/v1/me` incluye un ID estable, correo y avatar opcionales. La estructura del nombre que proporciona `/users/me` no está documentada en el repositorio.

## Criterios

- Obtener los datos de la identidad validada por el gateway, sin generar nombres a partir de correos o IDs.
- Mantener el ID estable como autoridad para propiedad y acceso a datos.
- Conservar compatibilidad cuando no exista nombre y evitar fallas de autenticación por un dato de perfil opcional inválido.
- Evitar persistir el nombre o agregar una nueva fuente de identidad.

## Opciones

1. Mostrar correo o ID: no requiere contrato nuevo, pero no satisface la solicitud de nombre completo cuando el gateway lo ofrece.
2. Propagar un nombre completo opcional desde el gateway a `/api/v1/me`: permite mostrarlo sin alterar propiedad ni almacenamiento, pero requiere confirmar el campo real del proveedor.
3. Usar otro directorio o una entrada manual: agrega una fuente de perfil y coordinación fuera del alcance aprobado.

## Propuesta

Añadir `fullName` como dato opcional en el contrato público y en la identidad interna. La integración y el nombre del campo quedan pendientes hasta confirmar la estructura real del gateway. Por ahora la interfaz muestra el correo o ID y el contrato no se modifica. Si falta o es inválido, omitirlo y mostrar correo o ID; el resto de la identidad sigue validándose como antes. No almacenar el nombre en PostgreSQL.

## Consecuencias y validación

El cambio es aditivo; clientes existentes pueden ignorar el campo. La disponibilidad del nombre en producción depende del campo que entregue el gateway. Cubrir la propagación y la ausencia o invalidez del nombre, y confirmar el mapeo con documentación o una respuesta segura del proveedor antes de darlo por verificado. No marcar esta propuesta como aceptada sin aprobación explícita.

## Referencias

- [Plan de rediseño y navegación](../plans/ui-redesign-plan.md)
- [ADR 0001](0001-workspaces-single-runtime.md)
