# Jorge Ochoa - Personal Blog & Technical Platform

Welcome to the source code of my personal blog and technical platform. This project serves as a space to share deep technical insights, modern software architecture, and practical experiences building production-ready applications.

## 🏗️ Architecture & Philosophy

- **Content-First, Zero Backend**: No external CMS or database. All content is managed as MDX files stored in `content/posts/`.
- **Performance & SEO Focus**: Utilizing Next.js Server Components, Static Site Generation (SSG), and incremental static regeneration features to achieve maximum performance and SEO reach.
- **Minimalist Aesthetic**: Clean, distraction-free reading experience inspired by modern tech blogs.

## 🛠️ Tech Stack

This blog is built using cutting-edge web technologies:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Design Tokens
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (accessible, unopinionated foundation)
- **Content**: [MDX](https://mdxjs.com/) (Markdown + React Components for interactive posts)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (purposeful micro-interactions)
- **Deployment**: [Vercel](https://vercel.com/) (continuous deployment from `main`)

## 🎯 Content Pillars

The blog primarily focuses on:
1. **Software Architecture** - Clean Arch, Hexagonal Architecture, DDD, and microservices in the real world.
2. **Python & Backend** - FastAPI, LangChain, production-grade patterns.
3. **Modern Frontend** - Next.js, React Server Components.
4. **Applied AI** - LLMs in production, agents, and system integration.
5. **B2B SaaS / ERP** - Practical lessons learned from building "Orbis 8".

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kr0nicas/ochoajorge-blog-me.git
   cd ochoajorge-blog-me
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn / pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📝 Writing a New Post

Posts are written in MDX to mix standard Markdown with interactive elements.

To create a new post, create a `.mdx` file inside the `content/posts/` directory. You can utilize the custom `/new_post` workflow if configured. 

> **Tip:** You must include valid frontmatter (title, date, description, etc.) at the top of the MDX file.

## 🤝 Contribution & Handoff Protocol

This project incorporates AI-assisted workflows (combining inputs from Gemini and Claude). Each technical decision is evaluated for performance and architectural alignment before integration.

## 📄 License

This project is open source. All text content (posts) are copyright Jorge Ochoa unless stated otherwise.
