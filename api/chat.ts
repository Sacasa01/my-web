import { GoogleGenerativeAI } from '@google/generative-ai';
import { SANTIAGO_CV_CONTEXT, SANTIAGO_MARKDOWN_CV } from '../lib/cv-context';

export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env['GEMINI_API_KEY'];

    // Fallback simulated streaming response if no API key is provided during local dev
    if (!apiKey) {
      return createLocalFallbackStream(message);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `${SANTIAGO_CV_CONTEXT.systemPrompt}\n\n[CONTEXTO TÉCNICO COMPLETO]:\n${SANTIAGO_MARKDOWN_CV}\n\nJSON Data:\n${JSON.stringify(SANTIAGO_CV_CONTEXT, null, 2)}`
    });

    const chat = model.startChat({
      history: history.map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error: any) {
    console.error('Gemini streaming error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Local mock streaming generator for robust offline testing
function createLocalFallbackStream(query: string): Response {
  const encoder = new TextEncoder();
  const lower = query.toLowerCase();

  let reply = "¡Hola! Como gemelo digital de Santiago Castro Salt, me especializo en ingeniería de backend (Python, Go, Symfony 7) y sistemas de IA aplicada (PyTorch, MONAI, agentes MCP). ¿En qué proyecto o aspecto técnico te gustaría profundizar?";

  if (lower.includes('dublin') || lower.includes('irlanda') || lower.includes('reloc') || lower.includes('disponib') || lower.includes('on-site')) {
    reply = "Estaré disponible físicamente en Dublín para incorporarme de forma presencial / híbrida a partir del 30 de Septiembre de 2026. Busco unirme a un equipo de ingeniería o startup puntera en roles de Backend o AI Systems Integration, con total compromiso de conversión a contrato indefinido.";
  } else if (lower.includes('la fe') || lower.includes('hospital') || lower.includes('fertoolity') || lower.includes('medic') || lower.includes('monai')) {
    reply = "En el Hospital Universitari i Politècnic La Fe desarrollé pipelines de segmentación con Deep Learning utilizando PyTorch y MONAI para exploraciones ginecológicas. Logramos una métrica Dice > 0.942 y una latencia de inferencia de 16 ms por corte.";
  } else if (lower.includes('fitforge') || lower.includes('symfony') || lower.includes('angular')) {
    reply = "FitForge es mi plataforma fitness full-stack con arquitectura desacoplada: backend REST con Symfony 7 (33 endpoints, JWT, MySQL 8 con 14 tablas relacionales) y frontend Angular Standalone, todo orquestado en contenedores Docker.";
  } else if (lower.includes('mcp') || lower.includes('agent') || lower.includes('vector') || lower.includes('qdrant')) {
    reply = "Tengo experiencia construyendo servidores bajo el estándar Model Context Protocol (MCP), bases vectoriales Qdrant para recuperación semántica (RAG) y bucles de agentes ReAct con llamadas estructuradas a funciones (Function Calling).";
  }

  const words = reply.split(' ');
  let index = 0;

  const stream = new ReadableStream({
    async pull(controller) {
      if (index < words.length) {
        const word = words[index] + (index === words.length - 1 ? '' : ' ');
        controller.enqueue(encoder.encode(word));
        index++;
        await new Promise(r => setTimeout(r, 45));
      } else {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}
