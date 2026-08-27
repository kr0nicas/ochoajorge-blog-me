# Cron Jobs de Publicación — Semana del 2026-08-24

Este documento describe los cron jobs de GitHub Actions configurados para la
publicación automática de los 3 posts del batch semanal.

## Workflow

**Archivo:** `.github/workflows/publish-weekly-posts.yml`

El workflow se ejecuta en GitHub Actions y respeta las reglas doradas de
`AGENTS.md`:

1. **Nunca** hace push directo a `main` o `develop`.
2. Cambia `draft: true` → `draft: false` en el archivo `.mdx` correspondiente.
3. Crea una rama `content/publish-<slug>` y abre un **PR hacia `develop`**.
4. El PR de release `develop` → `main` es un paso separado, abierto solo cuando
   el usuario lo solicita.

## Cron Schedule

| Fecha publicación (CST) | Cron (UTC)     | Job ID                     | Post      | Slug (archivo .mdx) |
|--------------------------|----------------|----------------------------|-----------|---------------------|
| 2026-08-25 08:00         | `0 14 25 8 *`  | `weekly-post-1-2026-08-25` | Klarna    | `agentes-ia-en-klarna-3-capas-de-juicio-y-el-humano-bajo-demanda` |
| 2026-08-27 08:00         | `0 14 27 8 *`  | `weekly-post-2-2026-08-27` | DoorDash  | `plataforma-de-agentes-en-doordash-llm-gateway-mcp-y-evals-a-2000-diarios` |
| 2026-08-29 08:00         | `0 14 29 8 *`  | `weekly-post-3-2026-08-29` | GitLab    | `gitlab-duo-y-el-roi-de-la-ia-como-medir-lo-que-los-agentes-aportan-al-sdlc` |

## Ejecución manual

El workflow también se puede disparar manualmente vía `workflow_dispatch`,
pasando el slug del post a publicar:

```bash
gh workflow run publish-weekly-posts.yml \
  -f post="agentes-ia-en-klarna-3-capas-de-juicio-y-el-humano-bajo-demanda"
```

## Notas

- Los cron schedules de GitHub Actions se evalúan en UTC. 08:00 CST
  (America/El_Salvador, UTC-6) = 14:00 UTC.
- GitHub no garantiza ejecución exacta en el minuto; puede haber delays de
  varios minutos, especialmente en horas pico.
- Si el post ya está en `draft: false` (publicado a mano o re-run), el workflow
  detecta que no hay cambios y termina limpiamente sin crear un PR duplicado.
- El PR de publicación va a `develop`. Para que el post llegue a producción
  (`main`, donde Vercel despliega), se necesita un PR de release
  `develop` → `main`.
