# Verificación de Imágenes OG para Compartir

## ✅ Estado Actual

Todas las imágenes OG del blog están **correctamente configuradas** y **listas para compartir**.

### Verificaciones Completadas

1. **Todas las imágenes son URLs externas válidas**
   - No hay rutas locales (ej: `/images/og/blog-*.png`)
   - Todas las imágenes están en CDNs externos (jsDelivr, Vercel Blob Storage)

2. **Meta tags de OG completos**
   - ✅ `og:title`
   - ✅ `og:description`
   - ✅ `og:url`
   - ✅ `og:image`
   - ✅ `og:image:width` (1200px)
   - ✅ `og:image:height` (630px)
   - ✅ `og:image:alt`
   - ✅ `og:type` (article)
   - ✅ `article:published_time`
   - ✅ `article:author`
   - ✅ `twitter:card` (summary_large_image)
   - ✅ `twitter:title`
   - ✅ `twitter:description`
   - ✅ `twitter:image`

3. **Imágenes accesibles**
   - HTTP 200 OK
   - Content-Type correcto (image/jpeg)
   - Dimensiones correctas (1200x630px)

### Scripts de Verificación

```bash
# Verificar que todas las posts tengan imágenes OG válidas
./scripts/verify-og-images.sh

# Verificar que el metadata OG esté completo
./scripts/verify-og-metadata.sh
```

---

## 📱 Compartir en Redes Sociales

Las imágenes OG **se cargarán automáticamente** al compartir en las siguientes plataformas:

| Plataforma | Estado | Notas |
|-----------|--------|-------|
| **Twitter/X** | ✅ Listo | Usa `twitter:card` + `twitter:image` |
| **LinkedIn** | ✅ Listo | Usa `og:image` + `og:title` + `og:description` |
| **Facebook** | ✅ Listo | Usa `og:image` + `og:title` + `og:description` |
| **WhatsApp** | ✅ Listo | Usa `og:image` + `og:title` |
| **Telegram** | ✅ Listo | Usa `og:image` + `og:title` |
| **Bluesky** | ✅ Listo | Usa `og:image` + `og:title` |

---

## ⚠️ Caché de Redes Sociales

Las redes sociales tienen **sistemas de caché** para las imágenes OG. Esto significa que:

- **Primer compartido:** La red social descarga y cachea la imagen OG
- **Compartidos posteriores:** Usan la imagen cacheada (no vuelven a descargar)

### ¿Cuánto tarda en actualizarse?

| Plataforma | Tiempo de caché | Forzar actualización |
|-----------|-----------------|---------------------|
| **Twitter/X** | 24-48 horas | [Twitter Card Validator](https://cards-dev.twitter.com/validator) |
| **LinkedIn** | 7-30 días | [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) |
| **Facebook** | 24-72 horas | [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) |
| **WhatsApp** | 24 horas | No tiene herramienta de debug |

---

## 🔧 Forzar Actualización de Imágenes OG

Si cambias la imagen OG de un post y quieres que las redes sociales usen la nueva imagen inmediatamente:

### Twitter/X

1. Ve a: https://cards-dev.twitter.com/validator
2. Ingresa la URL del post
3. Haz clic en "Preview card"
4. Twitter volverá a descargar y cachear la imagen

### LinkedIn

1. Ve a: https://www.linkedin.com/post-inspector/
2. Ingresa la URL del post
3. Haz clic en "Inspect"
4. LinkedIn volverá a descargar y cachear la imagen

### Facebook

1. Ve a: https://developers.facebook.com/tools/debug/
2. Ingresa la URL del post
3. Haz clic en "Debug"
4. Opcional: Haz clic en "Scrape Again" para forzar re-descarga

---

## 📊 Ejemplo de Compartido

Al compartir `https://ochoajorge.me/es/blog/ai-native-seo-preparando-tu-blog-para-la-era-de-los-agentes`:

### En Twitter/X

```
┌─────────────────────────────────────────────┐
│ [IMAGEN OG: 1200x630px]                     │
│                                             │
│ AI-Native SEO: Preparando tu...            │
│ ochoajorge.me/es/blog/ai-native-seo...      │
│                                             │
│ Cómo optimizar tu blog técnico para que    │
│ agentes IA lo descubran, lean y citen...   │
│                                             │
│ 📰 ochoajorge.me                            │
└─────────────────────────────────────────────┘
```

### En LinkedIn

```
┌─────────────────────────────────────────────┐
│ [IMAGEN OG: 1200x630px]                     │
│                                             │
│ AI-Native SEO: Preparando tu blog para...  │
│                                             │
│ Cómo optimizar tu blog técnico para que    │
│ agentes IA lo descubran, lean y citen...   │
│                                             │
│ ochoajorge.me/es/blog/ai-native-seo...      │
└─────────────────────────────────────────────┘
```

### En WhatsApp

```
┌─────────────────────────────────────────────┐
│ [IMAGEN OG: 1200x630px]                     │
│                                             │
│ AI-Native SEO: Preparando tu blog para...  │
│ ochoajorge.me                               │
│                                             │
│ Cómo optimizar tu blog técnico para que    │
│ agentes IA lo descubran, lean y citen...   │
└─────────────────────────────────────────────┘
```

---

## 🚀 Deploy Status

```bash
Build:      ✅ Compiled successfully (118 pages generated)
Git:        ✅ Committed and pushed to origin/main
Vercel:     ⏳ Deploy automático en progreso (~3 min)
```

---

## ✅ Conclusión

**El blog está 100% listo para compartir con imágenes OG.**

- Todas las imágenes son accesibles
- Todos los meta tags están configurados
- Compartir en redes sociales funcionará automáticamente
- Si las redes sociales no muestran la imagen, usa las herramientas de debug para forzar la actualización

**Estado:** 🟡 Listo para compartir. Deploy automático en progreso.
