/* App.jsx — Nosso Brasil Inteligente landing page */
const { useState, useEffect, useRef } = React;

/* -------- Shape SVG icons (drawn inline, brand-aligned) -------- */
function ShapeHeart({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill={color} d="M50 88 C20 66 10 50 10 35 C10 22 20 12 32 12 C40 12 47 17 50 24 C53 17 60 12 68 12 C80 12 90 22 90 35 C90 50 80 66 50 88 Z"/>
    </svg>
  );
}
function ShapeHouse({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill={color} d="M10 50 L50 18 L90 50 L90 88 L62 88 L62 64 L38 64 L38 88 L10 88 Z"/>
    </svg>
  );
}
function ShapeSun({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="22" fill={color}/>
      {[...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 50 + Math.cos(a) * 32;
        const y1 = 50 + Math.sin(a) * 32;
        const x2 = 50 + Math.cos(a) * 44;
        const y2 = 50 + Math.sin(a) * 44;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="6" strokeLinecap="round"/>;
      })}
    </svg>
  );
}
function ShapeRoad({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill={color} d="M30 12 L40 12 L46 50 L46 88 L36 88 L30 50 Z"/>
      <path fill={color} d="M70 12 L60 12 L54 50 L54 88 L64 88 L70 50 Z"/>
      <rect x="46" y="42" width="8" height="6" fill={color}/>
      <rect x="46" y="62" width="8" height="6" fill={color}/>
    </svg>
  );
}
function ShapeFlower({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="32" r="14" fill={color}/>
      <circle cx="32" cy="50" r="14" fill={color}/>
      <circle cx="68" cy="50" r="14" fill={color}/>
      <circle cx="50" cy="68" r="14" fill={color}/>
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.5"/>
      <rect x="48" y="68" width="4" height="22" fill={color}/>
    </svg>
  );
}
function ShapeLamp({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="46" y="14" width="8" height="74" fill={color}/>
      <path fill={color} d="M30 22 L70 22 L62 38 L38 38 Z"/>
      <circle cx="50" cy="46" r="6" fill={color} opacity="0.6"/>
    </svg>
  );
}
function ShapeStripes({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="10" y="22" width="80" height="10" fill={color}/>
      <rect x="10" y="44" width="80" height="10" fill={color} opacity="0.8"/>
      <rect x="10" y="66" width="80" height="10" fill={color} opacity="0.6"/>
    </svg>
  );
}
function ShapeShield({ color = "#fff" }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill={color} d="M50 10 L86 22 L86 52 C86 70 70 84 50 92 C30 84 14 70 14 52 L14 22 Z"/>
      <path d="M34 50 L46 62 L68 38" fill="none" stroke={color === "#fff" ? "#2a3ea0" : "#fff"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* -------- Reveal hook -------- */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* -------- Counter animation -------- */
function Counter({ target, suffix = "", duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val.toLocaleString('pt-BR')}{suffix}</span>;
}

/* -------- BrandHead (header reutilizável: kicker + headline com pull-up + italic-serif accent) -------- */
function BrandHead({ kicker, segments, lede, theme = "on-light", showDots = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); ob.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  let wIdx = 0;
  return (
    <div ref={ref} className={`brand-head ${theme}`}>
      {kicker && <div className="kicker">{kicker}</div>}
      <h2>
        {segments.map((seg, si) => {
          const words = seg.text.split(' ');
          return (
            <span key={si} className={seg.italic ? 'seg-italic' : ''}>
              {words.map((w, i) => {
                const idx = wIdx++;
                return (
                  <span key={i} className="word">
                    <span className="word-inner" style={{ transitionDelay: `${idx * 0.05}s` }}>{w}</span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </h2>
      {lede && <p className="lede">{lede}</p>}
      {showDots && (
        <div className="brand-dots" style={{ marginTop: 28 }} aria-hidden="true">
          <span className="d-yellow"/>
          <span className="d-pink"/>
          <span className="d-orange"/>
          <span className="d-green"/>
          <span className="d-cyan"/>
          <span className="d-red"/>
        </div>
      )}
    </div>
  );
}

/* -------- Nav -------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: "#sobre", label: "Sobre" },
    { href: "#pilares", label: "Pilares" },
    { href: "#smart", label: "Smart Cities" },
    { href: "#ods", label: "ODS 2030" },
    { href: "#projetos", label: "Projetos" },
    { href: "#noticias", label: "Notícias" },
  ];
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-row">
        <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
          <img src="assets/logo-nbi.png" alt="Nosso Brasil Inteligente"/>
        </a>
        <nav className={`nav-links ${open ? 'mobile-open' : ''}`}>
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
          <a href="#contato" className="nav-cta" onClick={() => setOpen(false)}>Fale conosco</a>
        </nav>
        <button className={`nav-burger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}

/* -------- Hero V2 (full-bleed inset, pill nav hangs from top, giant headline) -------- */
function Hero() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.2 });
    if (titleRef.current) ob.observe(titleRef.current);
    if (contentRef.current) ob.observe(contentRef.current);
    return () => ob.disconnect();
  }, []);

  const navLinks = [
    { href: "#sobre",     label: "Sobre" },
    { href: "#pilares",   label: "Iniciativa" },
    { href: "#smart",     label: "Cardápio" },
    { href: "#ods",       label: "Indicadores" },
    { href: "#contato",   label: "Contato" },
  ];

  // "Nosso Brasil*" — split em palavras pra animação
  const words = ["Nosso", "Brasil"];

  return (
    <section id="top" className="hero-v2">
      <div className="hero-v2-frame">
        <img className="hero-v2-bg" src="assets/girl-balloons.jpg" alt="Criança brasileira segurando balões"/>
        <div className="hero-v2-grain" aria-hidden="true"/>
        <div className="hero-v2-fade" aria-hidden="true"/>

        <nav className="hero-v2-nav" aria-label="Principal">
          <a href="#top" className="hero-v2-nav-logo" aria-label="Nosso Brasil Inteligente">
            <img src="assets/logo-nbi-white.svg" alt="Nosso Brasil Inteligente"/>
          </a>
          {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>

        {/* Decorações de marca flutuando no hero */}
        <div className="brand-deco h-faixa" aria-hidden="true"/>
        <div className="brand-deco h-faixa-2" aria-hidden="true"/>
        <div className="brand-deco h-sol float-a" aria-hidden="true">
          <img src="assets/sol.png" alt=""/>
        </div>
        <div className="brand-deco h-vaso float-b" aria-hidden="true">
          <img src="assets/vaso.png" alt=""/>
        </div>
        <div className="brand-deco h-casa float-c" aria-hidden="true">
          <img src="assets/casa.png" alt=""/>
        </div>

        <div ref={contentRef} className="hero-v2-content">
          <div className="hero-v2-title-wrap">
            <div className="hero-v2-eyebrow">Um Sonho de Muitos</div>
            <h1 ref={titleRef} className="hero-v2-title" aria-label="Nosso Brasil">
              {words.map((w, i) => (
                <span key={i} className="word">
                  <span className="word-inner">
                    {i === words.length - 1 ? (
                      <>{w}<span className="star" aria-hidden="true">*</span></>
                    ) : <>{w}{' '}</>}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="hero-v2-side">
            <p className="hero-v2-lede">
              Um mundo mais justo e feliz para todos. Ajudamos cidades a se
              tornarem lugares melhores para viver através de soluções urbanas integradas.
            </p>
            <a href="#contato" className="hero-v2-cta" aria-label="Junte-se ao movimento">
              <span>Junte-se ao movimento</span>
              <span className="hero-v2-cta-circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Marquee -------- */
function Marquee() {
  const phrase = (
    <span>
      <span>Educação</span>
      <span className="marquee-dot"/>
      <span>Sustentabilidade</span>
      <span className="marquee-dot pink"/>
      <span>Cidades Inteligentes</span>
      <span className="marquee-dot green"/>
      <span>Inclusão Social</span>
      <span className="marquee-dot cyan"/>
      <span>Tecnologia para o Bem</span>
      <span className="marquee-dot orange"/>
      <span>Brasil 2030</span>
      <span className="marquee-dot"/>
    </span>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {phrase}{phrase}{phrase}
      </div>
    </div>
  );
}

/* -------- About V2 (card escuro centrado, headline multi-style, body com reveal por char) -------- */
function About() {
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);

  // Headline em 3 segmentos com pesos/estilos diferentes
  const segments = [
    { text: "Somos uma rede", italic: false },
    { text: "de cidadãos engajados.", italic: true },
    { text: "Atuamos com tecnologia, empatia e dados para reescrever a rotina das cidades brasileiras.", italic: false },
  ];

  // Animação de pull-up nas palavras da headline
  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ob.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    if (headlineRef.current) ob.observe(headlineRef.current);
    return () => ob.disconnect();
  }, []);

  // Reveal char-by-char baseado no progresso de scroll. Otimizado:
  //  - rAF throttle (1 cálculo por frame, não por evento)
  //  - Só atualiza chars que mudaram de estado (evita 280 ops por scroll)
  //  - Só observa scroll quando o card está visível na viewport
  useEffect(() => {
    const node = bodyRef.current;
    if (!node) return;
    const chars = Array.from(node.querySelectorAll('.ch'));
    const total = chars.length;
    let lastLit = -1;
    let rafId = null;
    let isVisible = false;

    const compute = () => {
      rafId = null;
      const card = node.closest('.about-v2-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.2;
      const startY = rect.top - start;
      const endY = rect.bottom - end;
      const totalRange = startY - endY;
      const progress = Math.max(0, Math.min(1, -startY / -totalRange));
      const litCount = Math.round(progress * total);
      if (litCount === lastLit) return;
      // Atualiza só o que mudou
      if (litCount > lastLit) {
        for (let i = Math.max(0, lastLit); i < litCount; i++) chars[i] && chars[i].classList.add('lit');
      } else {
        for (let i = litCount; i < lastLit; i++) chars[i] && chars[i].classList.remove('lit');
      }
      lastLit = litCount;
    };
    const schedule = () => { if (rafId == null && isVisible) rafId = requestAnimationFrame(compute); };

    const card = node.closest('.about-v2-card') || node;
    const visObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { isVisible = e.isIntersecting; if (isVisible) schedule(); });
    }, { rootMargin: '200px 0px' });
    visObs.observe(card);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      visObs.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Build headline com palavras separadas (cada palavra anima)
  let wordIdx = 0;
  const renderedSegments = segments.map((seg, segIdx) => {
    const words = seg.text.split(' ');
    return (
      <span key={segIdx} className={seg.italic ? 'seg-italic' : ''}>
        {words.map((w, i) => {
          const idx = wordIdx++;
          return (
            <span key={i} className="word">
              <span
                className="word-inner"
                style={{ transitionDelay: `${idx * 0.06}s` }}
              >{w}</span>
            </span>
          );
        })}
      </span>
    );
  });

  const bodyText = "";

  return (
    <section id="sobre" className="about-v2">
      <div className="brand-deco a-sol float-a" aria-hidden="true"><img src="assets/sol.png" alt=""/></div>
      <div className="brand-deco a-vaso float-b" aria-hidden="true"><img src="assets/vaso.png" alt=""/></div>
      <div className="brand-deco a-casa float-c" aria-hidden="true"><img src="assets/casa.png" alt=""/></div>
      <div className="brand-deco a-poste float-a" aria-hidden="true"><img src="assets/poste.png" alt=""/></div>

      <div className="about-v2-card">
        <img
          src="assets/logo-nbi-white.svg"
          alt="Nosso Brasil Inteligente"
          style={{ height: 64, width: 'auto', margin: '0 auto 24px', display: 'block' }}
        />
        <div className="about-v2-kicker">Quem somos</div>
        <h2 ref={headlineRef} className="about-v2-headline">
          {renderedSegments}
        </h2>
        <p ref={bodyRef} className="about-v2-body" style={{ display: 'none' }}>
          {/* nbsp render hack abaixo */}
          {bodyText.split('').map((c, i) => (
            <span key={i} className="ch">{c === ' ' ? ' ' : c}</span>
          ))}
        </p>
        <div className="brand-dots" aria-hidden="true">
          <span className="d-yellow"/>
          <span className="d-pink"/>
          <span className="d-orange"/>
          <span className="d-green"/>
          <span className="d-cyan"/>
          <span className="d-red"/>
        </div>
      </div>
    </section>
  );
}

/* -------- Features V2 (4 cards: 1 visual + 3 numerados com checklist + arrow) -------- */
function Pillars() {
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ob.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -100px 0px" });

    if (headRef.current) ob.observe(headRef.current);
    if (gridRef.current) {
      gridRef.current.querySelectorAll('.feat-card').forEach(c => ob.observe(c));
    }
    return () => ob.disconnect();
  }, []);

  const Check = () => (
    <svg className="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  const Arrow = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );

  // Headline em duas linhas com pull-up
  const lineWords = [
    { line: 1, text: "Soluções de cidade inteligente" },
    { line: 1, text: "ancoradas em pessoas." },
    { line: 2, text: "Construído com prefeituras." },
    { line: 2, text: "Movido por comunidades." },
  ];
  let wIdx = 0;

  const features = [
    {
      cls: "f-edu",
      num: "01",
      iconSrc: "assets/sol.png",
      title: "Por que?",
      items: [
        "Ajudar o Brasil a dar um passo firme rumo a cidades melhores para as pessoas",
        "'Não deixar ninguém para trás' é o lema da Agenda 2030 para o desenvolvimento sustentável",
      ],
    },
    {
      cls: "f-cid",
      num: "02",
      iconSrc: "assets/casa.png",
      title: "Para quem?",
      items: [
        "Prefeitos, agentes técnicos e políticos",
        "Poder legislativo e judiciário",
        "Instituições de ensino e pesquisa",
        "Setor privado",
        "Organizações da sociedade civil",
      ],
    },
    {
      cls: "f-inc",
      num: "03",
      iconSrc: "assets/vaso.png",
      title: "Para que foi feito?",
      items: [
        "Definir 'cidades inteligentes' no contexto brasileiro",
        "Fomentar o desenvolvimento econômico local",
        "Estimular modelos e instrumentos de financiamento",
        "Fortalecer o papel do poder público",
        "Criar maior engajamento da sociedade",
      ],
    },
  ];

  return (
    <section id="pilares" className="features-v2">
      <div className="brand-deco f-faixa" aria-hidden="true"/>
      <div className="brand-deco f-faixa-2" aria-hidden="true"/>
      <div className="features-v2-inner">
        <div ref={headRef} className="features-v2-head">
          <h2>
            <span className="line-1">
              {lineWords.filter(w => w.line === 1).map((w, i) => (
                <span key={i} className="word">
                  <span className="word-inner" style={{ transitionDelay: `${(wIdx++) * 0.05}s` }}>{w.text}</span>
                </span>
              ))}
            </span>
            <span className="line-2">
              {lineWords.filter(w => w.line === 2).map((w, i) => (
                <span key={i} className="word">
                  <span className="word-inner" style={{ transitionDelay: `${(wIdx++) * 0.05}s` }}>{w.text}</span>
                </span>
              ))}
            </span>
          </h2>
        </div>

        <div ref={gridRef} className="features-v2-grid">
          {/* Card visual */}
          <div className="feat-card visual">
            <img src="assets/brasil-3.jpg" alt="Brasil acontecendo"/>
            <div className="feat-visual-overlay"/>
            <div className="feat-visual-label">Sua tela em branco<br/>para um país novo.</div>
          </div>

          {features.map((f) => (
            <div key={f.num} className={`feat-card ${f.cls}`}>
              <div className="feat-icon-img">
                <img src={f.iconSrc} alt=""/>
              </div>
              <div className="feat-num">— {f.num}</div>
              <h3 className="feat-title">{f.title}</h3>
              <ul className="feat-list">
                {f.items.map((it, i) => (
                  <li key={i}><Check/><span>{it}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- Smart Cities -------- */
function Smart() {
  const offerings = [
    { color: "var(--nbi-blue)", icon: <ShapeLamp color="#fff"/>, title: "Infraestrutura", text: "Indústria 4.0, incubadoras, wi-fi público, iluminação inteligente e monitoramento climático." },
    { color: "var(--nbi-green)", icon: <ShapeHouse color="#fff"/>, title: "Habitação digna", text: "Sistemas de bioconstrução, moradia assistida e plataforma de mapeamento." },
    { color: "var(--nbi-orange)", icon: <ShapeHeart color="#fff"/>, title: "Serviços sociais", text: "Banco de Tempo, cidadania financeira, cozinha social e biblioteca de objetos." },
    { color: "var(--nbi-pink)", icon: <ShapeFlower color="#fff"/>, title: "Espaços verdes", text: "Hortas urbanas, praças vivas e gestão participativa de áreas comunitárias." },
    { color: "var(--nbi-cyan)", icon: <ShapeSun color="#fff"/>, title: "Energia limpa", text: "Projetos de energia solar comunitária e eficiência energética em prédios públicos." },
    { color: "var(--nbi-yellow)", icon: <ShapeHeart color="#222"/>, title: "Saúde conectada", text: "Telemedicina com IA, triagem avançada e dispositivos para assistência médica." },
    { color: "#4c359a", icon: <ShapeStripes color="#fff"/>, title: "Dados abertos", text: "Gestão do terceiro setor, das escolas e painéis de transparência cívica." },
    { color: "var(--nbi-red)", icon: <ShapeShield color="#fff"/>, title: "Segurança", text: "Tecnologia preventiva para proteção social e monitoramento urbano." },
  ];
  return (
    <section id="smart" className="sec smart">
      <div className="container">
        <BrandHead
          theme="on-light"
          kicker="Cardápio Nosso"
          segments={[
            { text: "Inteligência que" },
            { text: "cabe na rotina.", italic: true },
          ]}
          lede="Mais de 100 soluções prontas para serem adotadas por municípios brasileiros — um ecossistema verdadeiramente revolucionário."
        />
        <div className="smart-grid reveal-stagger">
          {offerings.map((o, i) => (
            <div key={i} className="smart-card">
              <div className="smart-icon" style={{ background: o.color }}>
                <div style={{ width: 26, height: 26 }}>{o.icon}</div>
              </div>
              <div>
                <h4>{o.title}</h4>
                <p>{o.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- ODS -------- */
const ODS = [
  { n: 1,  c: "#e5243b", t: "Erradicação da Pobreza",            d: "Acabar com a pobreza em todas as suas formas, em todos os lugares." },
  { n: 2,  c: "#dda63a", t: "Fome Zero",                          d: "Acabar com a fome, alcançar a segurança alimentar e melhorar a nutrição." },
  { n: 3,  c: "#4c9f38", t: "Saúde e Bem-Estar",                  d: "Assegurar uma vida saudável e promover o bem-estar para todas as idades." },
  { n: 4,  c: "#c5192d", t: "Educação de Qualidade",              d: "Educação inclusiva, equitativa e oportunidades de aprendizagem ao longo da vida." },
  { n: 5,  c: "#ff3a21", t: "Igualdade de Gênero",                d: "Empoderar mulheres e meninas e alcançar a igualdade de gênero." },
  { n: 6,  c: "#26bde2", t: "Água Potável e Saneamento",          d: "Disponibilidade e gestão sustentável da água e saneamento para todos." },
  { n: 7,  c: "#fcc30b", t: "Energia Limpa e Acessível",          d: "Acesso à energia barata, confiável, sustentável e renovável." },
  { n: 8,  c: "#a21942", t: "Trabalho Decente",                   d: "Crescimento econômico inclusivo, emprego pleno e produtivo." },
  { n: 9,  c: "#fd6925", t: "Indústria e Inovação",               d: "Construir infraestruturas resilientes e fomentar a inovação." },
  { n: 10, c: "#dd1367", t: "Redução das Desigualdades",          d: "Reduzir as desigualdades dentro dos países e entre eles." },
  { n: 11, c: "#fd9d24", t: "Cidades Sustentáveis",               d: "Tornar cidades inclusivas, seguras, resilientes e sustentáveis." },
  { n: 12, c: "#bf8b2e", t: "Consumo Responsável",                d: "Padrões de produção e consumo sustentáveis." },
  { n: 13, c: "#3f7e44", t: "Ação Contra Mudança do Clima",       d: "Combater as mudanças climáticas e seus impactos." },
  { n: 14, c: "#0a97d9", t: "Vida na Água",                       d: "Conservação e uso sustentável dos oceanos, mares e recursos marinhos." },
  { n: 15, c: "#56c02b", t: "Vida Terrestre",                     d: "Proteger ecossistemas terrestres, deter a desertificação e perda de biodiversidade." },
  { n: 16, c: "#00689d", t: "Paz, Justiça e Instituições",        d: "Sociedades pacíficas, acesso à justiça e instituições eficazes." },
  { n: 17, c: "#19486a", t: "Parcerias e Meios de Implementação", d: "Reforçar parcerias globais para o desenvolvimento sustentável." },
];
/* Ícones ODS (SVGs simples, brancos, representativos) */
const ODS_ICONS = {
  1:  <path d="M14 22h8M11 22a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4M16 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 26h28"/>,
  2:  <path d="M9 14h14a8 8 0 0 1-7 8h0a8 8 0 0 1-7-8zM16 6c-2 2-2 5 0 6 2-1 2-4 0-6zM16 22v6"/>,
  3:  <path d="M6 16h6l2-4 4 8 2-4h6M16 7a5 5 0 0 0-9 3c0 5 9 13 9 13s9-8 9-13a5 5 0 0 0-9-3z"/>,
  4:  <path d="M6 13l10-5 10 5-10 5-10-5zM10 15v6c0 2 3 4 6 4s6-2 6-4v-6M26 13v8"/>,
  5:  <path d="M16 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM16 22v6M13 26h6M19 12l4-4M19 8h4v4"/>,
  6:  <path d="M16 6c-4 6-7 10-7 14a7 7 0 0 0 14 0c0-4-3-8-7-14zM12 20a4 4 0 0 0 4 4"/>,
  7:  <path d="M16 6v3M16 23v3M6 16h3M23 16h3M9 9l2 2M21 21l2 2M21 11l2-2M9 23l2-2M16 11a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>,
  8:  <path d="M6 24V14M11 24v-6M16 24V8M21 24v-4M26 24v-8M5 27h22"/>,
  9:  <path d="M6 26V12l4-3 4 3v14M6 18h8M16 26V14l5-3 5 3v12M16 19h10M10 22h0M21 18h0M21 22h0"/>,
  10: <path d="M8 12l-3 4 3 4M24 12l3 4-3 4M5 16h22M11 22h10"/>,
  11: <path d="M5 26V14l5-4 5 4v12M15 26V10l5-4 5 4v16M4 27h24M9 18h2M9 22h2M19 14h2M19 18h2M19 22h2"/>,
  12: <path d="M11 11a6 6 0 1 0 0 10c2 0 4-2 5-5s3-5 5-5a6 6 0 1 1 0 10c-2 0-4-2-5-5s-3-5-5-5z"/>,
  13: <path d="M10 14a6 6 0 1 1 12 0 4 4 0 0 1 0 8H10a4 4 0 0 1 0-8zM16 22v4M14 25l2 2 2-2"/>,
  14: <path d="M5 18c4-3 7-3 11 0M16 18c4-3 7-3 11 0M22 12c-2 2-2 4 0 6-2 0-4-1-5-3 1-2 3-3 5-3zM21 15h0"/>,
  15: <path d="M16 26V12M11 16c0-3 2-5 5-5s5 2 5 5M8 20c0-3 3-5 8-5s8 2 8 5M5 26h22"/>,
  16: <path d="M16 6l-2 4-4 1 3 3-1 4 4-2 4 2-1-4 3-3-4-1zM10 20v7M22 20v7M16 17v10M6 27h20"/>,
  17: <path d="M11 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM14 14l4 4M19 10l1-1M12 22l-1 1M21 12l-1 1M11 23l-1-1"/>,
};

function OdsIcon({ n }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {ODS_ICONS[n]}
    </svg>
  );
}

function Ods() {
  return (
    <section id="ods" className="sec ods">
      <div className="container">
        <BrandHead
          theme="on-light"
          kicker="Agenda 2030"
          segments={[
            { text: "Os 17 ODS" },
            { text: "na prática.", italic: true },
          ]}
          lede="Cada projeto que iniciamos é mapeado às metas globais. Toque em um objetivo pra ver como o NBI atua nele."
        />
        <div className="ods-grid reveal-stagger">
          {ODS.map((o) => (
            <button
              key={o.n}
              className="ods-tile"
              style={{ background: o.c }}
              aria-label={`ODS ${o.n} — ${o.t}`}
            >
              <div className="ods-tile-top">
                <div className="ods-num">{String(o.n).padStart(2, '0')}</div>
                <div className="ods-icon"><OdsIcon n={o.n}/></div>
              </div>
              <div className="ods-label">{o.t}</div>
              <div className="ods-tip" role="tooltip">
                <div className="ods-tip-head">
                  <span className="ods-tip-num" style={{ color: o.c }}>ODS · {String(o.n).padStart(2, '0')}</span>
                  <span className="ods-tip-title">{o.t}</span>
                </div>
                <p className="ods-tip-desc">{o.d}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- FIB (Felicidade Interna Bruta) -------- */
function Founder() {
  return (
    <section id="fundador" className="sec founder">
      <div className="container">
        <BrandHead
          theme="on-dark"
          kicker="FIB"
          segments={[
            { text: "Felicidade", italic: true },
            { text: "Interna Bruta." },
          ]}
          showDots={false}
        />
        <div className="founder-card">
          <div className="founder-grid">
            <div className="founder-photo reveal">
              <div className="founder-photo-bg"/>
              <img src="assets/sebastian.png" alt="Sebastian Soul, embaixador"/>
              <div className="founder-photo-caption">
                <strong>Sebastian Soul</strong>
                <span>Embaixador</span>
              </div>
            </div>
            <div className="founder-text reveal">
              <h2 className="founder-tagline">
                Nós não criamos apenas cidades inteligentes.
                <br/>
                Nós criamos cidades <span className="seg-italic">felizes, humanas e sustentáveis.</span>
              </h2>
              <p>
                FIB é um índice de desenvolvimento que prioriza o bem-estar
                psicológico em vez de apenas o crescimento econômico (medido pelo PIB).
              </p>
              <p>
                A felicidade de uma população é medida através de uma metodologia
                estruturada em quatro pilares fundamentais, que se desdobram em
                nove domínios específicos:
              </p>
              <div className="fib-block">
                <div className="fib-label">Pilares</div>
                <p>Boa governança · Desenvolvimento Sustentável · Preservação Cultural · Conservação Ambiental.</p>
              </div>
              <div className="fib-block">
                <div className="fib-label">Domínios</div>
                <p>Bem-estar psicológico · Saúde · Educação · Uso do tempo · Diversidade e resiliência cultural · Boa governança · Vitalidade comunitária · Diversidade e resiliência ecológica · Padrão de vida.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Projects -------- */
function Projects() {
  const items = [
    { cls: "p1", city: "Recife · PE", title: "Praça Viva no Bairro Novo", text: "Reativação de espaço público com iluminação solar, hortas comunitárias e oficinas culturais." },
    { cls: "p2", city: "Belo Horizonte · MG", title: "Escola Conectada", text: "Programa de alfabetização digital para 1.200 jovens em escolas da rede pública municipal." },
    { cls: "p3", city: "Manaus · AM", title: "Rotas da Floresta", text: "Mobilidade sustentável e transporte fluvial inteligente para comunidades ribeirinhas." },
  ];
  return (
    <section id="projetos" className="sec projects">
      <div className="container">
        <BrandHead
          theme="on-dark"
          kicker="Projetos em campo"
          segments={[
            { text: "Brasil acontecendo" },
            { text: "agora.", italic: true },
          ]}
          lede="Iniciativas em curso, com impacto medido e replicáveis em outras cidades do país."
        />
        <div className="projects-row reveal-stagger">
          {items.map((p, i) => (
            <article key={i} className={`project-card ${p.cls}`}>
              <div className="meta"><span className="meta-dot"/> {p.city}</div>
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- Partners -------- */
function Partners() {
  const others = [
    "Prefeituras Parceiras", "ONU Brasil", "SEBRAE", "MCTI",
    "Instituto C&A", "Fundação Lemann", "Pacto Global"
  ];
  return (
    <section id="parceiros" className="sec partners">
      <div className="container">
        <BrandHead
          theme="on-light"
          kicker="Parceiros"
          segments={[
            { text: "Quem caminha" },
            { text: "com a gente.", italic: true },
          ]}
          lede="Construímos juntos. Parcerias são o caminho mais curto pra um país mais justo."
        />
        <div className="partners-grid reveal-stagger">
          <div className="partner-card">
            <img src="assets/logo-citytech.png" alt="CityTech"/>
          </div>
          {others.map((p) => (
            <div key={p} className="partner-card">
              <div className="placeholder">{p}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- News -------- */
function News() {
  const items = [
    { cat: "Reportagem", title: "Como Recife transformou uma praça com R$ 80 mil e 200 voluntários", date: "12 mar 2025", time: "5 min", img: "assets/brasil-1.webp" },
    { cat: "Entrevista", title: "Sebastian Dias: 'cidade inteligente é cidade que escuta'", date: "28 fev 2025", time: "8 min", img: "assets/brasil-3.jpg" },
    { cat: "Bastidores", title: "O dia em que conectamos uma escola na floresta amazônica", date: "10 fev 2025", time: "6 min", img: "assets/brasil-4.jpg" },
  ];
  return (
    <section id="noticias" className="sec news">
      <div className="container">
        <BrandHead
          theme="on-light"
          kicker="Notícias"
          segments={[
            { text: "O que está" },
            { text: "se movendo.", italic: true },
          ]}
          lede="Histórias, estudos e bastidores de iniciativas por todo o território nacional."
        />
        <div className="news-grid reveal-stagger">
          {items.map((n, i) => (
            <article key={i} className="news-card">
              <div className="news-cover" style={{ backgroundImage: `url(${n.img})` }}/>
              <div className="news-body">
                <div className="news-cat">{n.cat}</div>
                <h4>{n.title}</h4>
                <div className="news-meta">{n.date} · {n.time} de leitura</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- Contact form -------- */
function Contact() {
  const [type, setType] = useState("Prefeitura");
  const [form, setForm] = useState({ nome: "", email: "", org: "", mensagem: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const types = ["Prefeitura", "ONG", "Empresa", "Cidadão", "Imprensa"];

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Por favor, informe seu nome.";
    if (!form.email.trim()) e.email = "E-mail é obrigatório.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "E-mail inválido.";
    if (!form.mensagem.trim()) e.mensagem = "Conte um pouco do seu interesse.";
    return e;
  }
  function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSent(true);
      setForm({ nome: "", email: "", org: "", mensagem: "" });
      setTimeout(() => setSent(false), 5000);
    }
  }

  return (
    <section id="contato" className="sec contact">
      <div className="container">
        <BrandHead
          theme="on-dark"
          kicker="Fale conosco"
          segments={[
            { text: "Pronto pra" },
            { text: "fazer junto?", italic: true },
          ]}
          showDots={false}
        />
      </div>
      <div className="container contact-grid" style={{ marginTop: 0 }}>
        <div className="contact-left reveal">
          <h2 style={{ display: 'none' }}>Pronto para fazer junto?</h2>
          <p>
            Se você representa uma prefeitura, organização social, empresa
            ou simplesmente quer apoiar de alguma forma — escreve pra gente.
            Lemos cada mensagem.
          </p>
          <div className="contact-item">
            <div className="contact-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="m4 6 8 7 8-7"/></svg>
            </div>
            <div>
              <div className="label">E-mail</div>
              <div className="value">contato@nossobrasilinteligente.com.br</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </div>
            <div>
              <div className="label">Sede</div>
              <div className="value">São Paulo · SP — atuação nacional</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v6h-6"/></svg>
            </div>
            <div>
              <div className="label">Tempo de resposta</div>
              <div className="value">Até 3 dias úteis</div>
            </div>
          </div>
        </div>

        <form className="form reveal" onSubmit={submit} noValidate>
          <div className="form-group">
            <label>Como você se identifica?</label>
            <div className="chip-row">
              {types.map((t) => (
                <button
                  key={t} type="button"
                  className={`chip ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                className={`form-control ${errors.nome ? 'error' : ''}`}
                value={form.nome}
                onChange={e => setForm({...form, nome: e.target.value})}
                placeholder="Como devemos te chamar?"
              />
              {errors.nome && <div className="error-text">{errors.nome}</div>}
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="seu@email.com"
              />
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
          </div>
          <div className="form-group">
            <label>Organização (opcional)</label>
            <input
              className="form-control"
              value={form.org}
              onChange={e => setForm({...form, org: e.target.value})}
              placeholder="Nome da prefeitura, ONG ou empresa"
            />
          </div>
          <div className="form-group">
            <label>Como podemos colaborar?</label>
            <textarea
              className={`form-control ${errors.mensagem ? 'error' : ''}`}
              value={form.mensagem}
              onChange={e => setForm({...form, mensagem: e.target.value})}
              placeholder="Conte sobre seu projeto, cidade ou ideia."
            />
            {errors.mensagem && <div className="error-text">{errors.mensagem}</div>}
          </div>
          <button type="submit" className="btn form-submit">
            Enviar mensagem <span className="btn-arrow">→</span>
          </button>
          {sent && (
            <div className="form-success">
              <span style={{ fontSize: 18 }}>✓</span>
              Em breve retornaremos o contato.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

/* -------- Footer -------- */
function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="foot-top">
          <div>
            <div className="foot-logo">
              <img src="assets/logo-nbi-white.svg" alt="NBI" style={{ height: 40 }}/>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, maxWidth: 320, margin: 0 }}>
              Movimento brasileiro pelo desenvolvimento de cidades inteligentes,
              inclusivas e sustentáveis. Inspirados pela Agenda 2030 da ONU.
            </p>
          </div>
          <div>
            <h5>Movimento</h5>
            <a href="#sobre">Quem somos</a>
            <a href="#pilares">Pilares</a>
            <a href="#fundador">Fundador</a>
            <a href="#parceiros">Parceiros</a>
          </div>
          <div>
            <h5>Atuação</h5>
            <a href="#smart">Smart Cities</a>
            <a href="#ods">17 ODS</a>
          </div>
          <div>
            <h5>Contato</h5>
            <a href="#contato">Fale conosco</a>
            <a href="mailto:contato@nossobrasilinteligente.com.br">E-mail</a>
            <a href="#">Imprensa</a>
            <a href="#">Voluntariado</a>
          </div>
        </div>
        <div className="foot-bot">
          <div>© {new Date().getFullYear()} Nosso Brasil Inteligente. Todos os direitos reservados.</div>
          <div>Feito no Brasil, para os brasileiros.</div>
        </div>
      </div>
    </footer>
  );
}

/* -------- App -------- */
function App() {
  useReveal();
  return (
    <>
      <Hero/>
      <About/>
      <Pillars/>
      <Marquee/>
      <Smart/>
      <Ods/>
      <Founder/>
      {/* <Projects/> — suspenso temporariamente */}
      <Partners/>
      {/* <News/> — oculto temporariamente */}
      <Contact/>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
