---
description: Deploy del blog personal a Vercel (preview y producción)
---

# Deploy Workflow

// turbo-all

## Pre-deploy Checklist

1. Verificar que no hay posts con `draft: true` que hayan sido publicados accidentalmente
2. Ejecutar build local para detectar errores:
```bash
npm run build
```
3. Verificar que el build pasa sin errores de TypeScript:
```bash
npm run type-check
```
4. Lint clean:
```bash
npm run lint
```

## Deploy a Producción

El deploy es automático al hacer push a `main` en Vercel. El workflow es:

```bash
# 1. Asegurarse que todo está commiteado
git status

# 2. Push a main (Vercel detecta automáticamente)
git push origin main
```

Vercel construirá y desplegará automáticamente. El sitio estará live en ~60 segundos.

## Deploy Preview (para revisión antes de merge)

```bash
# Crear rama de feature/post
git checkout -b content/nuevo-post

# Hacer cambios y commit
git add .
git commit -m "content(posts): add new post"

# Push genera Preview URL automáticamente
git push origin content/nuevo-post
```

Vercel genera una URL de preview única por branch. Ideal para revisar antes de publicar.

## Variables de Entorno en Vercel

Si se agregan nuevas variables de entorno, agregarlas en el Dashboard de Vercel:
- `Settings > Environment Variables`
- Prefijo `NEXT_PUBLIC_` para variables accesibles en el cliente
- Sin prefijo para Server-only secrets

## Verificación Post-deploy

- [ ] Homepage carga correctamente
- [ ] Último post aparece en el listado
- [ ] El post individual renderiza correctamente con syntax highlighting
- [ ] Metadata OG es correcta (usar https://opengraph.xyz/)
- [ ] Core Web Vitals aceptables (verificar en Vercel Analytics)
