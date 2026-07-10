const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Posts que necesitan imágenes OG
const postsNeedingImages = [
  {
    file: 'agentes-ia-en-kubernetes-deploy-y-escalado.mdx',
    title: 'Agentes IA en Kubernetes: Deploy y Escalado',
    tags: ['agentes-ia', 'kubernetes', 'gcp', 'devops'],
    category: 'DevOps'
  },
  {
    file: 'agentes-ia-en-produccin-el-patrn-orchestrator-worker-de-rippling.mdx',
    title: 'Agentes IA en Producción: El Patrón Orchestrator-Worker de Rippling',
    tags: ['agentes-ia', 'produccion', 'orchestrator-worker', 'automatizacion'],
    category: 'Arquitectura'
  },
  {
    file: 'arquitectura-hexagonal-agentes-ia-patrones-mcp.mdx',
    title: 'Arquitectura Hexagonal con Agentes IA: Patrones de Integración Prácticos',
    tags: ['arquitectura', 'hexagonal', 'agentes-ia', 'mcp', 'python'],
    category: 'Arquitectura'
  },
  {
    file: 'deuda-tecnica-en-la-era-de-la-ia-mitos-y-realidades.mdx',
    title: 'Deuda Técnica en la Era de la IA: Mitos y Realidades',
    tags: ['agentes-ia', 'arquitectura', 'deuda-tecnica', 'ingenieria-software'],
    category: 'Ingeniería'
  },
  {
    file: 'go-para-backend-de-agentes-por-que-y-cuando.mdx',
    title: 'Go para Backend de Agentes: Por Qué y Cuándo',
    tags: ['go', 'agentes-ia', 'arquitectura', 'backend', 'concurrency'],
    category: 'Backend'
  },
  {
    file: 'governance-a-escala-kpmg-despliega-276000-agentes-ia-con-microsoft-agent-365.mdx',
    title: 'Governance a Escala: KPMG Despliega 276,000 Agentes IA con Microsoft Agent 365',
    tags: ['gobernanza-ia', 'agentes-ia', 'microsoft-agent-365', 'kpmg', 'governance'],
    category: 'Enterprise'
  },
  {
    file: 'hacking-blanco-arquitectura-software-defensas-capas-cloud-first.mdx',
    title: 'Hacking Blanco y Arquitectura de Software: Defensas en Capas para Sistemas Cloud-First',
    tags: ['hacking-blanco', 'seguridad', 'kubernetes', 'devsecops', 'cloud'],
    category: 'Seguridad'
  },
  {
    file: 'ingenieria-software-era-ia-mas-alla-vibe-coding.mdx',
    title: 'Ingeniería de Software en la Era de IA: Más allá del Vibe-Coding',
    tags: ['ingenieria-software', 'deuda-tecnica', 'ia', 'mantenibilidad', 'best-practices'],
    category: 'Ingeniería'
  },
  {
    file: 'innova-ia-integrar-agentes-arquitecturas-enterprise-sin-romper-stack.mdx',
    title: 'Innova IA: Cómo Integrar Agentes en Arquitecturas Enterprise sin Romper tu Stack',
    tags: ['agentes-ia', 'arquitectura', 'mcp', 'go', 'kubernetes'],
    category: 'Enterprise'
  },
  {
    file: 'innova-ia-produccion-monitorabilidad-observabilidad-sistemas-multi-agente.mdx',
    title: 'Innova IA en Producción: Monitorabilidad y Observabilidad de Sistemas Multi-Agente',
    tags: ['agentes-ia', 'observabilidad', 'opentelemetry', 'kubernetes', 'sre'],
    category: 'Observabilidad'
  },
  {
    file: 'los-4-hackers-ms-influyentes-su-legado-en-2026.mdx',
    title: 'Los 4 Hackers Más Influyentes: Su Legado en 2026',
    tags: ['seguridad', 'historia', 'hackers', 'ciberseguridad'],
    category: 'Seguridad'
  },
  {
    file: 'mcp-en-produccin-patrones-de-integracin-real.mdx',
    title: 'MCP en Producción: Patrones de Integración Real',
    tags: ['agentes-ia', 'mcp', 'arquitectura', 'produccion', 'observabilidad'],
    category: 'Producción'
  },
  {
    file: 'rag-con-pgvector-arquitectura-a-escala.mdx',
    title: 'RAG con pgvector: Arquitectura a Escala',
    tags: ['agentes-ia', 'pgvector', 'rag', 'arquitectura', 'postgres'],
    category: 'Base de Datos'
  },
  {
    file: 'solid-en-microservicios-cuando-aplicar-y-cuando-es-excesivo.mdx',
    title: 'SOLID en Microservicios: Cuándo Aplicar y Cuándo Es Excesivo',
    tags: ['arquitectura', 'solid', 'microservicios', 'ingenieria-software'],
    category: 'Arquitectura'
  },
  {
    file: 'yahoo-seller-agent-graph-technologies-para-decisin-autnoma-con-gobernanza.mdx',
    title: 'Yahoo Seller Agent: Graph Technologies para Decisión Autónoma con Gobernanza',
    tags: ['agentes-ia', 'knowledge-graph', 'gobernanza', 'decision-autonoma', 'arquitectura'],
    category: 'IA'
  }
];

// Función para generar el HTML de la imagen OG
function generateOGHTML(post) {
  const fileName = post.file.replace('.mdx', '');
  const shortTitle = post.title.length > 60 ? post.title.substring(0, 60) + '...' : post.title;
  const topTags = post.tags.slice(0, 3);
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: white;
      overflow: hidden;
    }
    
    .container {
      padding: 60px 80px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 24px;
    }
    
    .brand-text {
      font-size: 20px;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .category {
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.4);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #a78bfa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 900px;
    }
    
    .title {
      font-size: 42px;
      font-weight: 700;
      line-height: 1.2;
      color: #f1f5f9;
      margin-bottom: 32px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .tags {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .tag {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #cbd5e1;
      backdrop-filter: blur(10px);
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 24px;
    }
    
    .author {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .author-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }
    
    .author-info {
      display: flex;
      flex-direction: column;
    }
    
    .author-name {
      font-size: 14px;
      font-weight: 600;
      color: #e2e8f0;
    }
    
    .author-title {
      font-size: 12px;
      color: #94a3b8;
    }
    
    .url {
      font-size: 14px;
      color: #64748b;
      font-family: monospace;
    }
    
    .decorative-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }
    
    .circle-1 {
      width: 400px;
      height: 400px;
      top: -200px;
      right: -100px;
    }
    
    .circle-2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      left: -100px;
    }
    
    .circle-3 {
      width: 200px;
      height: 200px;
      top: 50%;
      right: -50px;
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="decorative-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <div class="header">
      <div class="brand">
        <div class="brand-icon">J</div>
        <div class="brand-text">Jorge Ochoa</div>
      </div>
      <div class="category">${post.category}</div>
    </div>
    
    <div class="content">
      <h1 class="title">${post.title}</h1>
      <div class="tags">
        ${topTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="footer">
      <div class="author">
        <div class="author-avatar">J</div>
        <div class="author-info">
          <span class="author-name">Jorge Ochoa</span>
          <span class="author-title">Technology Architect</span>
        </div>
      </div>
      <div class="url">ochoajorge.me</div>
    </div>
  </div>
</body>
</html>
  `;
}

async function generateOGImages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const outputDir = path.join(__dirname, '..', 'public', 'og-images');
  
  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const post of postsNeedingImages) {
    const fileName = post.file.replace('.mdx', '.jpg');
    const outputPath = path.join(outputDir, fileName);
    
    console.log(`Generando imagen para: ${post.title}`);
    
    // Generar HTML
    const html = generateOGHTML(post);
    
    // Configurar la página
    await page.setContent(html);
    
    // Tomar screenshot
    await page.screenshot({
      path: outputPath,
      width: 1200,
      height: 630,
      type: 'jpeg',
      quality: 90
    });
    
    console.log(`✓ Imagen generada: ${fileName}`);
  }
  
  await browser.close();
  console.log('\n✓ Todas las imágenes OG han sido generadas');
}

// Ejecutar
generateOGImages().catch(console.error);