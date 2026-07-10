const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Función para generar el HTML de la imagen OG para AI-Native SEO
function generateAISEOHTML() {
  const post = {
    title: 'AI-Native SEO: Preparando tu blog para la era de los agentes',
    tags: ['seo', 'agentes-ia', 'optimizacion', 'blog', 'visibilidad'],
    category: 'SEO'
  };
  
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
        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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

async function generateAISEOImage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const outputDir = path.join(__dirname, '..', 'public', 'og-images');
  const fileName = 'ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes.jpg';
  const outputPath = path.join(outputDir, fileName);
  
  console.log(`Generando imagen para: AI-Native SEO: Preparando tu blog para la era de los agentes`);
  
  // Generar HTML
  const html = generateAISEOHTML();
  
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
  
  await browser.close();
  console.log(`✓ Imagen generada: ${fileName}`);
}

// Ejecutar
generateAISEOImage().catch(console.error);