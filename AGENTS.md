# 🤖 AGENTS.md — Directrices de Contexto y Comportamiento del Repositorio

Este repositorio contiene el **Portfolio Web Interactivo y Gemelo Digital con IA** de **Santiago Castro Salt** (Ingeniero de Backend e Integración de Sistemas de IA).

Cualquier agente de IA que opere en este repositorio **DEBE** leer, respetar y seguir estas directrices sin excepción.

---

## 🛠️ 1. Stack Tecnológico y Herramientas

- **Framework Frontend**: Angular 19 (Standalone Components, Signals, Control Flow `@if`/`@for`).
- **Lenguaje**: TypeScript (Strict mode activado).
- **Estilos y Diseño**: Tailwind CSS + CSS Moderno (Glassmorphism, Radial Gradient Masks).
- **Arquitectura**: 100% Client-Side Estático en Vercel (cero APIs externas o API keys requeridas).
- **Gestor de Paquetes**: **`pnpm` (v11+)** exclusivamente. *(Prohibido usar `npm` o `yarn`)*.
- **Entorno de Ejecución**: Node.js v20+ en Windows (PowerShell).

---

## 📁 2. Estructura de Carpetas del Proyecto

```
MY-WEB/
├── AGENTS.md                     # Este archivo (Instrucciones operativas del agente)
├── spec.md                       # Especificación técnica del portfolio y proyectos
├── prompts.md                    # Flujo estructurado de prompts por fases
├── constitution.md               # Reglas no negociables y límites de calidad
├── public/
│   ├── assets/                   # Imágenes, avatares estáticos y logos
│   └── videos/                   # Vídeos optimizados para la máquina de estados
│       └── avatar-typing-loop.mp4 / .webm   (TYPING)
├── src/
│   ├── app/
│   │   ├── lib/
│   │   │   └── cv-context.ts     # Fuente de verdad de datos técnicos y CV
│   │   ├── app.component.ts      # Controlador maestro del portfolio
│   │   ├── app.component.html    # Vistas editoriales y posters interactivos
│   │   └── app.component.css     # Estilos y micro-animaciones del layout
│   └── styles.css                # Utilidades globales y tipografías
└── vercel.json                   # Configuración de despliegue estático en Vercel
```

---

## 💻 3. Comandos Permitidos

| Acción | Comando |
| :--- | :--- |
| **Instalación de dependencias** | `pnpm install` |
| **Añadir dependencia** | `pnpm add <package>` (o `-D` para dev) |
| **Servidor de desarrollo local** | `pnpm start` (disponible en `http://localhost:4200`) |
| **Compilación de producción** | `pnpm build` |
| **Linter / Verificación** | `pnpm lint` |

---

## 📐 4. Reglas de Código y Convenciones

1. **Idioma de Comunicación**: Comunícate con el usuario en **español**, con tono conciso, profesional y directo.
2. **Idioma del Código**: Escribe **todo el código en inglés** (variables, métodos, componentes, nombres de archivos y comentarios técnicos).
3. **Nomenclatura**:
   - Variables, métodos y signals: `camelCase` (ej. `avatarState`, `isSpeechBubbleOpen`).
   - Componentes, interfaces y tipos: `PascalCase` (ej. `AvatarContainerComponent`, `CandidateProfile`).
   - Archivos y carpetas: `kebab-case` (ej. `speech-bubble.component.ts`).
4. **Git y Commits**:
   - Formato obligatorio: `gitmoji + keyword + description` en inglés.
   - Ejemplos: `✨ feat: add speech bubble streaming`, `🐛 fix: resolve video opacity blend`, `📝 docs: add AGENTS.md`.

---

## 🎬 5. Reglas Específicas del Avatar y Gemelo Digital

1. **Cero Parpadeos Negros**: Todos los clips de vídeo deben convivir en el DOM superpuestos (`absolute inset-0`) con transición de opacidad suave (`transition-opacity duration-500 ease-in-out`).
2. **Bordes Suavizados**: El contenedor de vídeos debe mantener siempre la máscara radial de recorte:
   `mask-image: radial-gradient(circle at center, black 70%, transparent 100%)`.
3. **Control Automático**: No añadir barras de botones manuales de depuración en producción. Los cambios de estado son automáticos por eventos de usuario.
4. **Fidelidad de Datos**: El Gemelo Digital solo debe responder con datos verificados en `cv-context.ts` (Dublin 2026, Hospital La Fe, FitForge, Legacy Land Mapper, Canterbury degree).
