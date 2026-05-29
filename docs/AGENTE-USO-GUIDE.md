# Guía de Uso del Agente para Blog ochoajorge.me

Este documento explica cómo darme instrucciones para trabajar en tu blog de manera efectiva.

---

## 📋 Resumen Rápido

| Tipo de tarea | Herramienta principal | Uso de Claude Code |
|---------------|----------------------|-------------------|
| **Crear nuevo post** | `scripts/new-post.mjs` | ❌ No necesario |
| **Editar posts existentes** | `patch()` | ✅ Para cambios complejos |
| **Cambios de arquitectura** | `terminal()` + `claude -p` | ✅ Siempre |
| **SEO/OG images** | Scripts de verificación | ❌ No necesario |
| **Deploy/Build** | `terminal()` | ❌ No necesario |
| **Code review** | `claude -p` | ✅ Siempre |
| **Refactorización** | `claude -p` | ✅ Siempre |

---

## 🎯 Principios de Diseño del Blog

### Stack
- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS
- **Contenido:** MDX
- **Deploy:** Vercel (automático via GitHub integration)
- **Hosting de imágenes:** Vercel Blob Storage + jsDelivr CDN

### Arquitectura
- **Clean Architecture/Hexagonal:** Separación de dominio, aplicación e infraestructura
- **Componentes reutilizables:** `components/blog/`, `components/seo/`
- **Configuración centralizada:** `lib/`, `config.ts`
- **Content-first:** `content/posts/[lang]/`

### Convenios
- **Posts:** `content/posts/es/[slug].mdx`
- **Drafts:** `draft: true` → no publicado
- **Publicado:** `draft: false` → visible
- **SEO:** JSON-LD, `llms.txt`, sitemap automático
- **OG Images:** URLs externas (no rutas locales `/images/`)

---

## 🚀 Tareas Comunes

### 1. Crear un Nuevo Post

**Prompt:**
```
Crea un nuevo post sobre [tema] con título provisional "[Título]".

El post debe:
- Estar en español
- Tener ~1500-2000 palabras
- Incluir ejemplos de código en Go/Python/TypeScript según aplique
- Ser técnico pero pedagógico
- Tener tags relevantes
- Incluir coverImage URL válida (de Vercel Blob o jsDelivr)
```

**Lo que hará el agente:**
1. Ejecutará `node scripts/new-post.mjs`
2. Preguntará título, slug, tags
3. Creará el archivo `.mdx` con frontmatter
4. Notificará para que tú completes el contenido

**NO usar Claude Code** — usa el script específico del blog.

---

### 2. Publicar un Post (Draft → Published)

**Prompt:**
```
Publica el post "[Título del post]".

Cambia `draft: true` a `draft: false` en el frontmatter.
Verifica que tenga coverImage válida.
Ejecuta `npm run build` y si pasa, haz commit y push.
```

**Lo que hará el agente:**
1. Leerá el post del frontmatter
2. Cambiará `draft: true` → `draft: false`
3. Verificará que el post tenga coverImage
4. Ejecutará `npm run build`
5. Hará commit con mensaje semántico
6. Hará push a origin/main

**NO usar Claude Code** — usa `patch()` para el cambio de frontmatter.

---

### 3. Corregir un Bug en el Blog

**Prompt:**
```
Hay un bug en [ubicación/archivo]: [descripción del problema].

Por favor:
1. Identifica la causa raíz
2. Arregla el bug
3. Agrega tests si aplica
4. Verifica que `npm run build` pase
5. Haz commit con fix y push

Usa Claude Code para esto.
```

**Lo que hará el agente:**
1. **Claude Code** (`claude -p`) para diagnosticar y arreglar
2. Ejecutará `npm run build` para verificar
3. Hará commit con mensaje de fix

**USAR Claude Code** — es ideal para debugging y fixes.

---

### 4. Añadir una Nueva Feature al Blog

**Prompt:**
```
Añade la feature [nombre de feature] al blog.

Requisitos:
- [requisito 1]
- [requisito 2]
- [requisito 3]

Por favor:
1. Diseña la solución
2. Implementa siguiendo Clean Architecture
3. Agrega tests si aplica
4. Verifica que `npm run build` pase
5. Haz commit y push

Usa Claude Code para esto.
```

**Lo que hará el agente:**
1. **Claude Code** (`claude -p`) para diseño e implementación
2. Ejecutará `npm run build` para verificar
3. Hará commit con mensaje de feat

**USAR Claude Code** — es ideal para features complejas.

---

### 5. Refactorizar Código del Blog

**Prompt:**
```
Refactoriza el archivo [archivo] para mejorar [aspecto].

Objetivos:
- [objetivo 1]
- [objetivo 2]

Por favor:
1. Lee el código actual
2. Identifica oportunidades de mejora
3. Refactoriza sin cambiar el comportamiento
4. Verifica que `npm run build` pase
5. Haz commit y push

Usa Claude Code para esto.
```

**Lo que hará el agente:**
1. **Claude Code** (`claude -p`) para análisis y refactorización
2. Ejecutará `npm run build` para verificar
3. Hará commit con mensaje de refactor

**USAR Claude Code** — es ideal para refactorización.

---

### 6. Hacer Code Review de un Cambio

**Prompt:**
```
Revisa los cambios en [rama/commit/files].

Enfócate en:
- [criterio 1]
- [criterio 2]
- [criterio 3]

Por favor:
1. Lee los cambios
2. Identifica problemas o mejoras
3. Sugiere correcciones específicas
4. Verifica que las pruebas pasen si aplica

Usa Claude Code para esto.
```

**Lo que hará el agente:**
1. **Claude Code** (`claude -p`) para revisión
2. Proveerá feedback específico y accionable

**USAR Claude Code** — es ideal para code review.

---

### 7. Optimizar SEO del Blog

**Prompt:**
```
Optimiza el SEO del post "[Título del post]".

Por favor:
1. Verifica que tenga todos los meta tags OG
2. Asegura que la imagen OG sea accesible
3. Revisa el título y descripción
4. Verifica el JSON-LD
5. Ejecuta los scripts de verificación
```

**Lo que hará el agente:**
1. Ejecutará `./scripts/verify-og-images.sh`
2. Ejecutará `./scripts/verify-og-metadata.sh`
3. Revisará el HTML generado
4. Reportará cualquier problema

**NO usar Claude Code** — usa los scripts de verificación existentes.

---

### 8. Cambiar el Diseño del Blog

**Prompt:**
```
Actualiza el componente [componente] para [cambio visual].

Requisitos:
- [requisito 1]
- [requisito 2]
- Debe ser responsive
- Debe mantener consistencia con el diseño actual

Por favor:
1. Lee el componente actual
2. Implementa el cambio
3. Verifica responsive en diferentes tamaños
4. Haz commit y push

Usa Claude Code para esto.
```

**Lo que hará el agente:**
1. **Claude Code** (`claude -p`) para implementación visual
2. Ejecutará `npm run build` para verificar
3. Hará commit con mensaje de feat o fix

**USAR Claude Code** — es ideal para cambios de UI.

---

## 🛠️ Herramientas y Scripts Disponibles

### Scripts del Blog

```bash
# Crear nuevo post
node scripts/new-post.mjs

# Verificar imágenes OG
./scripts/verify-og-images.sh

# Verificar metadata OG
./scripts/verify-og-metadata.sh

# Verificar estado de posts
node scripts/check-posts.mjs

# Verificar imágenes OG específicas
node scripts/check-og-images.mjs
```

### Comandos de Build/Deploy

```bash
# Build del blog
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Format
npm run format

# Local development
npm run dev
```

---

## 📝 Estructura de un Prompt Efectivo

### Template

```
[Contexto del problema/tarea]

Objetivo:
- [objetivo 1]
- [objetivo 2]
- [objetivo 3]

Requisitos:
- [requisito 1]
- [requisito 2]
- [requisito 3]

Restricciones:
- [restricción 1]
- [restricción 2]

Por favor:
1. [paso 1]
2. [paso 2]
3. [paso 3]

[Instrucción específica sobre usar Claude Code o no]
```

### Ejemplo Real

```
Quiero añadir un botón de "Bookmark" al blog para que los usuarios puedan guardar posts para leer después.

Objetivo:
- Añadir botón de bookmark junto a ShareButton
- Guardar estado en localStorage
- Mostrar lista de posts guardados

Requisitos:
- Debe seguir el estilo de ShareButton
- Debe persistir en localStorage
- Debe ser responsive
- Debe ser accesible

Restricciones:
- No cambiar el layout existente de PostHeader
- No usar dependencias externas (solo vanilla JS)
- Debe pasar `npm run build`

Por favor:
1. Crea el componente BookmarkButton
2. Intégralo en PostHeader
3. Agrega lógica de localStorage
4. Verifica que compile
5. Haz commit y push

Usa Claude Code para esto.
```

---

## ⚠️ Restricciones y Best Practices

### Siempre Hacer

1. **Verificar que `npm run build` pase** antes de hacer commit
2. **Usar mensajes de commit semánticos:**
   - `feat:` para nuevas features
   - `fix:` para bugs
   - `refactor:` para refactorización
   - `docs:` para documentación
   - `chore:` para tareas de mantenimiento

3. **Usar Claude Code para:**
   - Debugging
   - Refactorización
   - Features complejas
   - Code review
   - Arquitectura

4. **Usar scripts del blog para:**
   - Crear posts
   - Verificar SEO
   - Verificar imágenes OG

### Nunca Hacer

1. **NO hacer commit sin verificar el build**
2. **NO cambiar `package.json` sin explicación clara**
3. **NO eliminar dependencias sin verificar impactos**
4. **NO cambiar la estructura de `content/posts/` sin discusión previa**
5. **NO usar Claude Code para tareas simples** (leer archivos, crear posts)

---

## 🔍 Debugging de Problemas Comunes

### Build falla

```
npm run build
# Si falla:
npm run type-check
npm run lint
# Revisa los errores y corrige
```

### Imagen OG no aparece

```
./scripts/verify-og-images.sh
./scripts/verify-og-metadata.sh
# Revisa los reports y corrige
```

### Post no aparece en el blog

```
# Verifica que draft: false en el frontmatter
node scripts/check-posts.mjs
# Verifica que el build incluya el post
npm run build
```

### Deploy automático no funciona

```
# Verifica que el push fue exitoso
git status
git log --oneline -5
# Verifica el status de Vercel
# (ir a vercel.com → deployments)
```

---

## 📚 Documentación Relacionada

- **CLAUDE.md** — Contexto general del proyecto
- **docs/OG-IMAGES-GUIDE.md** — Guía de imágenes OG
- **docs/OG-IMAGES-SHARING-GUIDE.md** — Guía de compartir con OG
- **README.md** — Información general del blog

---

## 💡 Tips para Interacciones Efectivas

### 1. Sé Específico

**Mal:**
```
Arregla el blog
```

**Bien:**
```
Arregla el bug donde ShareButton no aparece en móviles. El componente existe pero el botón no es visible en <768px.
```

### 2. Da Contexto

**Mal:**
```
Añade un botón nuevo
```

**Bien:**
```
Añade un botón de "Bookmark" al blog. Debe estar en PostHeader, al lado de ShareButton. Similar estilo a ShareButton pero con icono de Bookmark. Guardar estado en localStorage.
```

### 3. Especifica Restricciones

**Mal:**
```
Crea una nueva feature
```

**Bien:**
```
Crea una nueva feature. Restricciones:
- Sin dependencias externas
- Debe pasar type-check
- Debe ser responsive
- Mantener consistencia de diseño
```

### 4. Pide Verificación

**Mal:**
```
Cámbialo
```

**Bien:**
```
Cámbialo. Después de hacer el cambio, por favor:
1. Ejecuta npm run build
2. Verifica que compile sin errores
3. Haz commit y push
4. Notifica cuando esté listo
```

---

## 🎓 Ejemplos de Prompts por Categoría

### Contenido

```
Crea un post sobre "Arquitectura de Plugins en Go".
- ~2000 palabras
- Ejemplos de código
- Tags: go, arquitectura, plugins
- CoverImage: usa uno existente de Vercel Blob
```

### SEO

```
Optimiza el SEO de todos los posts.
- Verifica que todos tengan og:image
- Verifica que todos tengan twitter:card
- Usa ./scripts/verify-og-images.sh
- Reporta cualquier problema
```

### UI/UX

```
Mejora la legibilidad de los posts en modo oscuro.
- Aumenta contraste del texto
- Ajusta tamaños de fuente
- Verifica que funcione en light/dark mode
- Usa Claude Code para esto
```

### Performance

```
Optimiza la performance del blog.
- Verifica imágenes cargadas
- Minifica CSS/JS si aplica
- Verifica Lighthouse score
- Haz commit con optimizaciones
```

---

## ✅ Checklist de Completado

Antes de considerar una tarea completada, el agente debe:

- [ ] Ejecutar `npm run build` y verificar que pase
- [ ] Hacer commit con mensaje semántico
- [ ] Hacer push a origin/main
- [ ] Verificar que Vercel deploy esté en progreso
- [ ] Notificar el resultado al usuario
- [ ] Documentar cambios si es una feature compleja

---

## 🚨 Qué Hacer si Algo Sale Mal

### Si el build falla

1. El agente debe:
   - Leer los errores de build
   - Identificar la causa raíz
   - Corregir el problema
   - Re-ejecutar el build
   - Notificar cuando pase

### Si el deploy falla

1. El agente debe:
   - Verificar el log de Vercel (si tiene acceso)
   - Revisar los commits recientes
   - Identificar el cambio que causó el fallo
   - Sugerir un rollback si es necesario
   - Notificar el estado al usuario

### Si el agente no puede resolver

1. El agente debe:
   - Documentar el problema claramente
   - Proporcionar logs y contexto
   - Sugerir próximos pasos
   - Pedir instrucciones específicas

---

## 📞 Soporte y Mejoras

Si encuentras problemas con esta guía o quieres mejorarla:

1. Reporta el problema
2. Sugerencias para mejorar
3. Ejemplos de prompts que funcionaron bien
4. Casos de edge que cubrir

---

**Última actualización:** 2026-05-29  
**Versión:** 1.0.0
