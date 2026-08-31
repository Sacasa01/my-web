import { Injectable } from '@angular/core';
import { SANTIAGO_CV_CONTEXT } from '../lib/cv-context';

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  async streamChat(
    message: string,
    history: { role: string; content: string }[],
    onChunk: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (err: any) => void
  ): Promise<void> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });

      if (!response.ok || !response.body) {
        // If /api/chat is not running locally or returns error, execute local streaming generator
        return this.localSimulatedStream(message, onChunk, onComplete);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(fullText);
      }

      onComplete(fullText);
    } catch (error) {
      console.warn('Backend /api/chat stream unreachable, falling back to local engine:', error);
      this.localSimulatedStream(message, onChunk, onComplete);
    }
  }

  private async localSimulatedStream(
    query: string,
    onChunk: (text: string) => void,
    onComplete: (fullText: string) => void
  ): Promise<void> {
    const q = query.toLowerCase();
    let reply = "Me especializo en ingeniería de Backend e Integración de Sistemas de IA (Python, Go, Symfony 7, PyTorch, agentes MCP). Con experiencia clínica en el Hospital La Fe y proyectos como FitForge y Legacy Land Mapper, construyo arquitecturas limpias y escalables. ¿Qué detalle técnico te gustaría conocer?";

    if (q.includes('dublin') || q.includes('irlanda') || q.includes('ireland') || q.includes('reloc') || q.includes('disponib') || q.includes('on-site')) {
      reply = "Tengo disponibilidad física inmediata para incorporarme de forma presencial / híbrida en Dublín a partir del 30 de Septiembre de 2026, así como en Remoto Internacional 100%. Busco unirme a un equipo de ingeniería o startup puntera en roles de Backend o AI Systems Integration, con total compromiso de conversión a contrato indefinido.";
    } else if (q.includes('la fe') || q.includes('hospital') || q.includes('fertoolity') || q.includes('medic') || q.includes('monai') || q.includes('pytorch')) {
      reply = "En la División de IA del Hospital Universitari i Politècnic La Fe desarrollé modelos de Deep Learning en visión por computador con PyTorch y MONAI para segmentación de ecografías ginecológicas. Alcanzamos un coeficiente Dice de validación > 0.942 y 16 ms de latencia por corte en GPU.";
    } else if (q.includes('fitforge') || q.includes('fit') || q.includes('symfony') || q.includes('angular') || q.includes('docker')) {
      reply = "FitForge es mi plataforma fitness full-stack (TFG) con arquitectura desacoplada: backend REST en Symfony 7 (33 endpoints, JWT, MySQL 8 con 14 tablas) y frontend Angular Standalone con voters RBAC de seguridad, orquestado con Docker Compose.";
    } else if (q.includes('mapper') || q.includes('land') || q.includes('catastro') || q.includes('wfs') || q.includes('geo')) {
      reply = "Legacy Land Mapper es una herramienta geoespacial de alto rendimiento en Python/Pandas que consulta la API WFS oficial del Catastro. Gracias a una arquitectura multihilo con 20 workers, reduce los tiempos de extracción masiva en más del 90%.";
    } else if (q.includes('mcp') || q.includes('agent') || q.includes('vector') || q.includes('qdrant') || q.includes('rag')) {
      reply = "Tengo experiencia implementando servidores bajo el estándar Model Context Protocol (MCP), bases vectoriales Qdrant para recuperación semántica (RAG) y bucles de razonamiento ReAct con llamadas estructuradas a funciones (Function Calling).";
    } else if (q.includes('estudio') || q.includes('universidad') || q.includes('canterbury') || q.includes('education') || q.includes('degree')) {
      reply = "Estoy cursando el Grado en Informática (BSc Hons Top-Up) en Canterbury Christ Church University (Reino Unido / sede MSMK Madrid), complementado con mi titulación DAW (nota media 7.00) y la certificación AWS Cloud Practitioner.";
    } else if (q.includes('stack') || q.includes('tecnolog') || q.includes('lenguaj')) {
      reply = "Mi stack principal abarca: Lenguajes (Python 3, Go, PHP 8/Symfony 7, TypeScript), IA (PyTorch, MONAI, MCP, Qdrant, Bedrock), Cloud (AWS, Docker, CI/CD, Nginx) y Bases de Datos (PostgreSQL, MySQL 8, pgvector, Redis).";
    }

    const words = reply.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      onChunk(currentText);
      await new Promise(r => setTimeout(r, 28));
    }

    onComplete(currentText);
  }
}
