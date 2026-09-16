# 🚀 prompts.md — Flujo de Trabajo y Secuencia de Prompts para la IA

Este documento define la **secuencia de prompts recomendada** para interactuar con la IA de manera estructurada en lugar de solicitar cambios masivos en un único prompt.

---

## 🧭 FASE 1: Entrevista y Refinamiento de Requisitos (Interview Phase)

> **Objetivo**: Antes de escribir código, pedir a la IA que revise la especificación (`spec.md`) y formule preguntas sobre cualquier detalle ambiguo o decisión técnica crítica.

### 📝 Prompt de Fase 1:
```markdown
Actúa como un Desarrollador Full-Stack Senior y Arquitecto de Software.
Revisa detenidamente los archivos `AGENTS.md`, `spec.md` y `constitution.md`.

Quiero implementar [NOMBRE DE LA FUNCIONALIDAD / MÓDULO].

Antes de escribir código o modificar archivos:
1. Identifica posibles ambigüedades o conflictos con la arquitectura actual.
2. Hazme entre 2 y 4 preguntas clave para acotar el comportamiento, inputs/outputs y experiencia de usuario.
3. Propón un plan de alto nivel en 3 o 4 pasos.
```

---

## 🏛️ FASE 2: Arquitectura y Diseño de Componentes (Design Phase)

> **Objetivo**: Diseñar la estructura de componentes, interfaces TypeScript, contratos de datos y paleta visual antes de la implementación.

### 📝 Prompt de Fase 2:
```markdown
Con base en mis respuestas de la Fase 1, diseña la arquitectura técnica detallada:
1. Define las interfaces TypeScript y modelos de datos necesarios en `src/app/lib/`.
2. Detalla el desglose de componentes (Inputs, Outputs, Signals y eventos reactivos).
3. Especifica las clases de Tailwind CSS y la disposición visual (adaptada al diseño studio light `#d6d6d6` y tipografía editorial).
4. Confirma que la solución respeta los principios inviolables de `constitution.md`.

Muestra únicamente la propuesta arquitectónica y espera mi aprobación antes de crear o editar archivos.
```

---

## 💻 FASE 3: Implementación Incremental y Verificación (Implementation Phase)

> **Objetivo**: Programar componente a componente de forma atómica, probando cada pieza antes de pasar a la siguiente.

### 📝 Prompt de Fase 3 (Paso a Paso):
```markdown
Aprobada la arquitectura de la Fase 2. Procede a implementar el Paso 1: [NOMBRE DEL COMPONENTE / SERVICIO].

Requisitos estrictos:
- Escribe el código completo en TypeScript / Angular 19 Standalone siguiendo las convenciones de `AGENTS.md`.
- No añadas librerías externas pesadas no autorizadas.
- Comprueba que la compilación (`pnpm build`) pase con 0 errores y 0 warnings.
- Registra el cambio con un commit semántico en Git con Gitmoji.
```

---

## ⚡ Prompts Rápidos de Mantenimiento y Operaciones Habituales

### 1. Añadir un nuevo proyecto al portfolio
```markdown
Quiero añadir un nuevo proyecto destacado a mi portfolio:
- Nombre: [Nombre del Proyecto]
- Rol: [Tu rol]
- Stack técnico: [Lista de tecnologías]
- Métricas o logros: [Métricas clave]
- Descripción técnica: [1 o 2 párrafos técnicos]

Actualiza `src/app/lib/cv-context.ts`, el System Prompt del Gemelo Digital y la tarjeta visual en el slide correspondiente.
```

### 2. Actualizar disponibilidad o hitos académicos
```markdown
Quiero actualizar mi disponibilidad laboral / hito académico en `cv-context.ts`:
- Nuevo dato: [Ej. Certificación AWS AI Practitioner obtenida / Nivel de inglés C1 certificado].

Propaga el cambio al badge del Hero, la tarjeta de perfil en Slide 01 y la base de conocimiento del chat IA.
```

### 3. Ajustar transiciones del Avatar o afinado de vídeo
```markdown
Revisa el componente `AvatarContainerComponent`. Necesito afinar la transición del estado [ESTADO A] a [ESTADO B] para que [comportamiento deseado]. Asegúrate de mantener la máscara de suavizado radial y cero parpadeos negros.
```
