# 🤖 AGENTS.md — Directrices de Contexto y Comportamiento del Repositorio

Este repositorio contiene el **Portfolio Web Interactivo** de **Santiago Castro Salt** (Ingeniero de Backend e Integración de Sistemas de IA).

Cualquier agente de IA que opere en este repositorio **DEBE** leer, respetar y seguir estas directrices sin excepción.

---

## 🛠️ 1. Stack Tecnológico y Herramientas

- **Framework Frontend**: Angular 19 (Standalone Components, Signals, Control Flow `@if`/`@for`).
- **Lenguaje**: TypeScript (Strict mode activado).
- **Estilos y Diseño**: Tailwind CSS + CSS Moderno (Glassmorphism, Bento Grid).
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
│   ├── assets/                   # Imágenes, logos y assets de proyectos
│   └── certificates/             # Certificaciones oficiales en PDF
├── src/
│   ├── app/
│   │   ├── lib/
│   │   │   └── cv-context.ts     # Fuente de verdad de datos técnicos y CV
│   │   ├── app.component.ts      # Controlador maestro del portfolio
│   │   ├── app.component.html    # Vistas bento grid y modales interactivos
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
| **Tests unitarios** | `pnpm test -- --watch=false --browsers=ChromeHeadless` |

---

## 📐 4. Reglas de Código y Convenciones

1. **Idioma de Comunicación**: Comunícate con el usuario en **español**, con tono conciso, profesional y directo.
2. **Idioma del Código**: Escribe **todo el código en inglés** (variables, métodos, componentes, nombres de archivos y comentarios técnicos).
3. **Nomenclatura**:
   - Variables, métodos y signals: `camelCase` (ej. `selectedProject`, `isDarkMode`).
   - Componentes, interfaces y tipos: `PascalCase` (ej. `AppComponent`, `CandidateProfile`).
   - Archivos y carpetas: `kebab-case` (ej. `app.component.ts`).
4. **Git y Commits**:
   - Formato obligatorio: `gitmoji + keyword + description` en inglés.
   - Ejemplos: `✨ feat: add project modal detail`, `🐛 fix: resolve sticky header blur`, `📝 docs: update AGENTS.md`.

---

## 🏛️ 5. Principios Arquitectónicos y Fidelidad de Datos

1. **100% Estático Client-Side**: No añadir dependencias de backend, serverless functions ni claves de API externas.
2. **Fidelidad de Datos**: Todos los datos deben ser fieles a `cv-context.ts` (Dublin 2026, Hospital La Fe, FitForge, Legacy Land Mapper, Canterbury degree).
3. **Rendimiento y Accesibilidad**: Mantener bundles optimizados, animaciones GSAP eficientes y soporte responsive.
