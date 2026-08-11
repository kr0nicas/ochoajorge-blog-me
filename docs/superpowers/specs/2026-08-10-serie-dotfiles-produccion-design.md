# Serie «Dotfiles como software de producción» — diseño

Fecha: 2026-08-10
Estado: diseño aprobado

## Problema

El blog tiene un post sobre dotfiles: `dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo`
(2026-05-29). Es un tutorial genérico —qué son, por qué tenerlos, tabla de ahorro
de tiempo, Chezmoi y Stow— y su única sección sobre el repo real, «Mi repositorio
de Dotfiles», describe una estructura que **ya no existe**: `.zshrc` en la raíz,
un `setup.sh` que nunca se escribió y Oh My Zsh, que el repo no usa.

Mientras tanto `kr0nicas/dotfiles` acumuló 350 commits entre el 26 de febrero y
el 10 de agosto de 2026 y dejó de parecerse a lo que aquel post describe. Hoy
tiene instalador modular con presets, verificación de checksums, tres hooks de
git, cuatro jobs de CI, 231 tests y un escaparate en GitHub Pages cuyo catálogo
se deriva del propio repo.

Hay material para contar algo que el primer post no podía contar: **qué le pasa a
un repo de dotfiles cuando se le aplican las obligaciones de un proyecto de
software**. Y hay una deuda que saldar: corregir la parte del post viejo que
miente.

## Objetivos

1. Dos posts nuevos que sostengan la tesis «los dotfiles se degradan como
   cualquier código sin disciplina», cada uno con entidad propia y suficiente
   longitud para el rango SEO del blog (1.500-3.000 palabras).
2. Que cada regla del post se justifique con un fallo real del repo, no con una
   buena práctica citada de segunda mano.
3. Integrar el post existente como Parte 1 de una serie, corrigiendo lo que
   afirma de falso sin tocar su URL ni su SEO acumulado.

## No objetivos

- **Versión en inglés.** El post original solo está en español y la serie lo
  sigue. Duplicar copy es la misma trampa de deriva que el post denuncia.
- **Tocar el repo de dotfiles.** Los posts lo documentan; no se implementa nada
  nuevo allí para tener qué contar.
- **Renombrar o republicar el post 1.** Su slug tiene SEO acumulado desde mayo.
- **Volcar el README al blog.** El README es referencia de consulta; estos posts
  son argumentativos. Si un post acaba pareciéndose al README, está mal escrito.
- **Convertirlo en un post sobre agentes.** El preset `--agent` tiene sección
  propia en la Parte 2, no protagonismo.

## Decisiones

| Decisión | Elegido | Por qué |
|---|---|---|
| Tesis | Dotfiles como software de producción | Es lo que diferencia estos posts del primero y de los cien tutoriales de dotfiles que ya existen |
| Formato | Serie formal de 3 partes | Dos posts de ~2.200 palabras sostienen mejor el material que uno de 4.500, y el campo `series` da navegación entre partes |
| Corte entre P2 y P3 | Instalador \| Arnés + escaparate | Cada mitad es autocontenida y tiene su propio gancho; el corte temático (reglas \| datos) dejaba al instalador sin casa |
| Evidencia | Los fallos como categoría, sin SHAs | Convence igual que la versión con nombre y apellidos, sin convertir el post en autoflagelación |
| Código | Fragmentos reales cortos (5-15 líneas) | Verificables contra el repo y copiables; los bloques largos acercan el post al README |
| Idioma | Solo español | Coherencia con la Parte 1 y con el grueso del blog |
| Pilar | `construir-con-ia` en las tres partes | Es el pilar del post 1 y el que cubre disciplina de desarrollo |

## Arquitectura de la serie

`series.name` es `"Dotfiles como software de producción"` en las tres partes. El
nombre tiene que ser **idéntico carácter a carácter** o `getAllSeries()` las
agrupa como series distintas.

| Parte | Slug | Estado |
|---|---|---|
| 1 | `dotfiles-el-secreto-para-ser-productivo-en-tu-entorno-de-desarrollo` | Existe; se le añade `series` y se corrige una sección |
| 2 | `dotfiles-instalador-presets-cross-platform` | Nuevo |
| 3 | `dotfiles-ci-hooks-changelog-catalogo` | Nuevo |

### Frontmatter

```yaml
# Parte 2
title: "Dotfiles cross-platform: un instalador con cinco presets"
date: "2026-08-11"
pillar: "construir-con-ia"
tags: ["devex-tools", "automatizacion", "sre"]
series:
  name: "Dotfiles como software de producción"
  part: 2

# Parte 3
title: "Dotfiles con CI: hooks, CHANGELOG generado y datos que no mienten"
date: "2026-08-14"
pillar: "construir-con-ia"
tags: ["devex-tools", "automatizacion", "ingenieria-software"]
series:
  name: "Dotfiles como software de producción"
  part: 3
```

Publicación escalonada, decidida por el autor: la Parte 2 sale hoy (2026-08-11) y
la Parte 3 tres días después (2026-08-14).

`lib/posts.ts` filtra por `draft`, no por fecha futura: si las dos partes fueran
en el mismo PR, la Parte 3 aparecería el día 11 con fecha del 14. Por eso **cada
parte va en su propio PR**, y el de la Parte 3 se abre el día que le toca. Hasta
entonces su MDX puede existir en rama, pero no se mergea.

`agentes-ia` **no** entra en los tags de la Parte 2 pese a la sección del preset
`--agent`: el post trata de instalar entornos, y ese tag lo mezclaría con los 31
posts de agentes del blog desdibujando ambos.

## Parte 2 — «Dotfiles cross-platform: un instalador con cinco presets»

~2.200 palabras.

| # | Sección | Pal. | Contenido |
|---|---|---|---|
| 1 | Apertura | 150 | La Parte 1 defendía *tener* dotfiles. 350 commits después, aquel consejo se rompió en el primer sitio que no era una laptop. Tesis: en cuanto tocan más de una máquina, dejan de ser configs |
| 2 | El script que crece hasta que nadie lo lee | 400 | 1.012 líneas en un archivo → 123. El orquestador decide *qué* y *en qué orden*, `lib/` sabe *cómo*. Consecuencia: cada fase se prueba sola |
| 3 | Cinco presets: decide la máquina, no tú | 450 | Un VPS no tiene GUI, un contenedor no tiene sudo. Matriz de presets × módulos, `--dry-run` como contrato, `safe_link` y el backup con timestamp |
| 4 | El preset `--agent` | 350 | La tool Bash de Claude Code es una zsh no interactiva que no sourcea el `zshrc`: allí no se renderiza starship ni los aliases, y no hay terminal para tmux ni nvim |
| 5 | «No coincide» ≠ «no pude comprobar» | 350 | Checksums contra el `checksums.txt` del release; el fallo aborta, el hueco avisa. Y la honestidad sobre los `curl \| bash` que quedan |
| 6 | El test que ninguno de los otros iba a encontrar | 400 | JSON minificado + `sed` greedy = el asset equivocado, en silencio. Pasó `bash -n`, shellcheck y 114 tests, porque los tres miran el código sin ejecutarlo. La respuesta: instalar de verdad en `debian:stable-slim` |
| 7 | Cierre | 150 | Un instalador correcto no impide que el repo se pudra → Parte 3 |

**Componentes MDX**: `<FileTree>` para `lib/`, `<ComparisonTable>` para la matriz
de presets, `<Callout type="warning">` para el trade-off de `curl | bash`.

**Fragmentos de código** (todos verificados contra el repo antes de publicar):
bloque de invocación de fases de `install.sh`, tabla de presets, `case` de los
tres desenlaces del checksum, bucle de verificación del smoke test.

## Parte 3 — «Dotfiles con CI: hooks, CHANGELOG generado y datos que no mienten»

~2.300 palabras.

| # | Sección | Pal. | Contenido |
|---|---|---|---|
| 1 | Apertura | 200 | El repo tenía CI, convención y specs, y aun así el commit que rompía la convención lo generaba el propio repo. Tesis: una convención que vive en la costumbre no es una regla |
| 2 | Tres puertas | 500 | `commit-msg` / `pre-commit` / `pre-push`. Degradación deliberada cuando falta la herramienta, y lo que nunca degrada. El ámbito contra lista cerrada, con el error indicando dónde ampliarla |
| 3 | El CI reusa el hook, no una copia | 300 | `commit-lint` invoca el propio hook. El locale y `${#subject}`: 68 vs 73 caracteres para la misma cadena. shellcheck a nivel `info` y por qué `warning` no bastaba |
| 4 | `main` protegida sin bloquearte | 250 | 0 revisores exige PR sin exigir revisor; `enforce_admins: false` deliberado. Un arnés sin salida de emergencia se desactiva el primer día que estorba |
| 5 | Un CHANGELOG que no se escribe | 450 | La regresión infinita del commit que se lista a sí mismo. La fecha del último commit del rango, nunca `date`. Regla: un artefacto generado es función pura del repo |
| 6 | El catálogo que no puede mentir | 450 | Extractor + prosa curada + guardia bidireccional. El riesgo del parser de regex sobre bash y los conteos mínimos por fuente como red |
| 7 | El mismo principio, tres veces | 200 | `gcx`, CHANGELOG y catálogo son la misma regla: estado leído, nunca hardcodeado |
| 8 | Cierre | 150 | Nada de esto hacía falta para *tener* dotfiles; hace falta para que sigan siendo verdad dentro de seis meses |

**Componentes MDX**: `<ComparisonTable>` para los tres hooks, `<Steps>` para el
pipeline del catálogo, `<Callout type="danger">` para la regresión infinita del
CHANGELOG.

## Cifras verificadas

Medidas contra el repo el 2026-08-10, no citadas de memoria. Se re-verifican
antes de publicar.

| Dato | Valor | Cómo se comprobó |
|---|---|---|
| Commits del repo | 350 | `git rev-list --count HEAD` |
| Rango de fechas | 2026-02-26 → 2026-08-10 | `git log --reverse` |
| `install.sh` antes del refactor | 1.012 líneas | `git show f70301a^:install.sh \| wc -l` |
| `install.sh` tras el refactor | 123 líneas | `git show f70301a:install.sh \| wc -l` |
| `install.sh` hoy | 150 líneas | `wc -l install.sh` |
| Fases | 8, en 10 archivos de `lib/` | `grep phase_ install.sh` |
| Presets | 5 | `--vps`, `--k8s-node`, `--container`, `--minimal`, `--agent` |
| Tests de shell | 183 | Suites corridas: 45+13+4+70+15+27+4+5 |
| Tests del web | 48 | `npm test` en `web/` |
| Total | 231 | |
| Fichas del catálogo | 134 curadas / 187 entradas extraídas | Una herramienta puede venir por macOS y por Linux |

## Cambios en el post 1

Dos, ninguno estructural:

1. **Frontmatter**: añadir `series` con `part: 1`. No se toca `title`, `date` ni
   el slug.
2. **Sección «Mi repositorio de Dotfiles»**: reescribirla para que describa la
   estructura real (`zshrc` sin punto en la raíz, `config/`, `lib/`, `install.sh`
   con presets, sin `setup.sh` y sin Oh My Zsh) y enlazar a las Partes 2 y 3.

El resto del post —qué son los dotfiles, por qué tenerlos, buenas prácticas,
Chezmoi/Stow— se queda intacto: sigue siendo válido y es el «porqué» sobre el que
se apoyan las otras dos partes.

## Enlaces internos

- P1 → P2 y P3 (al final de la sección corregida).
- P2 → P1 (apertura) y P3 (cierre).
- P2 § preset `--agent` → `agentic-saas-b2b-disciplina-de-desarrollo-con-claude-code`.
- P3 → P2 (apertura) y P1 (cierre).
- Los tres → `github.com/kr0nicas/dotfiles` y `kr0nicas.github.io/dotfiles`.

## Verificación antes de publicar

1. Cada fragmento de código se relee del archivo real del repo en el momento de
   escribirlo. Ninguno se reconstruye de memoria: es exactamente el fallo del
   post 1 que esta serie viene a corregir.
2. `npm run seo:audit` y `npm run build` en verde.
3. `description` de 150-160 caracteres en ambos posts.
4. Longitud dentro de 1.500-3.000 palabras.
5. `series.name` idéntico en las tres partes.
6. Portadas con `npm run post:images -- <slug> es` antes de quitar el `draft`.

## Publicación

Una rama `content/<slug>` por post, PR con base `develop`, según `AGENTS.md`.
Nunca push a `main`: producción se mueve solo con el PR de release
`develop` → `main`.
