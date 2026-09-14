import { useState, useRef, useEffect } from 'react';
import { dataStore } from '../lib/dataStore';

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', contact: '', need: '' });
  const [showLeadModal, setShowLeadModal] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hey there! 👋 Welcome to BrandedCoders. We engineer custom websites, scalable web apps, and high-ROI digital marketing — all under one roof.',
      time: 'Just now',
    },
    {
      id: 2,
      sender: 'bot',
      text: 'What are you looking to build or scale today? Tap an option below or type your vision directly:',
      time: 'Just now',
      quickReplies: [
        '🌐 Build a Website / Web App',
        '📈 SEO & Google Ads PPC',
        '💰 Estimate Budget & Timeline',
        '📞 Book Free Scoping Call',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const botResponses = {
    web: {
      text: "We build ultra-fast websites & full-stack web platforms using Next.js, React, Node.js, and MongoDB. Average delivery is 2-4 weeks with guaranteed 90+ Google PageSpeed and sub-second load times. Would you like an instant quote estimate or to see our recent case studies?",
      quickReplies: ['💰 Estimate Website Cost', '📂 View Client Work', '📞 Book a Scoping Call'],
    },
    marketing: {
      text: "Our growth team specializes in Technical SEO, Google Search PPC, and conversion rate optimization (CRO). Our clients achieve an average 4.2x ROAS and +320% inbound lead surge within 90 days. What is your current business domain or monthly growth goal?",
      quickReplies: ['🔍 Run Free SEO Audit', '📈 Google Ads Strategy', '📞 Talk to Growth Head'],
    },
    pricing: {
      text: "We operate on transparent, fixed-scope proposals so there are never surprises:\n• High-Converting Marketing Sites: ₹45,000 – ₹1,20,000 (2-3 weeks)\n• Custom Web Apps & Dashboards: ₹1,50,000+ (4-6 weeks)\n• Growth SEO & PPC Management: ₹24,999/mo (Guaranteed ROAS)\n\nWould you like a custom breakdown for your exact project?",
      quickReplies: ['📋 Share My Project Scope', '💬 WhatsApp Founder', '📞 Request Call'],
    },
    call: {
      text: "We'd love to schedule a free 45-minute technical & growth consultation! Please drop your name and phone number or WhatsApp below, and our principal engineer Sushant will reach out within 2 hours.",
      showForm: true,
    },
  };

  function handleSend(textToSend) {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Trigger typing state
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      let replyObj = null;

      if (lower.includes('web') || lower.includes('site') || lower.includes('app') || lower.includes('build')) {
        replyObj = botResponses.web;
      } else if (lower.includes('seo') || lower.includes('market') || lower.includes('ad') || lower.includes('ppc') || lower.includes('growth')) {
        replyObj = botResponses.marketing;
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('budget') || lower.includes('estimate') || lower.includes('rate')) {
        replyObj = botResponses.pricing;
      } else if (lower.includes('call') || lower.includes('talk') || lower.includes('meet') || lower.includes('book') || lower.includes('consult')) {
        replyObj = botResponses.call;
      } else {
        replyObj = {
          text: `Thanks for sharing! "${text}". Our engineering & growth directors review every inquiry. Would you like to schedule a quick 1-on-1 scoping call or chat directly on WhatsApp?`,
          quickReplies: ['📞 Request Scoping Call', '💬 WhatsApp Directly', '💰 Pricing Info'],
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyObj.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: replyObj.quickReplies,
          showForm: replyObj.showForm,
        },
      ]);
    }, 750);
  }

  function handleLeadSubmit(e) {
    e.preventDefault();
    if (!leadForm.name || !leadForm.contact) return;

    // Save to dataStore
    try {
      dataStore.addLead({
        name: leadForm.name,
        email: leadForm.contact.includes('@') ? leadForm.contact : '',
        phone: !leadForm.contact.includes('@') ? leadForm.contact : '',
        service: leadForm.need || 'Full-Stack Web & Marketing',
        budget: '₹50,000 - ₹1,50,000',
        status: 'New',
        notes: `Chatbot inquiry: ${leadForm.need || 'General consultation request'}`,
      });

      dataStore.addMessage({
        name: leadForm.name,
        email: leadForm.contact,
        subject: 'Chatbot Consultation Request',
        message: `Chat Lead: ${leadForm.name} requested consultation for: ${leadForm.need || 'Website / Marketing'}. Contact: ${leadForm.contact}`,
      });
    } catch (err) {
      console.error('Failed to record chatbot lead', err);
    }

    setLeadCaptured(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: `Awesome, ${leadForm.name}! 🎉 Your consultation request has been dispatched directly to Sushant (Principal Architect) and Kanika (Head of Growth). We will reach out at ${leadForm.contact} within 2 business hours!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['💬 Open WhatsApp Now', '🌐 Explore Portfolio'],
      },
    ]);
  }

  const whatsappUrl = 'https://wa.me/919876543210?text=' + encodeURIComponent('Hi BrandedCoders! I was using the website chat and would like to discuss my project (Web Dev / Digital Marketing).');

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'var(--font-body)' }}>
      {/* 1. COLLAPSED FLOATING CARD (Exact ChatSEO Style from user screenshot) */}
      {!isOpen && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 36px -4px rgba(15, 23, 42, 0.16), 0 2px 10px rgba(15, 23, 42, 0.06)',
            width: '320px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'slideUpFade 0.4s ease-out',
          }}
        >
          {/* Top row: Chat with real humans 💙 + Avatars */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
              Chat with real humans 💙
            </span>
            {/* Stacked Avatars */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Sushant"
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80"
                alt="Kanika"
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                alt="Support Engineer"
                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF', marginLeft: '-6px' }}
              />
            </div>
          </div>

          {/* Subtitle: Support is available ⚡ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: 12 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Support is available ⚡</span>
          </div>

          {/* Button: Customer Support */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              width: '100%',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.32)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1D4ED8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Customer Support</span>
          </button>
        </div>
      )}

      {/* 2. EXPANDED INTERACTIVE CHATBOT WINDOW */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? '60px' : '560px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.25s ease',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '14px 18px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="BrandedCoders Support"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid #0F172A',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>BrandedCoders Assistant</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Web Dev &amp; Marketing · Online
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* WhatsApp Quick Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                style={{
                  background: '#22C55E',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                💬
              </a>
              {/* Minimize */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1rem', cursor: 'pointer', padding: '2px 6px' }}
              >
                {isMinimized ? '□' : '—'}
              </button>
              {/* Close */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.1rem', cursor: 'pointer', padding: '2px 6px' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          {!isMinimized && (
            <>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: '#F8FAFC',
                }}
              >
                {/* Security & Response Guarantee Banner */}
                <div style={{ textAlign: 'center', margin: '4px 0 8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', background: '#EDF2F7', padding: '4px 10px', borderRadius: 999, fontWeight: 600 }}>
                    🔒 Direct connection with engineering &amp; growth leads
                  </span>
                </div>

                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    <div
                      style={{
                        background: m.sender === 'user' ? '#2563EB' : '#FFFFFF',
                        color: m.sender === 'user' ? '#FFFFFF' : '#0F172A',
                        padding: '10px 14px',
                        borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        fontSize: '0.84rem',
                        lineHeight: 1.5,
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.05)',
                        border: m.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.text}
                    </div>

                    {/* Quick Reply Pills */}
                    {m.quickReplies && m.quickReplies.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {m.quickReplies.map((qr) => (
                          <button
                            key={qr}
                            type="button"
                            onClick={() => {
                              if (qr.includes('WhatsApp')) {
                                window.open(whatsappUrl, '_blank');
                              } else {
                                handleSend(qr);
                              }
                            }}
                            style={{
                              background: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              color: '#1D4ED8',
                              padding: '5px 10px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Embedded Lead Capture Form if prompt triggered */}
                    {m.showForm && !leadCaptured && (
                      <form
                        onSubmit={handleLeadSubmit}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '12px',
                          padding: '12px',
                          marginTop: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#1E40AF' }}>
                          ⚡ Quick Callback Scoping Form
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your Name (e.g. Rahul Verma)"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                          style={{
                            padding: '8px 10px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            outline: 'none',
                          }}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Phone / WhatsApp or Email"
                          value={leadForm.contact}
                          onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })}
                          style={{
                            padding: '8px 10px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            outline: 'none',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Project need (e.g. Next.js App / SEO)"
                          value={leadForm.need}
                          onChange={(e) => setLeadForm({ ...leadForm, need: e.target.value })}
                          style={{
                            padding: '8px 10px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Request Free 45-Min Call &rarr;
                        </button>
                      </form>
                    )}

                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 3, display: 'block', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                      {m.time}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px', alignSelf: 'flex-start', border: '1px solid #E2E8F0', width: 'fit-content' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', animation: 'pulse 1s infinite' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8', animation: 'pulse 1s infinite 0.2s' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#93C5FD', animation: 'pulse 1s infinite 0.4s' }} />
                    <span style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: 4 }}>Assistant is typing…</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#FFFFFF',
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  placeholder="Ask about website, apps, or marketing…"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '999px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.84rem',
                    outline: 'none',
                    background: '#F8FAFC',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  aria-label="Send message"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
