import { useEffect } from 'react';
import brand from '../brand/brand.json'

const { identity, creators } = brand

const VAR = {
  dark: 'var(--bg)', cream: 'var(--fg)', copper: 'var(--copper)', muted: '#A8A096',
  faint: 'rgba(var(--fg-rgb),0.35)', cardBg: 'rgba(255,255,255,0.03)',
  border: 'rgba(var(--copper-rgb),0.2)', borderStrong: 'rgba(var(--copper-rgb),0.5)',
};

const S = {
  page: { maxWidth: '1600px', margin: '0 auto', padding: '60px clamp(20px, 4vw, 48px) 120px' },
  hero: { textAlign: 'center', padding: '80px 0 60px', borderBottom: `1px solid ${VAR.copper}`, marginBottom: '80px' },
  eyebrow: { fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: VAR.copper, marginBottom: '24px', display: 'block' },
  h1: { fontFamily: "var(--font-condensed)", fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: '400', color: VAR.cream, letterSpacing: '0.05em', marginBottom: '20px', lineHeight: 1.15 },
  tagline: { fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1.25rem', color: VAR.faint, marginBottom: 0 },
  section: { marginBottom: '80px' },
  label: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: VAR.copper, display: 'block', marginBottom: '12px' },
  h2: { fontFamily: "var(--font-condensed)", fontSize: '1.8rem', fontWeight: '400', color: VAR.cream, marginBottom: '24px' },
  h3: { fontFamily: "var(--font-condensed)", fontSize: '1rem', color: VAR.cream, marginBottom: '10px', fontWeight: '400' },
  body: { fontSize: '0.95rem', color: VAR.muted, lineHeight: '1.85', marginBottom: '16px' },
  bodyLight: { fontSize: '0.95rem', color: VAR.faint, lineHeight: '1.85', marginBottom: '16px' },
  card: { background: VAR.cardBg, border: `1px solid ${VAR.border}`, padding: '28px', borderRadius: '2px', marginBottom: '16px' },
  cardHighlight: { background: 'rgba(var(--copper-rgb),0.06)', border: `1px solid ${VAR.borderStrong}`, padding: '28px', borderRadius: '2px', marginBottom: '16px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' },
  hr: { border: 'none', borderTop: `1px solid rgba(var(--copper-rgb),0.25)`, margin: '60px 0' },
  platformTag: { display: 'inline-block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: VAR.copper, border: `1px solid ${VAR.border}`, padding: '3px 10px', borderRadius: '2px', marginBottom: '12px' },
  bullet: { fontSize: '0.9rem', color: VAR.muted, lineHeight: '2', paddingLeft: '16px', position: 'relative' },
  step: { display: 'flex', gap: '20px', marginBottom: '24px', alignItems: 'flex-start' },
  stepNum: { fontFamily: "var(--font-condensed)", fontSize: '1.2rem', color: VAR.copper, minWidth: '32px', paddingTop: '2px' },
  notTag: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#6B3B3B', border: '1px solid rgba(107,59,59,0.4)', padding: '3px 10px', borderRadius: '2px', display: 'inline-block', marginBottom: '12px' },
  ctaBox: { background: 'rgba(var(--copper-rgb),0.08)', border: `1px solid ${VAR.copper}`, padding: '48px 40px', borderRadius: '2px', textAlign: 'center', marginTop: '60px' },
  ctaH2: { fontFamily: "var(--font-condensed)", fontSize: '2rem', fontWeight: '400', color: VAR.cream, marginBottom: '16px' },
  ctaBody: { fontSize: '1rem', color: VAR.muted, lineHeight: '1.8', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px' },
  emailBlock: { background: 'rgba(0,0,0,0.3)', padding: '20px 28px', borderRadius: '2px', display: 'inline-block', marginBottom: '20px', textAlign: 'left' },
  emailLabel: { fontSize: '10px', letterSpacing: '2px', color: VAR.copper, display: 'block', marginBottom: '6px', textTransform: 'uppercase' },
  emailVal: { fontFamily: 'monospace', fontSize: '1rem', color: VAR.cream },
  subjectFormat: { fontFamily: 'monospace', fontSize: '0.85rem', color: VAR.copper, background: 'rgba(var(--copper-rgb),0.1)', padding: '10px 16px', borderRadius: '2px', display: 'inline-block', marginTop: '8px' },
  faqItem: { borderBottom: `1px solid ${VAR.border}`, padding: '20px 0' },
  faqQ: { fontFamily: "var(--font-condensed)", fontSize: '0.95rem', color: VAR.cream, marginBottom: '8px' },
  faqA: { fontSize: '0.9rem', color: VAR.muted, lineHeight: '1.7' },
  productCard: { background: VAR.cardBg, border: `1px solid ${VAR.border}`, padding: '28px 24px', borderRadius: '2px', textAlign: 'center' },
  productName: { fontFamily: "var(--font-condensed)", fontSize: '1.1rem', color: VAR.cream, marginBottom: '12px' },
  productLine: { fontFamily: "'IM Fell English', Georgia, serif", fontStyle: 'italic', fontSize: '1rem', color: VAR.faint },
};


export default function Creators() {
  useEffect(() => { document.title = `Work With Us — ${identity.name}`; }, []);

  return (
    <div style={S.page}>

      {/* HERO */}
      <div style={S.hero}>
        <span style={S.eyebrow}>For Creators & Collaborators</span>
        <h1 style={S.h1}>We're not looking<br />for promoters.</h1>
        <p style={S.tagline}>We're looking for people who already live inside this aesthetic.</p>
      </div>

      {/* THE SPACE */}
      <section style={S.section}>
        <span style={S.label}>The Brand</span>
        <h2 style={S.h2}>What {identity.name} Is</h2>
        <p style={S.body}>{identity.name} makes objects that change how a room feels. A skull lamp that projects its shadow onto your wall. Resin skull sculptures that belong there year-round. Candle sets built for ritual, not decoration.</p>
        <p style={S.body}>These are objects that change the temperature of a room. Not figuratively.</p>
        <p style={S.body}>We're not seasonal. We're not Halloween. We're permanent.</p>
        <p style={S.body}>If your space — or the spaces you create content in — already speaks this language, we should talk.</p>
      </section>

      <hr style={S.hr} />

      {/* WHO WE'RE TALKING TO */}
      <section style={S.section}>
        <span style={S.label}>Who We're Talking To</span>
        <h2 style={S.h2}>We don't filter by follower count.<br />We filter by fit.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={S.card}>
            <span style={S.platformTag}>TikTok</span>
            <p style={S.body}>We're looking for creators who share dark home aesthetics, room transformations, day-in-my-life content, or product finds that fit a specific world. If your FYP is also your aesthetic mood board, we probably belong there.</p>
          </div>
          <div style={S.card}>
            <span style={S.platformTag}>Instagram</span>
            <p style={S.body}>Interior mood, curated spaces, dark academia, alt-home decor. If your grid or Reels feel lived-in and deliberate — not staged for an audience — this is for you.</p>
          </div>
          <div style={S.card}>
            <span style={S.platformTag}>YouTube</span>
            <p style={S.body}>Home tours, aesthetic vlogs, "how I decorated my apartment" content. Long-form lifestyle creators who bring their audience into their actual space.</p>
          </div>
        </div>

        <div style={{ ...S.card, marginTop: '8px' }}>
          <span style={S.notTag}>What we're NOT looking for</span>
          <p style={{ ...S.body, marginBottom: 0 }}>Paid promotional slots, scripted reviews, or "I'm working with Brand X" announcements. We want the product in your world — not a commercial in the middle of it.</p>
        </div>
      </section>

      <hr style={S.hr} />

      {/* WHAT WE OFFER */}
      <section style={S.section}>
        <span style={S.label}>The Partnership</span>
        <h2 style={S.h2}>What We Offer</h2>

        <div style={S.grid2}>
          <div style={S.card}>
            <h3 style={S.h3}>Product, gifted.</h3>
            <p style={{ ...S.body, marginBottom: 0 }}>We send you one (or more) {identity.name} pieces — no return required, no obligation to post. We send it because we believe you'll want to.</p>
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>Creative freedom, complete.</h3>
            <p style={{ ...S.body, marginBottom: 0 }}>No scripts. No mandatory captions. No watermarks. Your voice, your framing, your aesthetic.</p>
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>Commission.</h3>
            <p style={{ ...S.body, marginBottom: 0 }}>If you're already on Amazon, we connect your storefront. If you're not — we walk you through it. Takes one afternoon and every piece of content you create keeps earning after it's posted.</p>
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>Early access.</h3>
            <p style={{ ...S.body, marginBottom: 0 }}>{identity.name} is early. The creators who come in now become the reference point for everyone who discovers the brand later. There's value in being first.</p>
          </div>
        </div>
      </section>

      <hr style={S.hr} />

      {/* CONTENT */}
      <section style={S.section}>
        <span style={S.label}>The Content</span>
        <h2 style={S.h2}>What resonates with<br />the people who buy.</h2>
        <p style={S.body}>We're not going to give you a shot list. But here's what we've seen work:</p>
        {[
          'The product in a real room — yours, not a studio.',
          'Reactions before explanations. Your audience can read the room.',
          'The object integrated, not featured.',
          'Honest responses — if your mom thinks it\'s creepy, that\'s content.',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ color: VAR.copper, fontFamily: "var(--font-condensed)", fontSize: '1rem', minWidth: '20px', paddingTop: '1px' }}>—</span>
            <p style={{ ...S.body, marginBottom: 0 }}>{item}</p>
          </div>
        ))}
      </section>

      <hr style={S.hr} />

      {/* WHAT TO EXPECT */}
      <section style={S.section}>
        <span style={S.label}>The Process</span>
        <h2 style={S.h2}>What you can expect<br />after you email us.</h2>

        {[
          { n: '01', text: 'We\'ll respond within 3–5 business days with a few questions about your content and audience.' },
          { n: '02', text: 'If it\'s a fit, we\'ll align on what to send you and how.' },
          { n: '03', text: 'Product arrives in 5–7 business days for US orders.' },
          { n: '04', text: 'No hard deadline on when to post. We\'re not running a timed campaign.' },
          { n: '05', text: 'After your content goes live, we\'ll follow up to see how it landed and discuss next steps.' },
        ].map((s) => (
          <div key={s.n} style={S.step}>
            <span style={S.stepNum}>{s.n}</span>
            <p style={{ ...S.body, marginBottom: 0 }}>{s.text}</p>
          </div>
        ))}

        <div style={{ ...S.card, marginTop: '8px', borderColor: 'rgba(var(--copper-rgb),0.4)' }}>
          <span style={S.label}>FTC Disclosure</span>
          <p style={{ ...S.body, marginBottom: 0 }}>We'll brief you on disclosure requirements before you post. Simple, clear, no friction — you stay protected and the content stays authentic.</p>
        </div>
      </section>

      <hr style={S.hr} />

      {/* PRODUCTS */}
      <section style={S.section}>
        <span style={S.label}>The Products</span>
        <h2 style={S.h2}>What you'd be working with.</h2>
        <div style={S.grid3}>
          {[
            { name: 'Skull Lamp', line: 'One touch. Skull shadow on your wall.' },
            { name: 'Wall Skull Decor', line: 'Mount once. Haunt forever.' },
            { name: 'Skull Candle Set', line: 'The ritual begins.' },
          ].map((p) => (
            <div key={p.name} style={S.productCard}>
              <p style={S.productName}>{p.name}</p>
              <p style={{ ...S.productLine, marginBottom: 0 }}>"{p.line}"</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={S.hr} />

      {/* FAQ */}
      <section style={S.section}>
        <span style={S.label}>Common Questions</span>
        <h2 style={S.h2}>FAQ</h2>
        {creators.faqs.map((f, i) => (
          <div key={i} style={S.faqItem}>
            <p style={S.faqQ}>{f.q}</p>
            <p style={{ ...S.faqA, marginBottom: 0 }}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <div style={S.ctaBox}>
        <h2 style={S.ctaH2}>If your space already speaks this language, we should be in it.</h2>
        <p style={S.ctaBody}>Send us a quick email — one paragraph about who you are and what you create. Platform, aesthetic, why {identity.name} fits your world. That's all we need.</p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={S.emailBlock}>
            <span style={S.emailLabel}>Email</span>
            <span style={S.emailVal}>info@mavra.space</span>
          </div>

          <div>
            <span style={S.emailLabel}>Subject line format</span>
            <div style={S.subjectFormat}>{identity.name} Collab — [Platform] — [Your Handle]</div>
            <p style={{ fontSize: '0.8rem', color: VAR.muted, marginTop: '8px' }}>
              Example: {identity.name} Collab — TikTok — @yourusername
            </p>
          </div>

          <p style={{ fontSize: '0.82rem', color: VAR.muted, maxWidth: '420px', textAlign: 'center', marginTop: '8px' }}>
            The subject format helps us route your message and respond faster. We won't be able to assist with Amazon order-related questions via this channel.
          </p>

          <a
            href={`mailto:info@mavra.space?subject=${identity.name}%20Collab%20%E2%80%94%20%5BPlatform%5D%20%E2%80%94%20%5BYour%20Handle%5D`}
            style={{ display: 'inline-block', marginTop: '16px', padding: '14px 36px', background: VAR.copper, color: VAR.dark, fontFamily: "var(--font-condensed)", fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
          >
            Start the conversation →
          </a>
        </div>
      </div>

    </div>
  );
}
