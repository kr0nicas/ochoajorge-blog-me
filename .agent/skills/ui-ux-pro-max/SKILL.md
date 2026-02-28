---
name: ui-ux-pro-max
description: Expert-level UI/UX design skill specializing in futuristic, high-fidelity interfaces using Tailwind CSS v4, Glassmorphism, and Neon aesthetics.
---

# 🎨 UI/UX Pro Max Skill

## 🎯 Purpose
To elevate the visual quality of the application to a "Pro Max" standard, characterized by deep immersion, futuristic aesthetics, micro-interactions, and flawless responsiveness.

## 🧠 Core Competencies

### 1. Aesthetic Mastery (The "Pro Max" Look)
- **Glassmorphism**: Use `glass-premium`, `glass-card` utilities for depth.
- **Neon Accents**: Strategically use `brand-cyan` (#00FFFF) and `brand-pink` (#FF00FF) for emphasis.
- **Dark Mode First**: Design for deep contrast (`#000000` / `#02040a` backgrounds) with glowing elements.
- **Mesh Gradients**: Use subtle, moving gradients for backgrounds to create life.

### 2. Technical Implementation (Tailwind CSS v4)
- **Token Usage**: ALWAYS use CSS variables defined in `@theme` (e.g., `--color-brand-cyan`).
- **Utility First**: Avoid custom CSS files; use Tailwind arbitrary values `[]` only when necessary, otherwise extend the theme.
- **Semantic Classes**: Use standard classes like `app-page`, `app-sidebar` for layout consistency.

### 3. User Experience (UX)
- **Micro-interactions**: Everything interactive must react (hover, active, focus). Use `transition-all duration-300`.
- **Feedback**: Immediate visual feedback for actions (loading states, success pulses).
- **Whitespace**: Generous padding and margins (`gap-6`, `p-8`) to let content breathe.

## 🛠️ Toolbelt

### Standard Utilities
```css
/* Glass Effect */
.glass-premium {
  @apply backdrop-blur-[12px] bg-white/[0.03] border border-white/[0.08];
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

/* Neon Borders */
.glow-border-cyan {
  @apply border-cyan-500/30;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

/* Text Gradients */
.premium-gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300;
}
```

### Critical Rules
1. **Never use plain colors** for main backgrounds; use noise or gradients.
2. **Never use default default scrollbars**; use `custom-scrollbar`.
3. **Contrast Ratio**: Ensure text is readable (`slate-400` minimum for secondary text on dark).
4. **Mobile First**: All layouts must stack gracefully on `< md` screens.
