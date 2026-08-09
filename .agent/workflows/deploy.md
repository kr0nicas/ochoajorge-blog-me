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

> ⛔ **NUNCA hacer `git push origin main`.** `main` solo se mueve con un PR
> desde `develop` (ver `AGENTS.md`, reglas de oro).

El deploy a producción es la fusión del PR `develop` → `main`; Vercel construye
y despliega automáticamente al mergearse (solo construye en `main`):

```bash
# 1. Verificar que develop tiene todo lo que se quiere publicar
git fetch origin
git log --oneline origin/main..origin/develop

# 2. Abrir el PR de release (solo cuando el usuario pida deploy)
gh pr create --base main --head develop \
  --title "release: deploy develop to production" --fill
```

Al mergear ese PR, el sitio estará live en ~60 segundos.

## Flujo normal de trabajo (todo cambio, posts incluidos)

```bash
# Crear rama desde develop
git fetch origin
git switch -c content/nuevo-post origin/develop

# Hacer cambios y commit
git add content/posts/es/nuevo-post.mdx
git commit -m "content(posts): add new post"

# Push y PR con base develop
git push -u origin HEAD
gh pr create --base develop --fill
```

Nota: Vercel solo construye `main` (ver `vercel.json`), así que las ramas no
generan preview automático; la revisión se hace en el PR y con `npm run dev`
o `npm run build` local.

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
