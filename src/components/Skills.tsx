import { Brain, Code2, Database, Layers, Palette, Rocket } from "lucide-react";
import { GooeyText } from "./ui/gooey-text-morphing";

export default function Skills() {
  const morphWords = ["Frontend", "Backend", "Tools", "Stack"];
  const skills = [
    { icon: Code2, label: "React / Next", detail: "TypeScript, Vite, component architecture" },
    { icon: Palette, label: "UI Systems", detail: "Tailwind CSS, design tokens, responsive" },
    { icon: Database, label: "Backend", detail: "Node.js, Express, Supabase, PostgreSQL" },
    { icon: Layers, label: "Animation", detail: "Three.js, GSAP, motion design" },
    { icon: Brain, label: "Tools", detail: "Git, Figma, VS Code, Vercel, Cursor" },
    { icon: Rocket, label: "APIs", detail: "REST, auth, data fetching, caching" },
  ];

  return (
    <section
      id="skills"
      className="dark-grid relative overflow-hidden border-t border-[#EEE9DC]/10 px-4 py-20 text-[#EEE9DC] select-none sm:px-6 md:px-12 md:py-28"
    >
      <div className="pointer-events-none absolute right-8 top-8 h-32 w-32 rounded-full border border-[#EEE9DC]/10" />

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#EEE9DC]/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#EEE9DC]/45">(03) Skill Console</p>
            <h2 className="mt-3 font-display text-[15vw] uppercase leading-[0.8] tracking-[-0.06em] md:text-[7vw]">
              Operating
              <br />
              Range
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#C9FF3D] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]">
            Active matrix
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-[32px] border border-[#EEE9DC]/15 bg-[#EEE9DC] p-4 text-[#161513]">
            <div className="mb-4 flex items-center justify-between rounded-full border border-[#161513]/15 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em]">
              <span>Core words</span>
              <span>Looping</span>
            </div>
            <div className="flex min-h-[310px] items-center justify-center rounded-[24px] bg-[#161513] px-2 text-[#EEE9DC] sm:min-h-[420px]">
              <GooeyText
                texts={morphWords}
                morphTime={1.0}
                cooldownTime={0.35}
                className="w-full font-display"
                textClassName="text-[#EEE9DC] text-[clamp(1.6rem,4vw,3rem)] uppercase leading-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.label}
                  className={`relative z-10 rounded-[28px] border border-[#EEE9DC]/12 p-5 transition-transform hover:-translate-y-1 hover:z-20 ${
                    index === 1 || index === 4 ? "bg-[#F13A18] text-[#EEE9DC]" : "bg-[#181713]"
                  }`}
                >
                  <div className="mb-12 flex items-center justify-between">
                    <Icon className="h-5 w-5" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl uppercase leading-none">{skill.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-65">{skill.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
