
"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const photos = {
  hero: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2200&q=90",
  compost:
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1100&q=85",
  garden:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1100&q=85",
  plants:
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1100&q=85",
  soil:
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=85",
  leaves:
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1100&q=85",
};

const suggestions = [
  "How do I start composting at home?",
  "Why does my compost smell bad?",
  "What can I put in my compost bin?",
  "How can my business turn food waste into compost?",
];

const features = [
  {
    number: "01",
    title: "Know what to compost",
    description:
      "Learn which kitchen scraps, garden materials, and natural ingredients belong in your compost.",
    image: photos.compost,
    tag: "THE BASICS",
  },
  {
    number: "02",
    title: "Find your method",
    description:
      "Explore composting methods for apartments, homes, gardens, farms, and commercial operations.",
    image: photos.garden,
    tag: "YOUR SPACE",
  },
  {
    number: "03",
    title: "Bring soil to life",
    description:
      "Understand moisture, airflow, temperature, and the conditions that help organic matter break down.",
    image: photos.soil,
    tag: "HEALTHIER SOIL",
  },
];

const stats = [
  { value: "01", label: "Simple starting point" },
  { value: "24/7", label: "AI guidance whenever you need it" },
  { value: "∞", label: "Ways to learn and improve" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, nature lover! 🌿 I'm your CompostAI assistant. Ask me about composting, food scraps, soil health, or troubleshooting your compost pile.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  async function sendMessage(question?: string) {
    const text = (question ?? input).trim();

    if (!text || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
    ]);
    setInput("");
    setIsLoading(true);
    setChatOpen(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The assistant could not respond.");
      }

      const answer =
        data.reply ??
        data.response ??
        data.text ??
        data.message ??
        data.output ??
        data.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("") ??
        "I couldn't find a response. Please try asking again.";

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: String(answer) },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `I'm sorry, I couldn't connect just now. ${errorMessage} Please try again in a moment.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F5ED] text-[#193B2B]">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 90px;
        }

        body {
          margin: 0;
          background: #f7f5ed;
        }

        ::selection {
          background: #c8d9b9;
          color: #193b2b;
        }

        .serif {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          letter-spacing: -0.055em;
        }

        .eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .reveal {
          animation: reveal-up 0.8s ease-out both;
        }

        .float-leaf {
          animation: float-leaf 7s ease-in-out infinite;
        }

        .float-leaf-delay {
          animation: float-leaf 9s ease-in-out 1.5s infinite;
        }

        .image-zoom img {
          transition: transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .image-zoom:hover img {
          transform: scale(1.055);
        }

        .chat-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .chat-scroll::-webkit-scrollbar-thumb {
          background: #cad5c3;
          border-radius: 10px;
        }

        @keyframes reveal-up {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-leaf {
          0%,
          100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-13px) rotate(5deg);
          }
        }

        @keyframes pulse-dot {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .typing-dot {
          animation: pulse-dot 1.2s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* NAVIGATION */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#173727]/95 text-white shadow-lg shadow-black/5 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b4c99e]/50 bg-[#d7e3ca]/10 text-xl">
              🌿
            </div>
            <div>
              <div className="text-lg font-semibold tracking-[-0.04em]">
                compost<span className="text-[#c0d6a9]">ai</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-white/55">
                Better soil. Better future.
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-[12px] text-white/75 lg:flex">
            <a className="transition hover:text-[#d3e4be]" href="#story">
              Our philosophy
            </a>
            <a className="transition hover:text-[#d3e4be]" href="#learn">
              Learn composting
            </a>
            <a className="transition hover:text-[#d3e4be]" href="#solutions">
              Solutions
            </a>
            <a className="transition hover:text-[#d3e4be]" href="#assistant">
              AI assistant
            </a>
          </nav>

          <a
            href="#assistant"
            className="hidden rounded-full bg-[#d8e5c9] px-5 py-3 text-xs font-bold text-[#193b2b] transition hover:bg-white sm:inline-flex"
          >
            Ask CompostAI <span className="ml-2">↗</span>
          </a>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl lg:hidden"
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="flex flex-col gap-5 border-t border-white/10 bg-[#173727] px-6 py-6 text-sm lg:hidden">
            {[
              ["Our philosophy", "#story"],
              ["Learn composting", "#learn"],
              ["Solutions", "#solutions"],
              ["AI assistant", "#assistant"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/85"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[780px] items-center overflow-hidden bg-[#173727] pt-[76px] text-white sm:min-h-[820px]"
      >
        <div className="absolute inset-0">
          <img
            src={photos.hero}
            alt="Sunlight filtering through a lush green forest"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102b1d]/95 via-[#173727]/75 to-[#173727]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173727]/75 via-transparent to-[#173727]/15" />
        </div>

        <div className="pointer-events-none absolute right-[8%] top-[24%] hidden text-[110px] opacity-30 md:block float-leaf">
          🍃
        </div>
        <div className="pointer-events-none absolute bottom-[22%] right-[23%] hidden text-5xl opacity-30 md:block float-leaf-delay">
          🌱
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-32">
          <div className="reveal max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#c6df9c]" />
              <span className="eyebrow text-[#e2ebd8]">
                A more thoughtful way to grow
              </span>
            </div>

            <h1 className="serif max-w-4xl text-6xl leading-[0.99] sm:text-7xl md:text-8xl lg:text-[100px]">
              Waste less.
              <br />
              <span className="italic text-[#c8dcae]">Grow more.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Turn everyday organic waste into something extraordinary.
              Discover the art of composting with nature-inspired knowledge
              and your personal AI growing companion.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#assistant"
                className="group inline-flex items-center justify-center gap-4 rounded-full bg-[#d8e5c9] px-7 py-4 text-sm font-bold text-[#193b2b] transition hover:-translate-y-1 hover:bg-white"
              >
                Meet your AI assistant
                <span className="transition group-hover:translate-x-1">↗</span>
              </a>
              <a
                href="#learn"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Explore composting <span>↓</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-7">
              <div>
                <div className="text-sm font-semibold">For everyday life</div>
                <div className="mt-1 text-xs text-white/60">
                  Kitchens · Homes · Gardens
                </div>
              </div>
              <div className="h-9 w-px bg-white/20" />
              <div>
                <div className="text-sm font-semibold">For growing businesses</div>
                <div className="mt-1 text-xs text-white/60">
                  Food waste · Soil · Sustainability
                </div>
              </div>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="w-full max-w-[350px] rounded-[28px] border border-white/25 bg-[#f7f5ed]/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-white/70">A little reminder</span>
                <span className="text-xl">✳</span>
              </div>
              <div className="mt-9 overflow-hidden rounded-[20px]">
                <img
                  src={photos.plants}
                  alt="Fresh green plants growing in natural light"
                  className="h-52 w-full object-cover"
                />
              </div>
              <h2 className="serif mt-6 text-3xl leading-tight">
                Good things grow from the ground up.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                A handful of scraps today can become a healthier garden
                tomorrow.
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-5">
                <span className="text-xs text-white/65">Start where you are</span>
                <a href="#story" className="text-sm text-[#d7e6c5]">
                  Discover why ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-5 hidden items-center gap-4 text-[9px] uppercase tracking-[0.22em] text-white/50 sm:left-8 md:flex lg:left-14">
          <span className="h-px w-12 bg-white/40" />
          Made for a greener everyday
        </div>
        <a
          href="#story"
          aria-label="Scroll to the next section"
          className="absolute bottom-6 right-7 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-lg transition hover:bg-white/15"
        >
          ↓
        </a>
      </section>

      {/* INTRO STRIP */}
      <section className="border-b border-[#dce0d4] bg-[#f7f5ed]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-14">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className={`flex items-center gap-5 ${
                index !== 0 ? "md:border-l md:border-[#d9ddcf] md:pl-8" : ""
              }`}
            >
              <div className="serif text-4xl text-[#59714b]">{stat.value}</div>
              <div className="max-w-[170px] text-sm leading-6 text-[#586353]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="bg-[#f7f5ed] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="image-zoom overflow-hidden rounded-[8px_120px_8px_8px]">
              <img
                src={photos.leaves}
                alt="Lush green leaves in a natural environment"
                className="h-[430px] w-full object-cover sm:h-[560px]"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 right-0 max-w-[250px] rounded-2xl bg-[#e4e9d9] p-5 shadow-xl sm:-right-5 sm:p-7">
              <div className="text-3xl">🌱</div>
              <p className="serif mt-3 text-2xl leading-tight text-[#24442e]">
                Nature doesn't waste. It transforms.
              </p>
            </div>
            <div className="absolute left-5 top-5 rounded-full bg-[#f7f5ed]/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#31543a] backdrop-blur">
              Our philosophy
            </div>
          </div>

          <div className="pt-3 lg:pl-3">
            <p className="eyebrow text-[#698054]">A circular way of thinking</p>
            <h2 className="serif mt-6 text-5xl leading-[1.08] text-[#193b2b] sm:text-6xl">
              From what&apos;s left
              <br />
              to what&apos;s <span className="italic text-[#70865b]">possible.</span>
            </h2>
            <p className="mt-7 text-base leading-8 text-[#626b5d]">
              Every day, kitchens and businesses produce organic materials
              that can often serve a second purpose. Composting helps turn
              suitable organic matter into a useful soil amendment instead
              of sending it straight to landfill.
            </p>
            <p className="mt-5 text-base leading-8 text-[#626b5d]">
              CompostAI makes the process easier to understand. Whether
              you&apos;re learning your first composting steps or exploring
              organic waste solutions for a business, you can find guidance
              that fits your needs.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="border-t border-[#d8ddcf] pt-5">
                <div className="text-2xl">♻</div>
                <h3 className="mt-3 text-sm font-bold">Think circular</h3>
                <p className="mt-2 text-sm leading-6 text-[#697061]">
                  Keep useful organic materials in the cycle.
                </p>
              </div>
              <div className="border-t border-[#d8ddcf] pt-5">
                <div className="text-2xl">🌾</div>
                <h3 className="mt-3 text-sm font-bold">Grow naturally</h3>
                <p className="mt-2 text-sm leading-6 text-[#697061]">
                  Learn how finished compost can support soil.
                </p>
              </div>
            </div>

            <a
              href="#learn"
              className="mt-9 inline-flex items-center gap-3 border-b border-[#416145] pb-2 text-sm font-bold transition hover:gap-5"
            >
              Explore the learning hub <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* LEARNING CARDS */}
      <section id="learn" className="bg-[#eaece1] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#688052]">The learning garden</p>
              <h2 className="serif mt-5 text-5xl leading-[1.05] sm:text-6xl">
                A little knowledge.
                <br />
                <span className="italic text-[#70865b]">A lot of growth.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#68705f]">
              Start with the basics, discover the method that suits your
              space, and learn how to care for your compost along the way.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group overflow-hidden rounded-[22px] border border-[#dce0d2] bg-[#f9f8f1] transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#263c25]/10"
              >
                <div className="image-zoom relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    className="h-[250px] w-full object-cover"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-[#f7f5ed]/90 px-3 py-2 text-[9px] font-bold tracking-[0.15em] text-[#27452f] backdrop-blur">
                    {feature.tag}
                  </span>
                  <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f5ed] text-lg text-[#24432d] transition group-hover:rotate-45">
                    ↗
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="text-xs font-bold tracking-[0.15em] text-[#81916e]">
                    {feature.number}
                  </div>
                  <h3 className="serif mt-3 text-3xl leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#697061]">
                    {feature.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setChatOpen(true);
                      setInput(
                        feature.number === "01"
                          ? "What materials can I compost, and what should I avoid?"
                          : feature.number === "02"
                            ? "Which composting method is best for my space?"
                            : "How can I tell when my compost is ready to use?"
                      );
                      document
                        .getElementById("assistant")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-6 inline-flex items-center gap-3 text-xs font-bold text-[#355a3c] transition group-hover:gap-5"
                  >
                    Ask CompostAI <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH PHOTO BANNER */}
      <section className="relative isolate overflow-hidden bg-[#173727]">
        <img
          src={photos.garden}
          alt="A garden full of healthy green plants"
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[#173727]/80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#142f20]/80 to-transparent" />

        <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#d1e1bc]">Small actions. Meaningful change.</p>
            <h2 className="serif mt-6 text-5xl leading-[1.07] text-white sm:text-7xl">
              The future is
              <br />
              <span className="italic text-[#d1e1bc]">grown, not thrown.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
              Build better habits around organic waste. Learn what works,
              make thoughtful choices, and help good materials find a
              useful next life.
            </p>
            <a
              href="#assistant"
              className="mt-9 inline-flex items-center gap-4 rounded-full bg-[#dce8ce] px-7 py-4 text-sm font-bold text-[#193b2b] transition hover:-translate-y-1 hover:bg-white"
            >
              Start your compost journey <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section id="solutions" className="bg-[#f7f5ed] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-[#70865b]">Good for every scale</p>
            <h2 className="serif mt-5 text-5xl leading-[1.08] sm:text-6xl">
              From your kitchen
              <br />
              <span className="italic text-[#70865b]">to your business.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#68705f]">
              Composting looks different in every setting. Start with
              practical guidance for your home, garden, farm, or workplace.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="group relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#254833] text-white">
              <img
                src={photos.plants}
                alt="Green plants for home and garden"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173727] via-[#173727]/35 to-transparent" />
              <div className="relative flex min-h-[440px] flex-col justify-end p-7 sm:p-10">
                <span className="eyebrow text-[#d5e4c6]">
                  For homes & gardens
                </span>
                <h3 className="serif mt-4 max-w-md text-4xl leading-tight sm:text-5xl">
                  Make room for a greener routine.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
                  Discover kitchen-scrap basics, container composting,
                  garden practices, and common troubleshooting tips.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    void sendMessage(
                      "Create a beginner-friendly composting plan for a home and garden."
                    )
                  }
                  className="mt-7 inline-flex w-fit items-center gap-4 rounded-full border border-white/50 px-5 py-3 text-xs font-bold transition hover:bg-white hover:text-[#193b2b]"
                >
                  Build a home plan <span>↗</span>
                </button>
              </div>
            </article>

            <article className="group relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#254833] text-white">
              <img
                src={photos.compost}
                alt="Natural organic material for composting"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173727] via-[#173727]/40 to-transparent" />
              <div className="relative flex min-h-[440px] flex-col justify-end p-7 sm:p-10">
                <span className="eyebrow text-[#d5e4c6]">
                  For businesses & growers
                </span>
                <h3 className="serif mt-4 max-w-md text-4xl leading-tight sm:text-5xl">
                  Give organic resources another purpose.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
                  Explore ways to assess organic waste streams, understand
                  composting processes, and plan a more circular workflow.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    void sendMessage(
                      "Help me explore an organic waste management and composting plan for a small business."
                    )
                  }
                  className="mt-7 inline-flex w-fit items-center gap-4 rounded-full border border-white/50 px-5 py-3 text-xs font-bold transition hover:bg-white hover:text-[#193b2b]"
                >
                  Explore business solutions <span>↗</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section id="assistant" className="bg-[#e8ecdf] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-[#6c8355]">Meet your growing companion</p>
            <h2 className="serif mt-5 text-5xl leading-[1.04] sm:text-6xl">
              Meet your
              <br />
              <span className="italic text-[#70865b]">soil sidekick.</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-[#626b5d]">
              Not sure whether those leftovers belong in your compost?
              Wondering why your pile smells strange? Ask CompostAI for
              helpful explanations and practical next steps.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Beginner-friendly explanations",
                "Troubleshooting compost problems",
                "Guidance for homes and businesses",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4dfc8] text-[#355a3c]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9 rounded-2xl border border-[#d2d9c9] bg-[#f7f5ed]/70 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#244731] text-xl text-white">
                  🌿
                </div>
                <div>
                  <div className="text-sm font-bold">CompostAI Assistant</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#738069]">
                    <span className="h-2 w-2 rounded-full bg-[#719755]" />
                    Ready to help
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 text-[#68705f]">
                AI answers can be imperfect. Check important food-safety,
                agricultural, and commercial decisions against reliable
                expert guidance.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#d6ddce] bg-[#fbfaf5] shadow-2xl shadow-[#1b3925]/10">
            <div className="flex items-center justify-between bg-[#193b2b] px-5 py-5 text-white sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl">
                  🌱
                </div>
                <div>
                  <h3 className="text-sm font-bold">CompostAI</h3>
                  <p className="mt-1 text-[11px] text-white/65">
                    Your organic growing companion
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-white/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#d4e5c1]">
                AI assistant
              </div>
            </div>

            <div className="chat-scroll flex h-[400px] flex-col gap-4 overflow-y-auto p-5 sm:h-[440px] sm:p-7">
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4eadb] text-sm">
                      🌿
                    </div>
                  )}
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === "user"
                        ? "rounded-br-sm bg-[#254b35] text-white"
                        : "rounded-bl-sm border border-[#e2e5db] bg-white text-[#394b3b]"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none break-words prose-headings:font-semibold prose-headings:text-[#254b35] prose-p:my-2 prose-a:text-[#527447] prose-strong:text-[#254b35] prose-ul:my-2 prose-li:my-0">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4eadb] text-sm">
                    🌿
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#e2e5db] bg-white px-5 py-4">
                    <span className="typing-dot h-2 w-2 rounded-full bg-[#6c8355]" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-[#6c8355]" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-[#6c8355]" />
                  </div>
                </div>
              )}
            </div>

            {messages.length === 1 && (
              <div className="border-t border-[#e5e8df] px-5 pt-5 sm:px-7">
                <p className="eyebrow text-[#78866d]">Try asking</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void sendMessage(suggestion)}
                      className="rounded-full border border-[#d9e0d2] bg-white px-3 py-2 text-left text-[11px] leading-5 text-[#456047] transition hover:border-[#78936c] hover:bg-[#f0f4e9] disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="border-t border-[#e5e8df] p-4 sm:p-6"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-[#dce1d5] bg-white p-2 pl-4 transition focus-within:border-[#7e9870] focus-within:ring-2 focus-within:ring-[#7e9870]/10">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask anything about composting..."
                  aria-label="Your composting question"
                  rows={2}
                  className="max-h-32 min-h-[48px] flex-1 resize-y bg-transparent py-3 text-sm leading-6 text-[#243d2b] outline-none placeholder:text-[#9aa295]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#244731] text-xl text-white transition hover:bg-[#355c40] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-[#8a9382]">
                <span>Enter to send · Shift + Enter for a new line</span>
                <span>Powered by AI</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#f7f5ed] px-5 py-24 sm:px-8 md:py-32 lg:px-14">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[30px] bg-[#193b2b] px-6 py-16 text-center text-white sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute -left-10 -top-16 text-[150px] opacity-[0.08]">
            🍃
          </div>
          <div className="pointer-events-none absolute -bottom-20 -right-8 text-[180px] opacity-[0.08]">
            🌿
          </div>
          <div className="relative mx-auto max-w-3xl">
            <p className="eyebrow text-[#c5d9b2]">Your next step starts here</p>
            <h2 className="serif mt-6 text-5xl leading-[1.08] sm:text-7xl">
              Let&apos;s grow
              <br />
              something <span className="italic text-[#c5d9b2]">good.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              Learn a little. Waste a little less. Give nature a helping hand,
              one composting decision at a time.
            </p>
            <a
              href="#assistant"
              className="mt-9 inline-flex items-center gap-4 rounded-full bg-[#dce8ce] px-7 py-4 text-sm font-bold text-[#193b2b] transition hover:-translate-y-1 hover:bg-white"
            >
              Ask your first question <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#122c1e] px-5 pb-8 pt-14 text-white sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <a href="#home" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl">
                  🌿
                </span>
                <span className="text-xl font-semibold tracking-[-0.04em]">
                  compost<span className="text-[#c0d6a9]">ai</span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                Making composting easier to understand through nature-inspired
                education and AI-powered guidance.
              </p>
            </div>

            <div>
              <p className="eyebrow text-[#c3d7ae]">Explore</p>
              <div className="mt-5 flex flex-col gap-4 text-sm text-white/65">
                <a className="transition hover:text-white" href="#story">
                  Our philosophy
                </a>
                <a className="transition hover:text-white" href="#learn">
                  Composting guide
                </a>
                <a className="transition hover:text-white" href="#solutions">
                  Solutions
                </a>
                <a className="transition hover:text-white" href="#assistant">
                  AI assistant
                </a>
              </div>
            </div>

            <div>
              <p className="eyebrow text-[#c3d7ae]">Our purpose</p>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                Help people discover better ways to manage organic materials
                and build more thoughtful composting habits.
              </p>
              <a
                href="#home"
                className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[#d5e4c5] hover:text-white"
              >
                Back to the top ↑
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 pt-7 text-[11px] text-white/45 sm:flex-row sm:items-center">
            <p>© {year} CompostAI. Grow a little greener.</p>
            <p>Built with care for a more circular future. 🌱</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CHAT BUTTON */}
      <button
        type="button"
        onClick={() => {
          setChatOpen((open) => !open);
          if (!chatOpen) {
            document
              .getElementById("assistant")
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }}
        aria-label={chatOpen ? "Close chat shortcut" : "Open CompostAI assistant"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-white/20 bg-[#193b2b] px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#193b2b]/25 transition hover:-translate-y-1 hover:bg-[#2c5138] sm:bottom-7 sm:right-7"
      >
        <span className="text-xl">🌿</span>
        <span>{chatOpen ? "CompostAI ready" : "Ask CompostAI"}</span>
      </button>
    </main>
  );
}
