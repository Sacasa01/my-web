# ⚖️ constitution.md — Principios Inviolables y Límites No Negociables

Este documento establece las **leyes inmutables** de desarrollo para el portfolio web de **Santiago Castro Salt**. Ningún cambio, refactorización o propuesta de IA puede violar estos principios.

---

## 🏛️ 1. Principio de Cero Alucinación (Zero-Hallucination Policy)

- Todos los contenidos del portfolio deben reflejar **exclusivamente** la información técnica, académica y laboral real definida en `src/app/lib/cv-context.ts`.
- Queda terminantemente prohibido inventar métricas, tecnologías no dominadas, certificaciones no cursadas o falsas disponibilidades laborales.
- La aplicación es 100% estática client-side en Angular 19, sin dependencias de API keys externas ni endpoints serverless.

---

## 🚀 2. Rendimiento Extremo y Cero Librerías Innecesarias

- **Prohibido instalar paquetes pesados** para tareas que puedan resolverse con CSS nativo, Tailwind o APIs estándar del navegador (ej. no añadir librerías 3D pesadas si el sistema se apoya en bucles de vídeo optimizados).
- Las transiciones visuales, desenfoques y máscaras deben apoyarse en aceleración por hardware de la GPU (`transform`, `opacity`, `filter: blur()`, `mask-image`).
- El sitio debe mantener métricas de Google Lighthouse $\ge 90$ en Performance, Accesibilidad y Mejores Prácticas.

---

## 🎬 3. Integración Visual y Suavidad de Vídeo

- **Cero Parpadeos Negros**: Las transiciones entre estados del avatar deben ejecutarse mediante fundido cruzado de opacidad (`transition-opacity duration-500 ease-in-out`) manteniendo las capas de vídeo precargadas en el DOM.
- **Máscara de Recorte Obligatoria**: El contenedor de vídeos debe mantener siempre la máscara radial suave para fundirse con el fondo del estudio `#d6d6d6` sin generar cortes o rectángulos visibles.
- **Sin Botones de Depuración en Producción**: Los cambios de estado son 100% automáticos y reactivos ante las interacciones del usuario.

---

## 📦 4. Centralización y Portabilidad de Datos

- **Separación estricta entre Datos y Vistas**: Todos los textos de CV, proyectos, métricas, enlaces e hitos deben estar centralizados en `src/app/lib/cv-context.ts`.
- Añadir o modificar un proyecto debe ser tan sencillo como editar una constante tipada en TypeScript, sin necesidad de reescribir plantillas HTML ni duplicar texto en múltiples componentes.

---

## 📐 5. Calidad de Código y Convenciones

- **Código 100% en Inglés**: Clases, variables, métodos, componentes, nombres de archivo y carpetas deben redactarse en inglés técnico.
- **Buenas Prácticas**: Principios SOLID, Angular Standalone Components, tipado estricto sin `any` innecesarios y funciones puras.
- **Commits Estructurados**: Formato obligatorio `gitmoji + keyword + description` en inglés (ej. `✨ feat: ...`, `♻️ refactor: ...`, `📝 docs: ...`).
- **Gestor de Paquetes**: `pnpm` exclusivamente.
