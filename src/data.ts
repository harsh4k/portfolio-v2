import { Project, Poster, Thought, TimelineItem } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "velsaro",
    number: "01",
    title: "VELSARO",
    category: "websites",
    role: "Frontend Developer",
    description: "Luxury fragrance e-commerce platform combining modern frontend development, secure authentication, database integration and scalable application architecture.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Vite"],
    visual: "/images/velsaro.webp",
    link: "https://www.velsaro.in/",
    detail: {
      cover: "/images/velsaro.webp",
      paragraphs: [
        "A luxury fragrance e-commerce platform built from the ground up. From authentication to checkout, every component was designed with both aesthetics and performance in mind. The result is a shopping experience that feels as premium as the products it sells.",
        "Supabase handles the backend — user auth, product inventory, and order management are all managed through a robust PostgreSQL schema. Role-based access controls ensure the right people see the right data, while the real-time capabilities enable live inventory updates.",
        "The frontend is built with React and TypeScript, styled with Tailwind CSS. Every page is responsive, every transition is smooth, and every image is optimized for fast loading. The component library was built from scratch to ensure consistency across the entire platform.",
        "What started as a simple storefront evolved into a full-fledged e-commerce system with inventory tracking, admin dashboards, and a seamless user experience. This project taught me the importance of balancing feature richness with performance.",
      ],
    },
  },
  {
    id: "nexcart",
    number: "02",
    title: "NEXCART",
    category: "websites",
    role: "Frontend Developer",
    description: "Modern commerce application focused on reusable components, responsive layouts, API integration and performance optimisation.",
    tags: ["React", "Tailwind CSS", "TypeScript", "REST API"],
    visual: "/images/nexcart.webp",
    link: "https://nexcart-v1.vercel.app/",
    detail: {
      cover: "/images/nexcart.webp",
      paragraphs: [
        "A modern commerce application focused on reusable component architecture. The goal was to build a shopping experience that feels both familiar and fresh, with a clean design language that scales across the entire product catalog.",
        "API integration was a key focus — fetching products, managing cart state, and handling checkout flows all required careful state management. Custom hooks keep the logic clean and testable, while the REST API layer abstracts away backend complexity.",
        "The responsive layout adapts seamlessly from mobile to desktop, with careful attention to touch interactions and gesture-based navigation. Every breakpoint was considered, every edge case handled.",
        "Performance optimisation was a constant priority. Lazy loading, code splitting, and image optimisation keep the app snappy even on slower connections. The final build is lean, fast, and ready for production.",
      ],
    },
  },
  {
    id: "oysnk",
    number: "03",
    title: "OYSNK",
    category: "fun",
    role: "Frontend Developer",
    description: "Experimental web application exploring interaction systems, creative development and modern software architecture.",
    tags: ["Next.js", "CSS", "GSAP", "Tailwind CSS"],
    visual: "/images/Osynk.webp",
    link: "https://oysnk.vercel.app/",
    detail: {
      cover: "/images/Osynk.webp",
      paragraphs: [
        "An experimental playground where creative development meets interaction design. No constraints, no briefs — just pure exploration of what the web can do when you push beyond conventional patterns.",
        "The project experiments with scroll-triggered animations, dynamic layouts, and unconventional UI patterns. GSAP powers the motion, while CSS handles the visual polish. Every interaction was designed to surprise and delight.",
        "From cursor effects to page transitions, the goal was to create something that feels alive. The result is a digital experience that rewards exploration and challenges expectations.",
        "This project taught me that the best ideas often come from stepping outside the boundaries of conventional web development. Sometimes the most valuable thing you can build is something purely for the joy of building it.",
      ],
    },
  },
  {
    id: "synapical",
    number: "03",
    title: "SYNAPICAL",
    category: "websites",
    role: "Design & Frontend",
    description: "Landing site for a Delhi software studio — a bold editorial hero, a floating 3D browser mockup, and motion-driven storytelling built to convert.",
    tags: ["React", "Three.js", "GSAP", "Tailwind CSS"],
    visual: "/images/synapical.webp",
    link: "https://synapical-com.pages.dev/",
    detail: {
      cover: "/images/synapical.webp",
      paragraphs: [
        "Synapical needed a first impression that matched the work — a small studio that ships web, mobile, AI, and cloud. The hero leads with a single confident claim and a live 3D browser mockup, setting the tone before a visitor scrolls a single pixel.",
        "The layout is unapologetically editorial: oversized display type, a coordinate-marked masthead, and generous negative space. Every section is anchored to a strict grid so the density feels intentional rather than busy.",
        "Motion carries the narrative. GSAP-driven reveals, a parallax hero object, and micro-interactions on the calls-to-action keep the page feeling alive without ever getting in the way of the message.",
        "The result is a site that reads as a product, not a brochure — fast, responsive, and built so new case studies and services can be dropped in without touching the design system.",
      ],
    },
  },
  {
    id: "shipd",
    number: "04",
    title: "SHIPD",
    category: "fun",
    role: "Systems / Tooling",
    description: "A daily dev + activity report for Windows, written in pure PowerShell — no dependencies, no accounts, no telemetry. Every byte stays on your machine.",
    tags: ["PowerShell", "Windows", "Git", "Automation"],
    visual: "/images/shipd.webp",
    link: "https://github.com/harsh4k/shipd",
    detail: {
      cover: "/images/shipd.webp",
      paragraphs: [
        "Shipd snapshots what you actually did all day. Every ten minutes it records the app in focus, idle time, and any running games, then rolls it all into an evening report that sits alongside your git commits across every project.",
        "It's deliberately zero-footprint: pure PowerShell, no external modules, no cloud sync. The data never leaves the folder it lives in — a privacy-first take on quantified-self tooling.",
        "A live terminal dashboard renders the day's metrics, while Task Scheduler integration keeps the tracker running quietly in the background. Snapshot cadence and report timing are both configurable.",
        "It also handles the housekeeping — a RAM breakdown and standby-cache clearing — so the same tool that measures your machine helps keep it fast.",
      ],
    },
  },
  {
    id: "rudo",
    number: "05",
    title: "RUDO",
    category: "fun",
    role: "AI / Tooling",
    description: "A Jarvis-style personal AI assistant running fully local on Gemma 3 via Ollama, wrapped in an animated terminal chat UI.",
    tags: ["Python", "Ollama", "Gemma 3", "AI"],
    visual: "/images/rudo.webp",
    link: "https://github.com/harsh4k/rudo",
    detail: {
      cover: "/images/rudo.webp",
      paragraphs: [
        "Rudo is a conversational companion that never leaves your machine. Gemma 3 runs locally through Ollama, so every reply is private and offline — no API keys, no rate limits, no data leaving the room.",
        "The terminal interface streams responses with live markdown and code rendering, opens with an animated boot sequence, and keeps a persistent memory of the conversation across sessions.",
        "Tool access turns it from a chatbot into an assistant: it can run shell commands, search the web via DuckDuckGo, read files, set timers, and index notes for semantic search.",
        "Live system awareness — CPU, RAM, battery, time — is baked into the status bar, so Rudo always answers with context about the machine it's running on.",
      ],
    },
  },
  {
    id: "edith",
    number: "06",
    title: "EDITH",
    category: "fun",
    role: "Systems / Tooling",
    description: "A minimal terminal dashboard for real-time system monitoring — CPU, GPU, RAM, temperatures and cache in one clean CLI.",
    tags: ["Python", "psutil", "GPUtil", "CLI"],
    visual: "/images/edith.webp",
    link: "https://github.com/harsh4k/edith",
    detail: {
      cover: "/images/edith.webp",
      paragraphs: [
        "Edith strips system monitoring down to what matters. CPU, GPU, and RAM usage render as clean live bars, with temperature and cache readings surfaced when the hardware exposes them.",
        "Built on psutil and GPUtil, it stays dependency-light and fast. A live monitor mode refreshes continuously for at-a-glance observation, while one-off commands answer specific questions on demand.",
        "The command set is intentionally small and memorable — cpu, ram, disk, temp, monitor, clear, exit — so it becomes muscle memory rather than another tool to look up.",
        "It's the kind of utility that earns a permanent tab: quiet, accurate, and out of the way until you need it.",
      ],
    },
  },
];

export const POSTERS: Poster[] = [
  {
    id: "poster-1",
    number: "04",
    image: "/images/p1.webp",
    keywords: ["Grid", "Bold", "Minimal", "Contrast"],
    tagline: "Less is more — typography as structure.",
  },
  {
    id: "poster-2",
    number: "05",
    image: "/images/p2.webp",
    keywords: ["Type", "Scale", "Rhythm", "Space"],
    tagline: "Let the letters breathe and the layout follow.",
  },
  {
    id: "poster-3",
    number: "06",
    image: "/images/p3.webp",
    keywords: ["Mono", "Form", "Texture", "Layer"],
    tagline: "Shape and counter-shape in perfect balance.",
  },
  {
    id: "poster-4",
    number: "07",
    image: "https://picsum.photos/seed/poster-wave/800/1000?grayscale",
    keywords: ["Wave", "Motion", "Flow", "Gradient"],
    tagline: "Static on the surface. Moving underneath.",
  },
];

export const THOUGHTS: Thought[] = [
  {
    id: "thought-1",
    number: "01",
    image: "/images/t1.webp",
    thought: "Build Over Theory — Ship projects, not tutorials. Every idea becomes something real, something deployed, something that works.",
    tag: "Motto",
  },
  {
    id: "thought-2",
    number: "02",
    image: "/images/t2.webp",
    thought: "Attention to Detail — The premium feel isn't accidental. Typography, spacing, animation, layout — every pixel placed with intent.",
    tag: "Process",
  },
  {
    id: "thought-3",
    number: "03",
    image: "/images/t3.webp",
    thought: "Curiosity Over Comfort — Linux, AI tooling, Three.js, GSAP, backends, new workflows. The stack grows when you stay curious.",
    tag: "Mindset",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    year: "2024",
    title: "FUN FIRST",
    description: "Learning was chaotic. So was everything else. Wouldn't change it."
  },
  {
    year: "2025",
    title: "LOCKED IN",
    description: "Long nights. Hackathons. Good people. Great memories."
  },
  {
    year: "2026",
    title: "PERSPECTIVE",
    description: "Sometimes stepping away helps you move forward."
  }
];
