import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Copy, Github, Globe, Instagram, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const socialLinks = [
    {
      label: "GITHUB",
      icon: Github,
      address: "@harsh4k",
      url: "https://github.com/harsh4k",
      copy: false,
    },
    {
      label: "LINKEDIN",
      icon: Globe,
      address: "Harshit Chauhan",
      url: "https://www.linkedin.com/in/harshit-chauhan-17a898364/",
      copy: false,
    },
    {
      label: "INSTAGRAM",
      icon: Instagram,
      address: "@harshaintokay",
      url: "https://www.instagram.com/harshaintokay/?hl=en",
      copy: false,
    },
    {
      label: "DISCORD",
      icon: MessageCircle,
      address: "@harshaintokay",
      url: "",
      copy: true,
    },
  ];

  const handleClick = (link: typeof socialLinks[0]) => {
    if (link.copy) {
      navigator.clipboard.writeText(link.address).catch(() => {});
      setCopied(link.label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <footer
      id="contact"
      className="dark-grid relative min-h-screen border-t border-[#EEE9DC]/10 px-4 py-8 text-[#EEE9DC] select-none sm:px-6 md:px-12"
    >
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] flex-col justify-between gap-12">
        <div className="flex items-start justify-between border-b border-[#EEE9DC]/10 pb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EEE9DC]/50">
          <span>(07) Connect Layer</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              Mumbai, India
            </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
        >
          <div>
            <p className="mb-4 inline-flex rounded-full bg-[#C9FF3D] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513]">
              Open to opportunities
            </p>
            <h2 className="font-display text-[14vw] uppercase leading-[0.75] tracking-[-0.07em] sm:text-[12vw] lg:text-[9vw]">
              Let's Build
              <br />
              Something Great.
            </h2>
          </div>

          <div className="rounded-[36px] bg-[#F13A18] p-5 text-[#EEE9DC] md:p-8">
            <p className="font-display text-xl uppercase leading-tight md:text-2xl">
              Every great project starts with a conversation. Let's build something together.
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("harshitsinhchauhan250@gmail.com").catch(() => {});
                setCopied("email");
                setTimeout(() => setCopied(null), 2000);
              }}
              className="mt-8 flex w-full items-center justify-between rounded-full bg-[#EEE9DC] px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161513] transition-transform hover:-translate-y-1"
            >
              {copied === "email" ? "Email copied" : "Say hello"}
                <Copy className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-3 border-t border-[#EEE9DC]/10 pt-5 sm:grid-cols-4"
        >
          {socialLinks.map((link) => {
            const Icon = link.icon;
            const isCopied = copied === link.label;

            if (link.copy) {
              return (
                <button
                  key={link.label}
                  onClick={() => handleClick(link)}
                  className="group rounded-[24px] border border-[#EEE9DC]/10 p-3 text-left transition-all hover:bg-[#EEE9DC] hover:text-[#161513]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-55">{link.label}</span>
                    {isCopied ? (
                      <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#C9FF3D]">
                        <Copy className="h-3 w-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="h-4 w-4 text-[#F13A18] max-md:opacity-100 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </div>
                  <Icon className="h-5 w-5 opacity-75 transition-transform group-hover:scale-110" />
                </button>
              );
            }

            return (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                key={link.label}
                className="group rounded-[24px] border border-[#EEE9DC]/10 p-3 transition-all hover:bg-[#EEE9DC] hover:text-[#161513]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] opacity-55">{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#F13A18] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <Icon className="h-5 w-5 opacity-75 transition-transform group-hover:scale-110" />
              </a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-4 border-t border-[#EEE9DC]/10 pt-6 pb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#EEE9DC]/42 sm:flex-row"
        >
          <span>Designed and coded by Harshit Chauhan</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-left hover:text-[#EEE9DC]">
            Back to top
          </button>
          <span>2026 portfolio system</span>
        </motion.div>
      </div>
    </footer>
  );
}
