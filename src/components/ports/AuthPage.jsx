'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthPage({ onAuthSuccess, onBackToLanding }) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess();
  };

  return (
    <div className="auth-container">
      
      {/* ========================================================================= */}
      {/* Left Dark Navy Branding Sidebar (Matching Screen 2 in img.webp) */}
      {/* ========================================================================= */}
      <div className="auth-left">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onBackToLanding}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.04em' }}>
            Ports<span style={{ color: '#0066FF' }}>AI</span>
          </span>
        </div>

        {/* Center Content & 3D Cargo Globe Illustration */}
        <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
            {isLoginMode ? 'Welcome back' : 'Create your account'}
          </h1>
          
          <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '380px', lineHeight: 1.5 }}>
            {isLoginMode 
              ? 'Access your cross-border trade pipeline and market radar.' 
              : 'Join thousands of importers and exporters using PortsAI.'}
          </p>

          {/* 3D Earth Globe & Shipping Containers Illustration */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            height: '280px',
            margin: '20px 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="320" height="260" viewBox="0 0 320 260" fill="none">
              <defs>
                {/* Glow & radial gradients */}
                <radialGradient id="globeSphere" cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="60%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0066FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#070b14" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glowing Pedestal Base */}
              <ellipse cx="160" cy="225" rx="120" ry="24" fill="url(#pedestalGlow)" />
              <ellipse cx="160" cy="225" rx="85" ry="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

              {/* 3D Blue Earth Globe Sphere */}
              <circle cx="115" cy="120" r="68" fill="url(#globeSphere)" />
              {/* Globe Continent Overlays */}
              <path d="M75,100 Q95,85 125,95 T145,130 T115,160 T80,140 Z" fill="#60a5fa" opacity="0.6" />
              <path d="M120,135 Q140,130 155,150 T135,175 T110,160 Z" fill="#60a5fa" opacity="0.6" />
              <circle cx="115" cy="120" r="68" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Orbital Flight Path Trail */}
              <path d="M50,165 Q115,70 190,105 T160,195" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              {/* Airplane on orbit */}
              <polygon points="192,102 204,107 197,112" fill="#ffffff" />

              {/* 3D Isometric Shipping Containers */}
              {/* Container 1 (Blue) */}
              <g transform="translate(160, 140)">
                {/* Top face */}
                <polygon points="25,0 55,-12 85,0 55,12" fill="#3b82f6" />
                {/* Left face */}
                <polygon points="25,0 55,12 55,42 25,30" fill="#1d4ed8" />
                {/* Right face */}
                <polygon points="55,12 85,0 85,30 55,42" fill="#2563eb" />
              </g>

              {/* Container 2 (Orange/Red) */}
              <g transform="translate(195, 155)">
                {/* Top face */}
                <polygon points="25,0 55,-12 85,0 55,12" fill="#f97316" />
                {/* Left face */}
                <polygon points="25,0 55,12 55,42 25,30" fill="#c2410c" />
                {/* Right face */}
                <polygon points="55,12 85,0 85,30 55,42" fill="#ea580c" />
              </g>

              {/* Cargo Ship Base */}
              <g transform="translate(140, 200)">
                <polygon points="10,5 90,5 110,-5 25,-5" fill="#334155" />
                <polygon points="10,5 90,5 80,18 20,18" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
          <span>&copy; 2026 PortsAI Global Inc.</span>
          <span onClick={onBackToLanding} style={{ color: '#0066FF', cursor: 'pointer', fontWeight: 600 }}>Back to Homepage &rarr;</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Right Form Card (Matching Screen 2 in img.webp) */}
      {/* ========================================================================= */}
      <div className="auth-right">
        <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '6px' }}>
          {isLoginMode ? 'Sign In' : 'Sign Up'}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '32px' }}>
          {isLoginMode ? 'Enter your registered email to continue' : 'Create your free account to get started'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Full Name (Sign Up only) */}
          {!isLoginMode && (
            <div>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px 0 44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px 0 44px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 44px 0 44px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {!isLoginMode && (
            <div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showConfirmPass ? 'text' : 'password'} 
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 44px 0 44px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              height: '48px',
              marginTop: '10px',
              fontSize: '15px',
              fontWeight: 700,
              borderRadius: '8px',
              width: '100%'
            }}
          >
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>

          {/* Toggle Mode */}
          <div style={{ textAlign: 'center', fontSize: '13.5px', color: '#64748b', marginTop: '12px' }}>
            {isLoginMode ? (
              <span>Don't have an account? <strong onClick={() => setIsLoginMode(false)} style={{ color: '#0066FF', cursor: 'pointer' }}>Sign Up</strong></span>
            ) : (
              <span>Already have an account? <strong onClick={() => setIsLoginMode(true)} style={{ color: '#0066FF', cursor: 'pointer' }}>Login</strong></span>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}
