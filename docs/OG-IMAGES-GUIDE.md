# Guía de OG Images para Blog Posts

## Problema Actual

Los posts nuevos tienen `coverImage` paths que apuntan a `/images/og/blog-*.png`, pero estas imágenes no existen en el directorio público.

## Solución Temporal (Aplicada)

Usar imágenes existentes de jsDelivr CDN:

- **AI-Native SEO**: `observabilidad-ia-trazas-opentelemetry.jpg`
- **Claude Opus 4.8**: `orchestrator-worker-multi-agente.jpg`

## Cómo Generar OG Images Personalizadas

### Opción 1: Usar `image_gen` Skill (Requiere FAL_KEY)

1. **Configurar FAL_KEY**:
   ```bash
   export FAL_KEY=<tu-api-key-de-fal.ai>
   hermes config set image_gen.provider fal
   ```

2. **Generar imagen**:
   ```python
   from hermes_tools import image_generate

   image = image_generate(
       prompt="Prompt detallado de la imagen OG...",
       aspect_ratio="landscape"  # 16:9 para OG images
   )
   ```

3. **La imagen se genera y se guarda automáticamente**

### Opción 2: Usar Herramientas de Diseño

1. **Canva**: Plantilla 1200x630px (tamaño estándar OG)
2. **Figma**: Template de OG image
3. **Photoshop**: 1200x630px, 72 DPI

### Opción 3: Usar Vercel OG Image Dinámico

El blog tiene soporte para OG images dinámicos usando `@vercel/og`:

- `app/opengraph-image.tsx`: OG image genérico para homepage
- Podrías extender esto para crear OG images específicas por post

## Cómo Subir Imágenes

### Vercel Blob Storage

```bash
# Instalar Vercel CLI (si no está instalado)
npm i -g vercel

# Subir imagen
vercel blob put imagen.png --token <tu-token>
```

### jsDelivr CDN

1. Crear una rama en GitHub: `og-images`
2. Commit de las imágenes
3. Usar URL: `https://cdn.jsdelivr.net/gh/<repo>@og-images/<imagen>`

## Configuración de coverImage en Posts

### Formato Local (Si la imagen está en /public)
```yaml
---
title: "Mi Post"
coverImage: "/images/og/mi-post.png"
---
```

### Formato Externo (CDN, Vercel Blob, etc.)
```yaml
---
title: "Mi Post"
coverImage: "https://cdn.jsdelivr.net/gh/kr0nicas/ochoajorge-blog-me@og-images/mi-post.jpg"
---
```

## Tamaño y Formato Recomendados

- **Tamaño**: 1200x630px (estándar Facebook/Twitter)
- **Formato**: PNG o JPG
- **Peso**: < 100KB para carga rápida
- **Aspect Ratio**: 16:9 (landscape)

## Check List para Nuevos Posts

- [ ] Generar o crear OG image personalizada
- [ ] Subir imagen a Vercel Blob Storage o jsDelivr CDN
- [ ] Configurar `coverImage` en frontmatter
- [ ] Verificar que la URL sea accesible
- [ ] Testear en https://cards-dev.twitter.com/validator
- [ ] Testear en https://developers.facebook.com/tools/debug/

## Herramientas de Prueba

- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## Recursos

- FAL AI: https://fal.ai
- Vercel Blob Storage: https://vercel.com/docs/storage/vercel-blob
- jsDelivr: https://www.jsdelivr.com
- OG Image spec: https://ogp.me/
