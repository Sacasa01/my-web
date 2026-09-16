# 📋 spec.md — Especificación Técnica del Portfolio Web

## 🎯 1. Objetivo del Proyecto

Construir un portfolio web interactivo de alto impacto técnico y visual para **Santiago Castro Salt**, orientado a reclutadores técnicos y hiring managers internacionales para posiciones **On-Site en Dublín a partir del 30 de Septiembre de 2026** o **100% Remoto Internacional** en roles de **Backend & AI Systems Integration**.

---

## 🏛️ 2. Arquitectura de Secciones y Contenidos

### Secciones Principales:

1. **Slide 00: Hero Studio Poster ("PORT [Avatar] FOLIO")**
   - Monumental titular tipográfico editorial (*Bebas Neue* / *Big Shoulders*).
   - Avatar pseudo-3D interactivo en el centro con máscara de suavizado radial.
   - Botón de cambio de idioma (`EN` / `ES`) y selector de tema (`Light` / `Dark`).

2. **Slide 01: Introducción y Perfil Ejecutivo**
   - Tarjeta de identidad con foto de perfil, edad (23 años, Valencia), idiomas (Inglés C1 Goal, Español/Valenciano nativos).
   - Rationale de contratación (*¿Por qué contratar a Santiago?*).
   - Competencias clave en Backend, Deep Learning clínico, Agentes MCP y Cloud AWS/Docker.

3. **Slide 02: Tabla de Contenidos // Índice de Proyectos (01 — 06)**
   - Navegación rápida tipo editorial hacia cada módulo de especialización técnica.

4. **Slide 03: 01 // Fertoolity AI Lab (Hospital La Fe)**
   - Pipeline de segmentación médica con PyTorch, MONAI y FastAPI.
   - Métricas: Dice Score > 0.942, Latencia de GPU 16 ms/corte.
   - Sandbox interactivo en vivo con selector de cortes anatómicos (1 a 48) y visualizador SVG de inferencia.

5. **Slide 04: 02 // FitForge SPA (Full-Stack Desacoplado)**
   - Arquitectura desacoplada: Symfony 7 REST API (33 endpoints, JWT, RBAC) + Angular Standalone + Docker.
   - Carrusel interactivo con los 5 submódulos del sistema.

6. **Slide 05: 03 // Legacy Land Mapper (Geospatial Engine)**
   - Motor multihilo en Python 3 + Pandas para la API WFS del Catastro oficial de España.
   - 20 workers concurrentes con reducción de latencia > 90%.

7. **Slide 06: 04 // Sistemas de IA & Agentes MCP**
   - Desglose de arquitectura: Protocolo MCP, bases vectoriales Qdrant, bucles ReAct con Function Calling.

8. **Slide 07: 05 // Cloud Infrastructure & DevOps**
   - AWS Stack (EC2, S3, RDS, Lambda, Bedrock), Docker Compose multi-stage y pipelines CI/CD.

9. **Slide 08: 06 // Roadmap, Educación y Certificaciones**
   - Grado en Ingeniería Informática (BSc Hons Top-Up en Canterbury Christ Church University, UK / MSMK Madrid).
   - CFGS DAW (Nota: 7.00).
   - Certificaciones AWS Cloud Practitioner (2025), AWS AI Practitioner (2026), GitHub Copilot.

10. **Slide 09: 07 // Conectar y Canales Directos**
    - Llamadas directas a la acción para contacto y entrevistas técnicas (email interactivo con copia en un clic, LinkedIn y GitHub).

---

## 🎨 3. Especificación de Componentes Interactivos y Modales

### Modales de Proyectos y Educación:
- **Proyectos Flagship**: Bento grid interactivo con apertura de modal modal accesible vía clic y cierre con tecla `Escape` o backdrop.
- **Detalle de Educación**: Visualización modal con métricas académicas detalladas y enlaces oficiales a certificaciones en PDF.
- **Cordón de Contacto**: Botón colgante retraíble con animación elástica e indicador de estado interactivo.

---

## ⚡ 4. Requisitos No Funcionales (NFR)

1. **Rendimiento**: Puntuación de Google Lighthouse $\ge 90$ en Performance, Accesibilidad y Mejores Prácticas.
2. **Cero Parpadeo en Vídeo**: Transiciones fluidas entre clips con fundido cruzado (`opacity 500ms`) sin pantallas en negro.
3. **Aislamiento de Datos**: Todo el contenido técnico y de CV reside centralizado en `src/app/lib/cv-context.ts`.
4. **Diseño Responsive Mobile-First**: Adaptación limpia desde pantallas móviles (360px) hasta pantallas 4K.
5. **SEO & Metadatos**: Etiquetas OpenGraph y Twitter Cards configuradas para vista previa en LinkedIn/X.
