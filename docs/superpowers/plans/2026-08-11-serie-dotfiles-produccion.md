# Serie «Dotfiles como software de producción» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar dos posts nuevos que conviertan el post de dotfiles de mayo en una serie de tres partes sobre tratar unos dotfiles como software de producción, corrigiendo de paso lo que el post original afirma de falso.

**Architecture:** Dos MDX nuevos en `content/posts/es/` más una edición quirúrgica del post existente. Cada post viaja en su propio PR con base `develop`, porque las fechas de publicación están escalonadas y `lib/posts.ts` no filtra fechas futuras. No se toca `kr0nicas/dotfiles`: los posts lo documentan, no lo modifican.

**Tech Stack:** MDX + frontmatter YAML, componentes MDX del blog (`Callout`, `FileTree`, `ComparisonTable`, `Steps`), `scripts/seo-audit.mjs`, `next build`, `scripts/post-images.mjs` (n8n).

**Spec:** `docs/superpowers/specs/2026-08-10-serie-dotfiles-produccion-design.md`

## Global Constraints

Aplican a **todas** las tareas.

- **Nunca commitear ni pushear a `main` ni a `develop`.** Rama desde `origin/develop`, PR con base `develop`. Ver `AGENTS.md`.
- **`series.name` es exactamente `Dotfiles como software de producción`** en las tres partes, carácter a carácter. Cualquier variación las agrupa como series distintas en `getAllSeries()`.
- **`pillar` es `construir-con-ia`** en las tres partes. `scripts/seo-audit.mjs` da error si el pillar no está en `PILLAR_IDS`.
- **`description` entre 150 y 160 caracteres.** `seo-audit` avisa fuera de 130-170. Las cadenas exactas ya están medidas y van literales en este plan.
- **`draft: true` hasta el paso de publicación** de cada tarea. `lib/posts.ts:46` solo excluye drafts en producción.
- **Longitud: 1.500-3.000 palabras por post.** Objetivo 2.200 (P2) y 2.300 (P3).
- **Todo fragmento de código se copia del archivo real de `~/dotfiles` en el momento de escribirlo, nunca de memoria.** Los fragmentos de este plan ya están extraídos literalmente y verificados el 2026-08-11; si al escribir difieren del archivo, gana el archivo y se corrige el plan.
- **Cero afirmaciones sin medir.** Toda cifra del post sale de la tabla «Cifras verificadas» del spec o de un comando corrido en el momento.
- **Idioma: español.** Identificadores de código en inglés, prosa en español.
- **Tono:** ensayo técnico argumentativo. Si una sección empieza a parecerse al README de dotfiles, está mal escrita: el README enumera, el post argumenta.

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `content/posts/es/dotfiles-instalador-presets-cross-platform.mdx` | Parte 2. El instalador: fases, presets, `--agent`, checksums, smoke test |
| `content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx` | Parte 3. El arnés: hooks, CI, `main` protegida, CHANGELOG generado, catálogo |
| `content/posts/es/dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo.mdx` | Parte 1 existente. Se le añade `series` y se corrige la sección «Mi repositorio de Dotfiles» |

---

### Task 1: Parte 2 — «Dotfiles cross-platform: un instalador con cinco presets»

**Files:**
- Create: `content/posts/es/dotfiles-instalador-presets-cross-platform.mdx`

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: el slug `dotfiles-instalador-presets-cross-platform`, al que enlazan la Task 3 (desde la Parte 1) y la Task 5 (desde la Parte 3). El `series.name` literal que la Task 3 y la Task 5 deben repetir carácter a carácter.

- [ ] **Step 1: Verificar las cifras contra el repo antes de escribir**

Toda cifra que entre en el post se mide ahora. Si algún valor difiere del esperado, se usa el medido y se anota la discrepancia en el reporte de la tarea.

```bash
cd ~/dotfiles
echo "commits:        $(git rev-list --count HEAD)     (esperado 350+)"
echo "install antes:  $(git show f70301a^:install.sh | wc -l)  (esperado 1012)"
echo "install después:$(git show f70301a:install.sh  | wc -l)  (esperado 123)"
echo "install hoy:    $(wc -l < install.sh)            (esperado 150)"
echo "invocaciones:   $(grep -cE '^\s*phase_[a-z_]+' install.sh)  (esperado 10)"
echo "libs:           $(ls lib/*.sh | grep -vc test)   (esperado 10)"
```

Ojo con la cifra de fases: el comando cuenta **líneas de invocación**, que son 10,
pero las fases distintas son **8**. `phase_packages` / `phase_packages_if_possible`
son dos ramas de la misma fase, y `phase_symlinks` / `phase_symlinks_agent`
también. El post dice 8; el comando dice 10 y no se contradicen.

- [ ] **Step 2: Crear el archivo con el frontmatter exacto**

`date` es hoy. `draft: true` — no se quita hasta la Task 4.

```yaml
---
title: "Dotfiles cross-platform: un instalador con cinco presets"
description: "De un install.sh de mil líneas a un instalador modular: cinco presets según la máquina, checksums que abortan la instalación y un smoke test real en Debian."
date: "2026-08-11"
pillar: "construir-con-ia"
tags: ["devex-tools", "automatizacion", "sre"]
lang: "es"
draft: true
featured: false
series:
  name: "Dotfiles como software de producción"
  part: 2
resources:
  - label: "kr0nicas/dotfiles — GitHub"
    url: "https://github.com/kr0nicas/dotfiles"
  - label: "El escaparate del repo"
    url: "https://kr0nicas.github.io/dotfiles/"
---
```

- [ ] **Step 3: Escribir la sección 1 — apertura (~150 palabras)**

Sin encabezado `h2`; arranca en prosa justo bajo el frontmatter.

Argumento, en este orden:
1. La Parte 1 de esta serie defendía *tener* dotfiles y daba el consejo estándar: empieza por `.zshrc`, `.gitconfig` y un `install.sh`.
2. Ese consejo aguanta exactamente hasta la primera máquina que no es tu laptop.
3. Seis meses y 350 commits después, el repo se parece menos a un puñado de configs y más a un proyecto pequeño: instalador con fases, presets, verificación de integridad y CI.
4. Tesis explícita, en una frase suelta: **en cuanto tus dotfiles tocan más de una máquina, dejan de ser configuración y pasan a ser software — con las obligaciones que eso trae.**
5. Enlace interno a la Parte 1 con el texto «la primera parte de esta serie»:
   `/es/blog/dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo`

- [ ] **Step 4: Escribir la sección 2 — «El script que crece hasta que nadie lo lee» (~400 palabras)**

`## El script que crece hasta que nadie lo lee`

Argumento:
1. El instalador llegó a **1.012 líneas en un solo archivo**. No es un defecto moral: crece una herramienta cada vez y ningún día parece el día de partirlo.
2. El síntoma real no es la longitud, es que **no se puede probar nada por separado**. Para comprobar que los symlinks funcionan había que ejecutar el instalador entero.
3. El corte que se hizo: `install.sh` decide **qué** y **en qué orden**; `lib/` sabe **cómo**. Una fase por archivo.
4. Resultado: **123 líneas** tras el refactor (150 hoy), y 8 fases repartidas en 10 archivos de `lib/`.
5. La prueba de que el corte era el correcto: `lib/symlinks.test.sh` corre 27 tests **sin tocar el `$HOME`** de nadie. Eso solo es posible porque la fase es una función aislada con sus entradas explícitas.

Fragmento verbatim (`~/dotfiles/install.sh:124-150`), presentado como «el instalador entero se lee como un índice»:

````mdx
```bash
# --- Fases, en orden ---
phase_detect      # SO, arquitectura, dependencias críticas

if [[ $INSTALL_AGENT -eq 1 ]]; then
    phase_packages_if_possible   # apt/brew; se salta si no hay root ni sudo -n
else
    phase_packages               # brew bundle (macOS) / apt (Debian-Ubuntu)
fi

phase_runtimes    # fnm+Node, fzf, starship, zoxide, uv
phase_binaries    # binarios SRE desde GitHub Releases (solo Linux)

if [[ $INSTALL_AGENT -eq 0 ]]; then
    phase_editors # tmux/TPM, Neovim/lazy.nvim, Claude Code
fi

if [[ $INSTALL_AGENT -eq 1 ]]; then
    phase_symlinks_agent   # SOLO ~/.claude (settings, statusline, CLAUDE.md)
else
    phase_symlinks         # symlinks de dotfiles
fi

phase_repo        # hooks de git (core.hooksPath)
phase_verify      # limpieza de caché zsh + resumen final
```
````

Y un `<FileTree>` con la estructura de `lib/`, una línea por archivo:

```mdx
<FileTree title="lib/ — una fase por archivo">
{`
  install.sh  [highlight]
  lib/
    common.sh
    detect.sh
    packages.sh
    runtimes.sh
    binaries.sh
    editors.sh
    symlinks.sh
    repo.sh
    verify.sh
    menu.sh
`}
</FileTree>
```

- [ ] **Step 5: Escribir la sección 3 — «Cinco presets: decide la máquina, no tú» (~450 palabras)**

`## Cinco presets: decide la máquina, no tú`

Argumento:
1. Un dotfiles nace asumiendo un solo destino: «mi laptop». Ese supuesto se rompe en cuanto lo clonas en otro sitio.
2. Ejemplos concretos de por qué: un VPS no tiene entorno gráfico, un contenedor no tiene sudo, un nodo de Kubernetes no necesita Spotify ni Postman.
3. La respuesta no es un `if` suelto, son **módulos**: base, cloud, k8s, gui. Los presets no eligen herramientas, encienden módulos.
4. Los flags compositivos (`--no-cloud`, `--no-k8s`, `--no-gui`) se combinan entre sí y con un preset, para el caso que ningún preset cubre.
5. **`--dry-run` como contrato**, no como cortesía: puedes ver exactamente qué se va a descargar antes de dejar que entre nada en la máquina.
6. **`safe_link` respalda a `<archivo>.bak.<timestamp>` antes de pisar nada.** Sin eso el instalador no es reejecutable sin miedo, y un instalador que da miedo ejecutar no se ejecuta — que es la forma más común de que unos dotfiles se queden viejos.

Tabla con `<ComparisonTable>`, con los valores reales de `install.sh`:

```mdx
<ComparisonTable
  headers={["Preset", "base", "cloud", "k8s", "gui"]}
  rows={[
    ["--minimal", "ON", "OFF", "OFF", "OFF"],
    ["--container", "ON", "OFF", "OFF", "OFF"],
    ["--vps", "ON", "ON", "OFF", "OFF"],
    ["--k8s-node", "ON", "ON", "ON", "OFF"],
    ["--agent", "ON", "ON", "ON", "OFF"],
  ]}
/>
```

Nota obligatoria bajo la tabla: `--minimal` y `--container` encienden los mismos módulos; se diferencian en intención y en el mensaje que emiten, no en lo que instalan. Decirlo evita que el lector busque una diferencia que no existe.

- [ ] **Step 6: Escribir la sección 4 — «El preset `--agent`: tu entorno tiene dos usuarios» (~350 palabras)**

`## El preset --agent: tu entorno tiene dos usuarios`

Argumento:
1. Observación de partida: la tool Bash de Claude Code es una **zsh no interactiva que no sourcea el `zshrc`**.
2. Consecuencia concreta, enumerada: en esa caja no se renderiza nunca el prompt de starship, ni existen los aliases, ni los keybindings de fzf. Y no hay terminal, así que tmux, Neovim y WezTerm no tienen a quién dibujar.
3. La conclusión que se sigue: instalar el entorno completo ahí es gastar la instalación en configuración que nada va a leer.
4. Qué **sí** instala `--agent`: herramientas de línea de comandos, hooks de git y `~/.claude` (settings, statusline, CLAUDE.md).
5. Qué **no**: nada interactivo.
6. El giro con el que cierra la sección: un agente que trabaja en tu repo necesita **las reglas** (los hooks), no la decoración. Y eso es exactamente lo que trata la Parte 3.
7. Enlace interno a `/es/blog/agentic-saas-b2b-disciplina-de-desarrollo-con-claude-code` al hablar de disciplina de agentes.

`<Callout type="note">` con la idea en una frase: «Tu entorno de desarrollo ya tiene dos usuarios. Solo uno de los dos ve los colores.»

- [ ] **Step 7: Escribir la sección 5 — «"No coincide" no es lo mismo que "no pude comprobar"» (~350 palabras)**

`## "No coincide" no es lo mismo que "no pude comprobar"`

Argumento:
1. Los binarios que vienen de GitHub Releases se descargan **a disco** y se comparan contra el `checksums.txt` del propio release antes de instalarse. El `curl | tar` anterior no dejaba nada que comprobar.
2. Los tres desenlaces posibles y por qué son tres y no dos:
   - coincide → sigue;
   - **no coincide → aborta la instalación entera**;
   - el proyecto no publica checksums → instala, pero con warning visible por herramienta.
3. La frase que sostiene la sección: distinguir «no coincide» de «no pude comprobar» es lo único que separa una descarga corrupta de una manipulada. Colapsar los dos casos en «fallo» convierte un incidente de seguridad en ruido, y colapsarlos en «bien» lo esconde.
4. El hueco queda **auditable en la salida**, no escondido: hoy hay proyectos que no publican checksums y se ven uno a uno al instalar.
5. Honestidad final, en `<Callout type="warning">`: los instaladores oficiales de fnm, starship, zoxide, uv y compañía siguen siendo `curl … | bash`. Es la vía documentada por cada proyecto y es un trade-off aceptado por ergonomía, no un descuido. Está documentado en el README junto a la recomendación de correr `--dry-run` antes de instalar en una máquina nueva.

Fragmento verbatim (`~/dotfiles/lib/binaries.sh:127-137`):

````mdx
```bash
if sums=$(gh_checksums "$repo" "$(basename "$file")"); then
    verify_sha256 "$file" "$sums" && rc=0 || rc=$?
    case $rc in
        0) ok "checksum verificado: $(basename "$file")" ;;
        1) rm -rf "$tmp"
           err "CHECKSUM NO COINCIDE en $(basename "$file") ($repo). Descarga corrupta o manipulada — abortando." ;;
        *) warn "$repo publica checksums pero $(basename "$file") no aparece en la lista; instalado sin verificar" ;;
    esac
else
    warn "$repo no publica checksums en su release; $(basename "$file") instalado sin verificar"
fi
```
````

- [ ] **Step 8: Escribir la sección 6 — «El test que ninguno de los otros iba a encontrar» (~400 palabras)**

`## El test que ninguno de los otros iba a encontrar`

Es la sección más importante del post. Argumento:
1. El bug, contado como categoría y sin SHA: la API de GitHub **no garantiza el JSON indentado**. Algunos repos lo devuelven minificado, en una sola línea.
2. El filtro asumía un asset por línea. Sobre una respuesta minificada, el patrón casaba el documento entero y el `sed` —que es greedy— devolvía **el último asset del release**: arquitectura equivocada, sin error, en silencio.
3. Lo que hace la anécdota valiosa: eso pasó `bash -n`, pasó `shellcheck` y pasó los 114 tests que había entonces. **Los tres miran el código sin ejecutarlo.** Un fallo de integración les pasa por debajo entero.
4. La respuesta fue un job que **instala de verdad**: `debian:stable-slim` dentro de Docker, preset `--vps`, y después comprueba herramienta a herramienta y symlink a symlink.
5. Por qué `debian:stable-slim` y no el runner de Ubuntu: el runner ya trae curl, git, unzip y medio SDK, así que da por buenas dependencias que un VPS recién creado no tiene. La imagen slim se parece al destino real.
6. Por qué `--vps` y no `--container`: cubre lo mismo más el bloque cloud, que incluye el camino de código más nuevo y menos probado.
7. La lección generalizable, que es lo que el lector se lleva: **los tests unitarios prueban que tu código hace lo que crees; solo la ejecución real prueba que el mundo se comporta como crees.** Un instalador es, por definición, código cuyo trabajo entero es hablar con el mundo.

Fragmento verbatim del bucle de verificación (`.github/workflows/ci.yml`, job `install-smoke`), recortado a lo esencial:

````mdx
```bash
for t in zsh tmux git curl jq rg fd direnv btop \
         fzf starship zoxide uv fnm \
         lazygit delta trivy sops \
         tflint tofu nvim; do
  p=$(command -v "$t" 2>/dev/null || true)
  if [ -n "$p" ] && [ -x "$p" ]; then
    printf "  ✅ %-12s %s\n" "$t" "$p"
  else
    printf "  ❌ %-12s NO ENCONTRADO\n" "$t"
    fail=1
  fi
done
```
````

Al presentarlo hay que decir que está recortado: la lista real es más larga. Recortar sin avisar es la misma clase de mentira que el post denuncia.

- [ ] **Step 9: Escribir la sección 7 — cierre (~150 palabras)**

`## Lo que un instalador correcto no arregla`

Argumento:
1. Todo lo anterior consigue que la instalación sea repetible y verificable.
2. Y no impide nada de lo que de verdad pudre un repo: mensajes de commit inservibles, documentación que se desincroniza, cambios directos a `main`, un catálogo que dice una cosa mientras el código hace otra.
3. Anticipo de la Parte 3 en una frase, con enlace interno a `/es/blog/dotfiles-ci-hooks-changelog-catalogo`.
4. Enlaces al repo y al escaparate.

- [ ] **Step 10: Comprobar longitud y descripción**

```bash
cd /Users/jorgeochoa/Documents/Development/Personal/blog-personal
f=content/posts/es/dotfiles-instalador-presets-cross-platform.mdx
echo "palabras: $(sed '1,/^---$/d;1,/^---$/d' "$f" | wc -w)"
node -e "const m=require('fs').readFileSync('$f','utf8').match(/description: \"(.*)\"/); console.log('description:', m[1].length)"
```

Esperado: palabras entre 1.500 y 3.000 (objetivo ~2.200); description = 156.

- [ ] **Step 11: Correr la auditoría SEO y el build**

```bash
npm run seo:audit es
npm run build
```

Esperado: `seo:audit` sin líneas `Error:` que mencionen este slug, y `build` terminando sin error. Un `Warning:` sobre `coverImage` ausente es esperado en este punto — la portada llega en la Task 2.

- [ ] **Step 12: Commit**

```bash
git add content/posts/es/dotfiles-instalador-presets-cross-platform.mdx
git commit -m "content(posts): add dotfiles-instalador-presets-cross-platform post"
```

---

### Task 2: Portada de la Parte 2

**Files:**
- Modify: `content/posts/es/dotfiles-instalador-presets-cross-platform.mdx` (frontmatter `coverImage`, y posibles imágenes inline)

**Interfaces:**
- Consumes: el MDX completo de la Task 1, todavía con `draft: true`.
- Produces: el mismo archivo con `coverImage` apuntando a Vercel Blob.

- [ ] **Step 1: Generar las imágenes**

```bash
npm run post:images -- dotfiles-instalador-presets-cross-platform es
```

Esperado: el script parchea `coverImage` en el frontmatter e imprime las inline que no pudo colocar.

- [ ] **Step 2: Si el webhook falla, seguir sin imágenes**

El contrato de `post-images.mjs` es que **nunca bloquea**. Si no hay `N8N_IMAGES_WEBHOOK_URL`/`SECRET` o el webhook no responde, se deja el post sin portada y se anota en el reporte de la tarea. **No reintentar en bucle.** Detalles en `docs/automation/n8n-post-images.md`.

- [ ] **Step 3: Verificar que el build sigue verde**

```bash
npm run build
```

Esperado: termina sin error.

- [ ] **Step 4: Commit (solo si hubo cambios)**

```bash
git add content/posts/es/dotfiles-instalador-presets-cross-platform.mdx
git commit -m "content(posts): add cover image to dotfiles-instalador post"
```

---

### Task 3: Parte 1 — integrar en la serie y corregir lo que afirma de falso

**Files:**
- Modify: `content/posts/es/dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo.mdx` (frontmatter + sección «Mi repositorio de Dotfiles», líneas 284-327)

**Interfaces:**
- Consumes: el `series.name` literal y el slug de la Task 1.
- Produces: la Parte 1 de la serie, enlazando a las Partes 2 y 3.

- [ ] **Step 1: Añadir `series` al frontmatter**

No se toca `title`, `date`, `slug`, `tags` ni `coverImage`: el slug tiene SEO acumulado desde mayo y renombrarlo rompería la URL. Se inserta tras `featured: false`:

```yaml
series:
  name: "Dotfiles como software de producción"
  part: 1
```

- [ ] **Step 2: Reescribir la sección «Mi repositorio de Dotfiles»**

Sustituir el contenido actual de esa sección (hoy afirma `.zshrc` en la raíz, un `setup.sh` que no existe y Oh My Zsh, que el repo no usa) por la estructura real. Verificar cada línea contra `~/dotfiles` antes de escribirla:

```bash
ls ~/dotfiles
```

Contenido nuevo de la sección:
1. Una frase honesta de apertura: esta sección describe el repo tal y como es hoy; cuando se publicó este post por primera vez describía una versión anterior. Reconocerlo es más barato que dejarlo mal, y es literalmente el problema del que tratan las otras dos partes.
2. Árbol real con `<FileTree>`: `install.sh`, `lib/`, `config/` (nvim, starship, claude, zsh, ssh, wezterm, iterm2, direnv), `.githooks/`, `scripts/`, `web/`, `Brewfile*`, `zshrc` (sin punto), `tmux.conf`, `.gitconfig`, `CHANGELOG.md`.
3. Instalación real, con presets:

````mdx
```bash
git clone https://github.com/kr0nicas/dotfiles.git ~/dotfiles
cd ~/dotfiles && ./install.sh --dry-run   # ver qué haría
./install.sh                              # o --vps, --minimal, --container…
```
````

4. Cierre con los dos enlaces internos: Parte 2 (`/es/blog/dotfiles-instalador-presets-cross-platform`) y Parte 3 (`/es/blog/dotfiles-ci-hooks-changelog-catalogo`).

**No se toca nada más del post.** Las secciones sobre qué son los dotfiles, por qué tenerlos, buenas prácticas y Chezmoi/Stow siguen siendo válidas y son el «porqué» sobre el que se apoyan las otras dos partes.

- [ ] **Step 3: Verificar que la serie se agrupa**

```bash
node -e "
const fs=require('fs');
const files=['dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo','dotfiles-instalador-presets-cross-platform'];
for (const f of files) {
  const t=fs.readFileSync('content/posts/es/'+f+'.mdx','utf8');
  const m=t.match(/name: \"(Dotfiles[^\"]*)\"/);
  console.log(f, '->', m ? JSON.stringify(m[1]) : 'SIN SERIE');
}"
```

Esperado: las dos líneas imprimen exactamente `"Dotfiles como software de producción"`. Si difieren en un solo carácter, corregir antes de seguir.

- [ ] **Step 4: Auditoría y build**

```bash
npm run seo:audit es
npm run build
```

Esperado: sin errores nuevos.

- [ ] **Step 5: Commit**

```bash
git add content/posts/es/dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo.mdx
git commit -m "content(posts): integrar el post de dotfiles en la serie y corregir la estructura del repo"
```

---

### Task 4: Publicar la Parte 2

**Files:**
- Modify: `content/posts/es/dotfiles-instalador-presets-cross-platform.mdx` (`draft: false`)

**Interfaces:**
- Consumes: Tasks 1, 2 y 3 completas y commiteadas en la rama.
- Produces: PR abierto con base `develop`, conteniendo la Parte 2 y la edición de la Parte 1.

- [ ] **Step 1: Repasar la checklist SEO del blog**

De `.agent/workflows/new_post.md`, paso 7. Verificar una por una:
- `title` con la keyword en las primeras 3 palabras → «Dotfiles cross-platform:» ✅
- `description` de 150-160 → medida en la Task 1, 156 ✅
- `tags` en español ✅
- al menos un `h2` con keyword secundaria ✅
- al menos un enlace interno a otro post ✅ (Parte 1 y Parte 3)
- imágenes con `alt` descriptivo
- 1.500-3.000 palabras → medido en la Task 1

- [ ] **Step 2: Quitar el draft**

Cambiar `draft: true` por `draft: false` en el frontmatter.

- [ ] **Step 3: Verificación final**

```bash
npm run seo:audit es && npm run build
```

Esperado: ambos terminan sin error. **No continuar si alguno falla.**

- [ ] **Step 4: Commit y PR**

```bash
git add content/posts/es/dotfiles-instalador-presets-cross-platform.mdx
git commit -m "content(posts): publicar la parte 2 de la serie de dotfiles"
git push -u origin HEAD
gh pr create --base develop --fill
```

**Verificar que el PR tiene base `develop`.** Si `gh` lo abre contra `main`, cerrarlo y repetir con `--base develop`.

- [ ] **Step 5: Parar y reportar**

El merge del PR y el posterior release `develop` → `main` los decide el usuario. **No mergear sin que lo pida.**

---

### Task 5: Parte 3 — «Dotfiles con CI: hooks, CHANGELOG generado y datos que no mienten»

**Files:**
- Create: `content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx`

**Interfaces:**
- Consumes: el `series.name` literal y el slug de la Task 1 (para el enlace de apertura).
- Produces: el slug `dotfiles-ci-hooks-changelog-catalogo`, al que ya enlazan la Parte 1 (Task 3) y la Parte 2 (Task 1, sección 7).

**Rama:** esta tarea abre **su propia rama** desde `origin/develop`, porque la Parte 3 se publica el 2026-08-14 y no puede viajar en el PR de la Parte 2.

```bash
git fetch origin
git switch -c content/dotfiles-ci-hooks-changelog origin/develop
```

- [ ] **Step 1: Verificar las cifras contra el repo**

```bash
cd ~/dotfiles
for f in config/zsh/gcp.test.zsh config/zsh/ssh.test.zsh config/zsh/zshrc.test.zsh; do zsh "$f" 2>&1 | tail -1; done
for f in .githooks/hooks.test.sh lib/packages.test.sh lib/symlinks.test.sh \
         config/claude/settings.test.sh scripts/changelog.test.sh; do bash "$f" 2>&1 | tail -1; done
(cd web && npm test 2>&1 | grep '^# pass')
node -e "console.log('fichas curadas:', require('$HOME/dotfiles/web/src/data/tools.curated.json').length)"
```

Esperado: 45+13+4+70+15+27+4+5 = **183** tests de shell, **48** del web (total **231**) y **134** fichas. Si algún número difiere, gana el medido.

- [ ] **Step 2: Crear el archivo con el frontmatter exacto**

```yaml
---
title: "Dotfiles con CI: hooks, CHANGELOG generado y datos que no mienten"
description: "Hooks de git, un CI que reusa el hook, un CHANGELOG generado y un catálogo derivado del repo: cómo hacer que las reglas de tus dotfiles se cumplan solas."
date: "2026-08-14"
pillar: "construir-con-ia"
tags: ["devex-tools", "automatizacion", "ingenieria-software"]
lang: "es"
draft: true
featured: false
series:
  name: "Dotfiles como software de producción"
  part: 3
resources:
  - label: "kr0nicas/dotfiles — GitHub"
    url: "https://github.com/kr0nicas/dotfiles"
  - label: "El escaparate del repo"
    url: "https://kr0nicas.github.io/dotfiles/"
---
```

- [ ] **Step 3: Escribir la sección 1 — apertura (~200 palabras)**

Argumento:
1. El repo ya tenía CI, specs escritos y una convención de commits razonablemente consistente.
2. Y aun así, el commit más reciente que rompía la convención **lo generaba el propio repo**: la función de guardar rápido hacía `add .`, un mensaje del tipo «Update dots» con la fecha, y push directo a `main`.
3. La ironía que abre el post: la herramienta de guardar rápido era la que contaminaba el historial.
4. Tesis, en una frase suelta: **una convención que vive en la costumbre no es una regla; es una intención.** La diferencia es si algo la hace cumplir cuando tienes prisa — y con tus propios dotfiles siempre tienes prisa, porque nunca son la tarea, siempre son lo que te interrumpe la tarea.
5. Enlace interno a la Parte 2 con el texto «la parte anterior».

- [ ] **Step 4: Escribir la sección 2 — «Tres puertas, y qué pasa cuando falta la herramienta» (~500 palabras)**

`## Tres puertas, y qué pasa cuando falta la herramienta`

Argumento:
1. Tres hooks, cada uno con su coste y su momento: `commit-msg` valida el mensaje, `pre-commit` linta lo staged y barre secretos, `pre-push` corre las suites y bloquea `main`.
2. Detalle que importa: `pre-commit` despacha **por extensión y sobre el índice**, no sobre el repo entero. Lintar todo en cada commit es la vía rápida a que alguien añada `--no-verify` a su muscle memory.
3. **La decisión más interesante del arnés es la degradación deliberada.** Si falta `shellcheck` en un VPS mínimo, el hook avisa y deja pasar. Razón: estos dotfiles se clonan en cajas que no tienen nada — un hook que exige herramientas rompe exactamente el caso de uso del repo.
4. Y el límite de esa degradación: **el formato del commit y el barrido de secretos no degradan nunca.** Los dos solo necesitan bash. Un secreto que se cuela no se arregla después.
5. El ámbito se valida contra una lista cerrada, para que `gcp` y `gcloud` no acaben conviviendo como dos ámbitos distintos. Y el mensaje de error **dice en qué archivo añadir uno nuevo**: si ampliar la lista cuesta más que saltarse la regla, la gente se salta la regla.

Tabla:

```mdx
<ComparisonTable
  headers={["Hook", "Qué comprueba", "¿Degrada si falta la herramienta?"]}
  rows={[
    ["commit-msg", "Formato, tipo, ámbito, longitud", "No"],
    ["pre-commit", "Lint de lo staged", "Sí"],
    ["pre-commit", "Secretos (claves, tokens, .env)", "No"],
    ["pre-push", "Suites completas + guardia de main", "Parcial"],
  ]}
/>
```

Fragmento verbatim (`~/dotfiles/.githooks/pre-commit`), como ejemplo de degradación:

````mdx
```bash
if has shellcheck; then
    shellcheck -x -S info "$f" \
        || { hook_err "shellcheck falló: $f"; rc=1; }
else
    hook_warn "shellcheck no está instalado; no se analizó $f"
fi
```
````

- [ ] **Step 5: Escribir la sección 3 — «El CI reusa el hook, no una copia» (~300 palabras)**

`## El CI reusa el hook, no una copia`

Argumento:
1. El job `commit-lint` pasa cada mensaje del PR por el propio `.githooks/commit-msg`. No es una reimplementación con la misma regex: es el mismo archivo. Dos copias de una regla divergen; la única pregunta es cuándo.
2. El detalle que cuesta una tarde entender: `${#subject}` cuenta **caracteres o bytes según el locale**. Medido en este repo: 68 frente a 73 para la misma cadena con acentos. Sin fijar `LC_ALL`, el límite de 72 significa cosas distintas en tu máquina y en el runner, y el commit que pasa en local falla en CI sin que nada parezca haber cambiado.
3. `shellcheck` corre a nivel `info`, no `warning`. Motivo concreto: una variable mal escrita es SC2153, que shellcheck clasifica como info. A nivel `warning` pasaba entera — y así un script del repo estuvo mandando a la API de GitHub un array vacío desde su primer commit, con este job en verde todo el tiempo.
4. Generalización: **el nivel por defecto de tu linter es una decisión que alguien tomó por ti, no una ley de la naturaleza.** Vale la pena mirar qué deja pasar.

- [ ] **Step 6: Escribir la sección 4 — «`main` protegida sin bloquearte» (~250 palabras)**

`## main protegida sin bloquearte`

Argumento:
1. El problema de un repo de un solo mantenedor: exigir revisión es imposible, no hay revisor. Y sin exigir nada, `main` está abierta.
2. La configuración que resuelve eso: `required_approving_review_count: 0` — **exige PR, no exige revisor**. El PR es donde CI bloquea y donde queda el contexto, no un trámite de aprobación.
3. `enforce_admins: false` es deliberado: a las tres de la mañana arreglando un VPS hay que poder saltárselo, y el bypass queda en el audit log de GitHub, que es la trazabilidad que se pedía.
4. La frase que resume la postura: **un arnés sin salida de emergencia se desactiva entero el primer día que estorba.** Es preferible un bypass explícito y registrado que un `--no-verify` en el muscle memory de todo el mundo.
5. `required_linear_history: false`, porque se usa `--no-ff`. Y eso no es estética: es lo que hace posible agrupar por feature en la siguiente sección.

- [ ] **Step 7: Escribir la sección 5 — «Un CHANGELOG que no se escribe» (~450 palabras)**

`## Un CHANGELOG que no se escribe`

Argumento:
1. `CHANGELOG.md` es un archivo generado desde el historial. No se edita a mano, y un job de CI falla si el commiteado difiere de lo que el script produce.
2. La agrupación es por feature: `--first-parent` da los merge commits, y dentro de cada uno el rango `<merge>^1..<merge>^2` lista los commits reales.
3. **La regresión infinita**, que es la parte que merece el post: el commit que regenera el CHANGELOG entraría en su propio listado con su propio SHA, así que al regenerar volvería a diferir; amendarlo cambia el SHA y vuelve a diferir. El archivo se vuelve insatisfacible y el job no puede pasar jamás.
4. La solución y su corolario de flujo: se excluyen los commits que solo tocan el CHANGELOG, y regenerar va **siempre en su propio commit**, que no toca nada más.
5. La misma clase de trampa, otra vez: la fecha sale del último commit del rango, **nunca de `date`**. Con la fecha de hoy, el archivo cambiaría solo por pasar la medianoche, y el CI empezaría a fallar sin que nadie hubiera tocado nada.
6. La regla general que el lector se lleva: **un artefacto generado tiene que ser función pura del repo.** Cualquier entrada externa —la hora, la rama en la que estás, el número de PR— lo vuelve insatisfacible. Los dos fallos de arriba son el mismo fallo.

Fragmento verbatim (`~/dotfiles/scripts/changelog.sh:42-53`), comentario incluido, porque el comentario **es** el argumento:

````mdx
```bash
# solo_changelog <sha> -> 0 si el commit toca únicamente CHANGELOG.md
#
# Estos commits se excluyen del listado, y no es cosmético: sin la exclusión el
# archivo es INSATISFACIBLE. El commit que regenera el CHANGELOG entraría en su
# propio listado con su propio SHA, así que al regenerar volvería a diferir;
# amendarlo cambia el SHA y vuelve a diferir. Regresión infinita.
solo_changelog() {
    local tocados
    tocados="$(git show --name-only --format= "$1" 2>/dev/null | sed '/^$/d')"
    [ "$tocados" = "CHANGELOG.md" ]
}
```
````

`<Callout type="danger">` con la regresión infinita resumida en dos frases.

- [ ] **Step 8: Escribir la sección 6 — «El catálogo que no puede mentir» (~450 palabras)**

`## El catálogo que no puede mentir`

Argumento:
1. El repo publica un escaparate en GitHub Pages que deja navegar las herramientas que instala. El problema evidente: un catálogo escrito a mano se desincroniza al primer `brew` nuevo.
2. El pipeline, con `<Steps>`: un extractor lee los Brewfiles, `lib/binaries.sh` y el bloque apt del instalador → un JSON generado y **versionado** → una capa curada a mano con lo único que una máquina no puede saber (descripción, categoría de presentación, URL).
3. Nombre, módulo y plataforma no se teclean nunca. Solo la prosa.
4. La guardia es **bidireccional**: herramienta en el repo sin ficha → error; ficha de algo que el repo ya no instala → error. Corre en el build y en CI.
5. **El riesgo que casi nadie ve**: el extractor es regex sobre bash. Si alguien reescribe la forma de esas arrays, el parser deja de casar — y «no la veo» no produce ningún error. Publicaría un catálogo mutilado con el CI en verde.
6. La red para eso: un **conteo mínimo por fuente**. Si aparecen 12 binarios donde había 31, el build falla en vez de publicar. Calibrados al ~75% del recuento real y no pegados al valor, porque un suelo pegado convierte cada retirada legítima en un build rojo, y una guardia con falsos positivos es una guardia que alguien acaba bajando sin mirar.
7. La regla explícita: bajar esos mínimos para poner verde un build rojo **es desactivar la guardia**.
8. Y el detalle de fontanería que cierra: el workflow dispara también en `Brewfile*` y `lib/binaries.sh`, no solo en `web/**`. Tocar un Brewfile sin regenerar el catálogo rompe el CI **en el PR**, que es el único momento en que sirve enterarse.

Fragmento verbatim (`~/dotfiles/web/scripts/check-tools.mjs:23-30`):

````mdx
```js
export const MINIMOS = {
  'Brewfile': 55,
  'Brewfile.cloud': 7,
  'Brewfile.k8s': 11,
  'Brewfile.gui': 24,
  'lib/binaries.sh': 23,
  'lib/packages.sh': 20,
}
```
````

- [ ] **Step 9: Escribir la sección 7 — «El mismo principio, tres veces» (~200 palabras)**

`## El mismo principio, tres veces`

Argumento:
1. La pieza propia del repo, `gcx`, nació de un fallo pequeño y muy ilustrativo: cuatro aliases imprimían con `echo` una cuenta escrita a mano que ya no coincidía con la configuración que en realidad activaban. El mensaje mentía con total confianza.
2. La reescritura no añadió funciones: quitó el `echo`. Ahora cada dato se lee de `gcloud` en el momento.
3. El CHANGELOG, el catálogo y `gcx` son **la misma regla aplicada tres veces**: estado leído, nunca hardcodeado.
4. Cierre del argumento: lo que se escribe a mano se desincroniza. No es una posibilidad, es el comportamiento por defecto. La única variable es **cuándo te enteras** — y las tres piezas de este post existen para que te enteres en el PR y no en producción.

- [ ] **Step 10: Escribir la sección 8 — cierre (~150 palabras)**

`## ¿Hace falta todo esto para tener dotfiles?`

Argumento:
1. Respuesta honesta y directa: **no.** Para tener dotfiles basta un repo con tu `.zshrc`, y la Parte 1 de esta serie sigue siendo el consejo correcto para empezar.
2. Todo esto hace falta para otra cosa: para que sigan siendo **verdad** dentro de seis meses. La documentación que nadie regenera miente, el catálogo escrito a mano miente, el mensaje con `echo` hardcodeado miente.
3. Cifra final medida: 231 tests, tres hooks, cuatro jobs de CI y un sitio que se regenera solo.
4. Enlaces a las Partes 1 y 2, al repo y al escaparate.

- [ ] **Step 11: Comprobar longitud y descripción**

```bash
cd /Users/jorgeochoa/Documents/Development/Personal/blog-personal
f=content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx
echo "palabras: $(sed '1,/^---$/d;1,/^---$/d' "$f" | wc -w)"
node -e "const m=require('fs').readFileSync('$f','utf8').match(/description: \"(.*)\"/); console.log('description:', m[1].length)"
```

Esperado: palabras entre 1.500 y 3.000 (objetivo ~2.300); description = 153.

- [ ] **Step 12: Auditoría, build y commit**

```bash
npm run seo:audit es
npm run build
git add content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx
git commit -m "content(posts): add dotfiles-ci-hooks-changelog-catalogo post"
```

---

### Task 6: Portada de la Parte 3

**Files:**
- Modify: `content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx`

**Interfaces:**
- Consumes: el MDX de la Task 5.
- Produces: el mismo archivo con `coverImage`.

- [ ] **Step 1: Generar las imágenes**

```bash
npm run post:images -- dotfiles-ci-hooks-changelog-catalogo es
```

- [ ] **Step 2: Si el webhook falla, seguir sin imágenes y anotarlo**

Mismo contrato que la Task 2: nunca bloquea, no se reintenta en bucle.

- [ ] **Step 3: Build y commit (solo si hubo cambios)**

```bash
npm run build
git add content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx
git commit -m "content(posts): add cover image to dotfiles-ci-hooks post"
```

---

### Task 7: Publicar la Parte 3 (el 2026-08-14)

**Files:**
- Modify: `content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx` (`draft: false`)

**Interfaces:**
- Consumes: Tasks 5 y 6 completas. Requiere que el PR de la Parte 2 (Task 4) ya esté mergeado en `develop`.

- [ ] **Step 1: Confirmar que la fecha es correcta**

```bash
date +%F
```

Si no es 2026-08-14 o posterior, **parar y avisar al usuario**: publicar antes dejaría un post con fecha futura visible, que es justo lo que la publicación escalonada evita. La decisión de adelantarlo es del usuario.

- [ ] **Step 2: Rebase sobre `develop` actualizado**

```bash
git fetch origin
git rebase origin/develop
```

Esperado: sin conflictos. La Parte 2 tocó archivos distintos.

- [ ] **Step 3: Checklist SEO, draft y verificación**

Misma checklist que la Task 4, paso 1. Después:

```bash
# cambiar draft: true -> draft: false
npm run seo:audit es && npm run build
```

Esperado: ambos sin error. **No continuar si alguno falla.**

- [ ] **Step 4: Commit y PR**

```bash
git add content/posts/es/dotfiles-ci-hooks-changelog-catalogo.mdx
git commit -m "content(posts): publicar la parte 3 de la serie de dotfiles"
git push -u origin HEAD
gh pr create --base develop --fill
```

**Verificar base `develop`.**

- [ ] **Step 5: Parar y reportar**

El merge y el release `develop` → `main` los decide el usuario.

---

## Self-Review

**Cobertura del spec:**

| Requisito del spec | Tarea |
|---|---|
| Parte 2 con sus 7 secciones | Task 1 (steps 3-9) |
| Parte 3 con sus 8 secciones | Task 5 (steps 3-10) |
| `series` en las tres partes | Tasks 1, 3, 5 |
| Corregir «Mi repositorio de Dotfiles» | Task 3, step 2 |
| Enlaces internos P1↔P2↔P3 | Task 1 (steps 3, 9), Task 3 (step 2), Task 5 (steps 3, 10) |
| Enlace P2 → post de Claude Code | Task 1, step 6 |
| Portadas con `post:images` | Tasks 2 y 6 |
| `seo:audit` + `build` en verde | Tasks 1, 3, 4, 5, 6, 7 |
| `description` 150-160 | Tasks 1 (step 10) y 5 (step 11), medidas: 156 y 153 |
| Longitud 1.500-3.000 palabras | Tasks 1 (step 10) y 5 (step 11) |
| Fragmentos releídos del archivo real | Global Constraints + fragmentos ya extraídos en Tasks 1 y 5 |
| Cifras verificadas | Task 1 step 1, Task 5 step 1 |
| Un PR por parte, base `develop` | Tasks 4 y 7 |
| No tocar `kr0nicas/dotfiles` | Ninguna tarea lo modifica; solo lo leen |

**Riesgo conocido, sin tarea que lo cierre:** el post 1 tiene `tags: ["devex-tools"]` y las partes 2 y 3 añaden `automatizacion`, `sre` e `ingenieria-software`. Es intencional —cada post se etiqueta por su contenido, no por su serie— y no requiere acción.

**Consistencia de nombres verificada:** `series.name` = `Dotfiles como software de producción` en Tasks 1, 3 y 5. Slugs `dotfiles-instalador-presets-cross-platform` y `dotfiles-ci-hooks-changelog-catalogo` idénticos en todas sus apariciones, incluidos los enlaces internos cruzados.
