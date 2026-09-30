# Cert Helper

PoC local para practicar la certificación Google Cloud Professional Cloud Developer.

## Requisitos

- Bun 1.3 o posterior

## Ejecutar localmente

```bash
bun install
bun run dev
```

Abre `http://localhost:3000` en el navegador. El banco se carga desde `public/data/certifications.json`; para agregar o editar preguntas, conserva la estructura y una respuesta correcta por pregunta.

## Recorrido

- Inicia una sesión con las 20 preguntas, en el orden del banco.
- La opción **Simulación Real** usa **Siguiente pregunta** para registrar la respuesta elegida y avanzar en un solo paso. Permite un intento por pregunta y muestra la nota y los dominios por repasar al final, sin revelar aciertos ni respuestas durante la sesión.
- Una respuesta correcta al primer intento cuenta para el puntaje diagnóstico.
- Las respuestas correctas después de reintentar y las respuestas reveladas aparecen por separado en el resultado.
- El tema visual se puede cambiar entre claro y oscuro y la preferencia se conserva en este navegador.

## Alcance local

No hay backend ni almacenamiento de sesiones. Salir de la simulación o actualizar la página reinicia el progreso. El JSON se entrega al navegador e incluye las respuestas correctas, por lo que este PoC sirve para estudiar y no para administrar un examen seguro.

## Comandos disponibles

- `bun run dev`: servidor local de desarrollo
- `bun run build`: compilación y pre-renderizado estático
- `bun run preview`: vista previa de la compilación
- `bun run typecheck`: verificación de tipos TypeScript
