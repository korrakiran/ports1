'use client';

import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ExpressInterestModal({ opportunity, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [quotePrice, setQuotePrice] = useState(opportunity?.targetPrice || '$18.50 / kg');
  const [quantity, setQuantity] = useState(opportunity?.volumeRequired || '45 Metric Tons');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!opportunity) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-blue">Express Interest</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Direct RFQ Submission</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Trade Proposal Submitted!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Direct message initiated with <strong>{opportunity.importerName}</strong>. An escrow agreement draft has been generated in your Order Manager.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{opportunity.title}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Importer: <strong>{opportunity.importerName} ({opportunity.destination} {opportunity.flag})</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Your FOB Quote Price
                </label>
                <input 
                  type="text" 
                  value={quotePrice} 
                  onChange={(e) => setQuotePrice(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Supply Capability
                </label>
                <input 
                  type="text" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Optional Proposal / Note to Buyer
              </label>
              <textarea 
                rows={3} 
                placeholder="Attach certifications (SGS, ISO), lead times, or custom packaging terms..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Send size={14} /> Send Official Proposal
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export function SlideInChat({ profile, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'them', text: `Hello! We are currently looking for verified suppliers for ${profile?.name}. What is your standard shipping lead time?`, time: '10:14 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { sender: 'me', text: inputMsg, time: 'Just now' }]);
    setInputMsg('');
  };

  if (!profile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '380px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--bg-dark-header)',
        color: '#ffffff',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{profile.flag}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{profile.name}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{profile.contactPerson} • {profile.country}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8fafc' }}>
        {messages.map((m, i) => (
          <div 
            key={i} 
            style={{
              alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: m.sender === 'me' ? 'var(--accent-blue)' : '#ffffff',
              color: m.sender === 'me' ? '#ffffff' : 'var(--text-main)',
              padding: '10px 14px',
              borderRadius: '12px',
              border: m.sender === 'me' ? 'none' : '1px solid var(--border-color)',
              fontSize: '13px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>{m.text}</div>
            <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{m.time}</div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="Write a message..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          style={{ flex: 1, height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '38px', height: '38px', padding: 0 }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
