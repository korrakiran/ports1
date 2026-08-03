'use client';

import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, ExternalLink, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function AuditReportModal({ isOpen, onClose, productName, hsCode, currency, exchangeRate }) {
  if (!isOpen) return null;

  const data = [
    { country: 'Germany', demand: 94, tariff: 2.1, volume: 128 },
    { country: 'USA', demand: 89, tariff: 3.4, volume: 312 },
    { country: 'Japan', demand: 85, tariff: 1.8, volume: 85 },
    { country: 'Singapore', demand: 82, tariff: 0.0, volume: 42 },
    { country: 'UAE', demand: 98, tariff: 0.0, volume: 38 }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#070b14',
          color: '#ffffff'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#0066FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verified Market Feasibility Audit
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {productName} (HS Code: {hsCode})
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Executive Summary Banner */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0066FF' }}>Audit Grade: A+ (High Profitability)</div>
              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                Total Target Addressable Import Market: <strong>$606.9M USD</strong> across top 5 corridors.
              </div>
            </div>
            <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
              <ShieldCheck size={14} /> Customs Certified
            </span>
          </div>

          {/* Trade Volume Comparison Chart */}
          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} color="#0066FF" /> Target Corridors Annual Import Volume (USD Millions)
            </h4>
            <div style={{ width: '100%', height: '180px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="country" fontSize={12} stroke="#64748b" />
                  <YAxis fontSize={12} stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#0066FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Feasibility Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Avg Estimated Margin</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>34.5%</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>FOB vs Retail spread</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Fastest Transit Time</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0066FF', marginTop: '4px' }}>5 Days (UAE)</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Direct maritime route</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>CE / RoHS Compliance</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>Standard EU</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>Pre-cleared template</div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Document ID: <strong>AUDIT-2026-{hsCode}</strong>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
            <button 
              onClick={() => {
                alert('Downloading official PortsAI Feasibility & Customs Report (PDF)...');
                onClose();
              }} 
              className="btn btn-primary"
            >
              <Download size={15} /> Download PDF Audit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomsDocModal({ isOpen, onClose, trx, docType }) {
  if (!isOpen || !trx) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#070b14',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#0066FF" />
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
              {docType || 'Official Bill of Lading (B/L)'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <div>Shipper: <strong>Vance Agro & Tech MSME</strong></div>
            <div>Consignee: <strong>{trx.partner}</strong></div>
            <div>Carrier Vessel: <strong>{trx.carrier}</strong></div>
            <div>Commodity: <strong>{trx.product} (HS: {trx.hsCode})</strong></div>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Digital Seal & Blockchain Hash</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b', wordBreak: 'break-all' }}>
              SHA256: 8f9b1c7849e348e02d2459bcf78e24ab0e8d91c780234e8912ba0c67ef910a34
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '12px', marginTop: '8px' }}>
              <CheckCircle2 size={15} /> Customs Escrow Verified & Validated
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
          <button onClick={() => { alert(`Downloading ${docType || 'Bill of Lading'}...`); onClose(); }} className="btn btn-primary">
            <Download size={14} /> Download Document
          </button>
        </div>
      </div>
    </div>
  );
}
