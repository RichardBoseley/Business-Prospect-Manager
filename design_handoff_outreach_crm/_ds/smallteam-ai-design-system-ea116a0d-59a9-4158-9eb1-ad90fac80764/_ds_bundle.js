/* @ds-bundle: {"format":4,"namespace":"SmallteamAiDesignSystem_ea116a","components":[{"name":"CTASection","sourcePath":"ui_kits/marketing_site/CTASection.jsx"},{"name":"FAQ","sourcePath":"ui_kits/marketing_site/FAQ.jsx"},{"name":"Footer","sourcePath":"ui_kits/marketing_site/Footer.jsx"},{"name":"Hero","sourcePath":"ui_kits/marketing_site/Hero.jsx"},{"name":"OurProcess","sourcePath":"ui_kits/marketing_site/OurProcess.jsx"},{"name":"Pricing","sourcePath":"ui_kits/marketing_site/Pricing.jsx"},{"name":"SectionLabel","sourcePath":"ui_kits/marketing_site/SectionLabel.jsx"},{"name":"TopNav","sourcePath":"ui_kits/marketing_site/TopNav.jsx"},{"name":"WhatWeBuild","sourcePath":"ui_kits/marketing_site/WhatWeBuild.jsx"}],"sourceHashes":{"ui_kits/marketing_site/CTASection.jsx":"6e344999f8d2","ui_kits/marketing_site/FAQ.jsx":"0a605e53950f","ui_kits/marketing_site/Footer.jsx":"7209b1e48805","ui_kits/marketing_site/Hero.jsx":"14ebff9f8292","ui_kits/marketing_site/OurProcess.jsx":"dff55b34cc43","ui_kits/marketing_site/Pricing.jsx":"9518a1a20421","ui_kits/marketing_site/SectionLabel.jsx":"b7d6f16fe708","ui_kits/marketing_site/TopNav.jsx":"a1d89fc09c42","ui_kits/marketing_site/WhatWeBuild.jsx":"9fabf470db9c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SmallteamAiDesignSystem_ea116a = window.SmallteamAiDesignSystem_ea116a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/marketing_site/Footer.jsx
try { (() => {
/* global React */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: '#0A1628',
      color: 'rgba(255,255,255,0.6)',
      padding: '48px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: '#fff',
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '-0.02em'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/smallteam-robologo.png",
    alt: "",
    style: {
      height: 28,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, "smallteam", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#00C2A8',
      fontWeight: 800
    }
  }, ".ai"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none'
    }
  }, "Services"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none'
    }
  }, "Process"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none'
    }
  }, "Pricing"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none'
    }
  }, "FAQ"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none'
    }
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.4)'
    }
  }, "\xA9 2026 smallteam.ai \xB7 Built for small businesses.")));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/Hero.jsx
try { (() => {
/* global React */
const {
  useState,
  useEffect,
  useRef
} = React;
const heroPlaceholders = ["I run a plumbing business, how do I stop losing jobs?", "We need a CRM that matches our sales process", "Can you help us automate client onboarding?", "Our spreadsheets are a mess. What do we do?"];
function Hero() {
  const [ph, setPh] = useState('');
  const [idx, setIdx] = useState(0);
  const [val, setVal] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  // Animated typing placeholder
  useEffect(() => {
    if (messages.length > 0) return;
    let i = 0,
      txt = heroPlaceholders[idx],
      dir = 1;
    setPh('');
    const t = setInterval(() => {
      i += dir;
      setPh(txt.slice(0, i));
      if (i >= txt.length) {
        dir = -1;
        setTimeout(() => {}, 1200);
      }
      if (i <= 0 && dir === -1) {
        clearInterval(t);
        setIdx((idx + 1) % heroPlaceholders.length);
      }
    }, dir > 0 ? 55 : 28);
    return () => clearInterval(t);
  }, [idx, messages.length]);
  const send = () => {
    if (!val.trim()) return;
    const userMsg = val.trim();
    setVal('');
    setMessages(m => [...m, {
      role: 'user',
      text: userMsg
    }]);
    setSending(true);
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'assistant',
        text: "Thanks! To understand your situation better — roughly how many people are on your team, and what tools are you using today to manage this?"
      }]);
      setSending(false);
    }, 900);
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `linear-gradient(180deg, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0.25) 40%, rgba(10,22,40,0.65) 100%), radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(10,22,40,0.5) 100%), url('../../assets/bg-skycitylake.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '140px 24px 80px',
      color: '#fff',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      width: '100%',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 600,
      color: 'rgba(77,255,180,0.85)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      background: 'rgba(0,194,168,0.1)',
      border: '1px solid rgba(0,194,168,0.3)',
      borderRadius: 999,
      padding: '6px 14px',
      marginBottom: 28
    }
  }, "Bespoke software \xB7 Subscription pricing"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(38px, 5.5vw, 64px)',
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
      margin: '0 0 20px'
    }
  }, "Custom software", /*#__PURE__*/React.createElement("br", null), "built for your business."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.65,
      color: 'rgba(255,255,255,0.72)',
      maxWidth: 600,
      margin: '0 auto 40px'
    }
  }, "Automate your business. Do more with less. Bespoke tools, built in weeks, for a low monthly fee."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 14,
      padding: 14,
      maxWidth: 680,
      margin: '0 auto',
      boxShadow: '0 8px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)'
    }
  }, messages.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 260,
      overflowY: 'auto',
      padding: '6px 6px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      textAlign: 'left'
    }
  }, messages.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: 'flex-end',
      background: '#00C2A8',
      color: '#0A1628',
      padding: '8px 14px',
      borderRadius: 14,
      borderBottomRightRadius: 4,
      maxWidth: '78%',
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 500
    }
  }, m.text) : /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: 'flex-start',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      maxWidth: '82%'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/smallteam-robologo.png",
    alt: "",
    style: {
      height: 26,
      width: 'auto',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.12)',
      color: 'rgba(255,255,255,0.95)',
      padding: '8px 14px',
      borderRadius: 14,
      borderBottomLeftRadius: 4,
      fontSize: 14,
      lineHeight: 1.5
    }
  }, m.text))), sending && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-start',
      color: 'rgba(255,255,255,0.5)',
      fontSize: 13,
      paddingLeft: 34
    }
  }, "thinking\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: val,
    onChange: e => setVal(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') send();
    },
    placeholder: messages.length ? "Type your reply…" : ph + '▎',
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fff',
      fontSize: 16,
      padding: '12px 10px',
      fontFamily: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: send,
    style: {
      width: 38,
      height: 38,
      borderRadius: 999,
      background: '#00C2A8',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 13V3M3 8l5-5 5 5",
    stroke: "#0A1628",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, ['CRM for my service business', 'Automate onboarding', 'Replace our spreadsheets'].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setVal(c),
    style: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.18)',
      color: 'rgba(255,255,255,0.85)',
      borderRadius: 999,
      padding: '6px 14px',
      fontSize: 13,
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, c)))));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/SectionLabel.jsx
try { (() => {
/* global React */
function SectionLabel({
  children,
  onDark
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: onDark ? 'rgba(77,255,180,0.85)' : '#00C2A8',
      background: onDark ? 'rgba(0,194,168,0.1)' : 'rgba(0,194,168,0.08)',
      border: onDark ? '1px solid rgba(0,194,168,0.3)' : '1px solid rgba(0,194,168,0.25)',
      borderRadius: 999,
      padding: '4px 12px',
      fontFamily: 'var(--font-sans)'
    }
  }, children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/CTASection.jsx
try { (() => {
/* global React */

const {
  useState
} = React;
function CTASection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    message: ''
  });
  const update = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      position: 'relative',
      padding: '96px 24px',
      fontFamily: 'var(--font-sans)',
      backgroundImage: `linear-gradient(180deg, rgba(10,22,40,0.82), rgba(10,22,40,0.92)), url('../../assets/bg-williamstown.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, {
    onDark: true
  }, "Let's get started"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(28px, 4vw, 44px)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
      margin: '14px 0 14px'
    }
  }, "Start the conversation."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.65,
      color: 'rgba(255,255,255,0.65)',
      maxWidth: 520,
      margin: '0 auto 36px'
    }
  }, "Tell us a little about your business. We'll get back to you within one working day to set up a free scoping call."), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(0,194,168,0.1)',
      border: '1px solid rgba(0,194,168,0.35)',
      borderRadius: 10,
      padding: 28,
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 999,
      background: 'rgba(0,194,168,0.2)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 10.5l4 4 8-9",
    stroke: "#00C2A8",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "Got it \u2014 thanks."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.65)'
    }
  }, "We'll be in touch within one working day.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: form.name,
    onChange: update('name'),
    placeholder: "Your name",
    required: true,
    style: inpDark
  }), /*#__PURE__*/React.createElement("input", {
    value: form.business,
    onChange: update('business'),
    placeholder: "Your business",
    style: inpDark
  })), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: form.email,
    onChange: update('email'),
    placeholder: "Email address",
    required: true,
    style: inpDark
  }), /*#__PURE__*/React.createElement("textarea", {
    value: form.message,
    onChange: update('message'),
    placeholder: "What are you trying to improve?",
    rows: 4,
    style: {
      ...inpDark,
      resize: 'vertical',
      fontFamily: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      background: '#00C2A8',
      color: '#0A1628',
      border: 'none',
      borderRadius: 6,
      padding: '14px 20px',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,194,168,0.28)',
      marginTop: 6,
      fontFamily: 'inherit'
    }
  }, "Send message"))));
}
const inpDark = {
  padding: '12px 16px',
  borderRadius: 6,
  border: '1.5px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box'
};
Object.assign(__ds_scope, { CTASection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/CTASection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/FAQ.jsx
try { (() => {
/* global React */

const {
  useState
} = React;
const faqs = [{
  q: "How long does a typical build take?",
  a: "Most systems go live in 3–8 weeks. We prioritise the one or two workflows that will save you the most time first, then iterate."
}, {
  q: "How is this different from a generic SaaS tool?",
  a: "Generic tools force your team to adapt to the software. We do the opposite — we shape the software around how your team already works best."
}, {
  q: "What does it cost?",
  a: "A modest one-off setup fee plus a fixed monthly subscription. No per-seat gotchas, no long contracts. We quote it clearly after a free scoping call."
}, {
  q: "Do you host and maintain the software?",
  a: "Yes. Everything runs on enterprise-grade infrastructure. You get the tool; we keep it running, secure, and improving."
}, {
  q: "What if our needs change?",
  a: "They will. That's the point of working with us. Iterations and improvements are included — your system grows as your business does."
}];
function FAQ() {
  const [open, setOpen] = useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "faq",
    style: {
      background: '#F4F6FA',
      padding: '96px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.5vw, 38px)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      margin: '14px 0 0',
      color: '#181214'
    }
  }, "Common questions.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, faqs.map((f, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: '#fff',
        border: '1px solid #E8ECF0',
        borderRadius: 10,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 600,
        color: '#181214',
        fontFamily: 'inherit'
      }
    }, f.q, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 20 20",
      fill: "none",
      style: {
        transition: 'transform 200ms',
        transform: isOpen ? 'rotate(180deg)' : 'none',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 7.5l5 5 5-5",
      stroke: "#6C757D",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))), isOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 24px 22px',
        fontSize: 15,
        color: '#6C757D',
        lineHeight: 1.7
      }
    }, f.a));
  }))));
}
Object.assign(__ds_scope, { FAQ });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/FAQ.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/OurProcess.jsx
try { (() => {
/* global React */

const steps = [{
  n: '01',
  t: 'Listen',
  b: "We spend time understanding how your business actually operates today — the tools, the workarounds, the friction."
}, {
  n: '02',
  t: 'Design',
  b: "We design a solution that delivers the biggest operational benefit first. No scope-creep. No feature-bloat."
}, {
  n: '03',
  t: 'Build & iterate',
  b: "We ship in weeks, not months. Then we refine it alongside you as you use it in the real world."
}];
function OurProcess() {
  return /*#__PURE__*/React.createElement("section", {
    id: "process",
    style: {
      background: '#F4F6FA',
      padding: '96px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, "The process"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.5vw, 38px)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      margin: '14px 0 12px',
      color: '#181214'
    }
  }, "Three steps. Weeks, not months.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 24,
      left: '16%',
      right: '16%',
      height: 1,
      background: 'linear-gradient(90deg, transparent, #E8ECF0 15%, #E8ECF0 85%, transparent)'
    }
  }), steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative',
      background: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 999,
      background: '#fff',
      border: '1.5px solid rgba(0,194,168,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 15,
      color: '#00C2A8',
      letterSpacing: '-0.02em',
      boxShadow: '0 2px 12px rgba(0,194,168,0.07)',
      marginBottom: 20
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      margin: '0 0 10px',
      color: '#181214'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: '#6C757D',
      margin: 0
    }
  }, s.b))))));
}
Object.assign(__ds_scope, { OurProcess });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/OurProcess.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/Pricing.jsx
try { (() => {
/* global React */

function Pricing() {
  const features = ["Discovery and scoping at no cost", "Modest one-off setup fee", "One predictable monthly subscription", "Iterations and improvements included", "Cancel any time", "Enterprise-grade infrastructure"];
  return /*#__PURE__*/React.createElement("section", {
    id: "pricing",
    style: {
      background: '#fff',
      padding: '96px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.5vw, 38px)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      margin: '14px 0 12px',
      color: '#181214'
    }
  }, "Bespoke software. Subscription pricing."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.65,
      color: '#6C757D',
      maxWidth: 540,
      margin: '0 auto'
    }
  }, "No large upfront cost. No custom-build contract. A low setup fee and a monthly fee \u2014 that's it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '0 auto',
      position: 'relative',
      borderRadius: 10,
      border: '1.5px solid rgba(0,194,168,0.35)',
      background: '#fff',
      boxShadow: '0 8px 32px rgba(0,194,168,0.12), 0 0 0 1px rgba(0,194,168,0.12)',
      padding: '36px 40px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -40,
      right: -40,
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,194,168,0.18), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -60,
      left: -60,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(10,22,40,0.06), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#00C2A8',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 14
    }
  }, "Simple, honest pricing"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 44,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      color: '#181214'
    }
  }, "Custom"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: '#6C757D'
    }
  }, "per business")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: '#6C757D',
      margin: '6px 0 24px',
      lineHeight: 1.6
    }
  }, "We scope your system in a free discovery call and quote one clear setup fee plus a fixed monthly subscription."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 14,
      color: '#181214'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 999,
      background: 'rgba(0,194,168,0.12)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 10 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.5 5l2.5 2.5 4.5-5",
    stroke: "#00C2A8",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), f))), /*#__PURE__*/React.createElement("button", {
    style: {
      width: '100%',
      background: '#00C2A8',
      color: '#0A1628',
      border: 'none',
      borderRadius: 6,
      padding: '14px 20px',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,194,168,0.28)',
      fontFamily: 'inherit'
    }
  }, "Start the conversation")))));
}
Object.assign(__ds_scope, { Pricing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/Pricing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/TopNav.jsx
try { (() => {
/* global React */
const {
  useState,
  useEffect
} = React;
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 68);
    window.addEventListener('scroll', on);
    return () => window.removeEventListener('scroll', on);
  }, []);
  const links = ['Services', 'Resources', 'Process', 'Pricing', 'FAQ'];

  // Pill nav (over hero, transparent)
  if (!scrolled) {
    return /*#__PURE__*/React.createElement("nav", {
      style: {
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(48,57,100,0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 999,
        padding: '8px 10px 8px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        zIndex: 50,
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: '#fff',
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: '-0.02em',
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/smallteam-robologo.png",
      alt: "",
      style: {
        height: 24,
        width: 'auto'
      }
    }), /*#__PURE__*/React.createElement("span", null, "smallteam", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#00C2A8',
        fontWeight: 800
      }
    }, ".ai"))), links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: `#${l.toLowerCase()}`,
      style: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textDecoration: 'none',
        fontWeight: 500
      }
    }, l)), /*#__PURE__*/React.createElement("button", {
      style: {
        background: '#00C2A8',
        color: '#0A1628',
        border: 'none',
        borderRadius: 999,
        padding: '8px 18px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,194,168,0.28)',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap'
      }
    }, "Get in touch"));
  }

  // Fixed white nav (after scroll)
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      zIndex: 50,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid #E8ECF0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: '#181214',
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: '-0.02em',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/smallteam-robologo.png",
    alt: "",
    style: {
      height: 28,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, "smallteam", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#00C2A8',
      fontWeight: 800
    }
  }, ".ai"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: `#${l.toLowerCase()}`,
    style: {
      color: '#6C757D',
      fontSize: 14,
      textDecoration: 'none',
      fontWeight: 500,
      padding: '6px 12px',
      borderRadius: 6
    }
  }, l)), /*#__PURE__*/React.createElement("button", {
    style: {
      background: '#00C2A8',
      color: '#0A1628',
      border: 'none',
      borderRadius: 999,
      padding: '9px 20px',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,194,168,0.28)',
      marginLeft: 8,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    }
  }, "Get in touch")));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing_site/WhatWeBuild.jsx
try { (() => {
/* global React */

const services = [{
  tag: 'Service businesses',
  title: 'Operations management',
  body: 'Jobs, staff scheduling, and invoicing in a single system. Replace three tools with one built for your workflow.'
}, {
  tag: 'Founders',
  title: 'Custom CRM',
  body: 'A CRM that matches your actual sales process — not a generic pipeline you have to bend your team around.'
}, {
  tag: 'Everyone',
  title: 'Automations & integrations',
  body: 'Connect the tools you already use. Save hours per week on admin, follow-ups, reporting, and hand-offs.'
}, {
  tag: 'Client-facing teams',
  title: 'Client portals',
  body: 'A branded space for clients to track progress, review documents, pay invoices, and book follow-ups.'
}, {
  tag: 'Growing teams',
  title: 'Team dashboards',
  body: 'Live dashboards showing the numbers that matter — built from your own data, not a generic template.'
}, {
  tag: 'Ops leads',
  title: 'Internal tools',
  body: 'Small tools that replace spreadsheet workarounds. Built in days, used for years.'
}];
function WhatWeBuild() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      background: '#fff',
      padding: '96px 24px',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1160,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionLabel, null, "What we build"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(26px, 3.5vw, 38px)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      margin: '14px 0 12px',
      color: '#181214'
    }
  }, "Software that fits your business."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.65,
      color: '#6C757D',
      maxWidth: 500,
      margin: '0 auto'
    }
  }, "Every system is different because every business is different. These are the shapes we build most often.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, services.map((s, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    style: {
      background: '#fff',
      border: '1.5px solid #E8ECF0',
      borderRadius: 10,
      padding: 24,
      transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'rgba(0,194,168,0.35)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,194,168,0.07)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = '#E8ECF0';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 80,
      background: '#F4F6FA',
      borderRadius: 6,
      marginBottom: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "140",
    height: "50",
    viewBox: "0 0 140 50",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "14",
    width: "40",
    height: "28",
    rx: "3",
    stroke: "#00C2A8",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "54",
    y: "14",
    width: "40",
    height: "28",
    rx: "3",
    stroke: "#0A1628",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "100",
    y: "14",
    width: "32",
    height: "28",
    rx: "3",
    stroke: "#6C757D",
    strokeWidth: "1.6",
    strokeDasharray: "3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M48 28h6M94 28h6",
    stroke: "#00C2A8",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#00C2A8',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, s.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      margin: '0 0 8px',
      letterSpacing: '-0.01em',
      color: '#181214'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#6C757D',
      margin: '0 0 14px'
    }
  }, s.body), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
      fontWeight: 600,
      color: '#00C2A8'
    }
  }, "Learn more", /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h8M8 4l3 3-3 3",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))))))));
}
Object.assign(__ds_scope, { WhatWeBuild });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing_site/WhatWeBuild.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CTASection = __ds_scope.CTASection;

__ds_ns.FAQ = __ds_scope.FAQ;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.OurProcess = __ds_scope.OurProcess;

__ds_ns.Pricing = __ds_scope.Pricing;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.TopNav = __ds_scope.TopNav;

__ds_ns.WhatWeBuild = __ds_scope.WhatWeBuild;

})();
