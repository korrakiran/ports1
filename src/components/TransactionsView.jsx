'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  FileText, 
  Ship, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  FileCheck
} from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../mockData';

export default function TransactionsView() {
  const [selectedTrx, setSelectedTrx] = useState(MOCK_TRANSACTIONS[0]);
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  const stepsList = [
    { title: 'Contract Signing & LC Escrow', desc: 'Irrevocable Letter of Credit verified' },
    { title: 'Factory Inspection & Packing', desc: 'SGS pre-shipment quality audit' },
    { title: 'Maritime / Air Transit', desc: 'Bill of Lading issued by carrier' },
    { title: 'Customs Clearance & Import Tax', desc: 'Duty exemption under FTA verified' },
    { title: 'Final Delivery & Escrow Release', desc: '100% Payment released to MSME' }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Pipeline Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contracting Phase</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>$168,000</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>1 Active Trade</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>In Maritime Transit</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>$420,000</div>
          <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>1 Vessel Live Tracking</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Customs Release</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>$185,000</div>
          <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px' }}>Port of Hamburg 🇩🇪</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed (This Month)</div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>$95,000</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>Funds Released</div>
        </div>
      </div>

      {/* Main Grid: Order Cards List (Left) + Detailed Guided Workflow Timeline (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
        
        {/* Left: Orders List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Orders & Trade Pipeline</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_TRANSACTIONS.map((trx) => {
              const isSelected = selectedTrx.id === trx.id;
              return (
                <div 
                  key={trx.id}
                  onClick={() => setSelectedTrx(trx)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-color)',
                    backgroundColor: isSelected ? 'var(--accent-blue-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                      {trx.id}
                    </span>
                    <span className="badge badge-amber">{trx.status}</span>
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {trx.product}
                  </h3>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Partner: <strong>{trx.partner}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderTop: '1px dashed #cbd5e1', paddingTop: '8px' }}>
                    <span>Value: <strong style={{ color: 'var(--text-main)' }}>{trx.value}</strong></span>
                    <span>Docs: <strong>{trx.docsReady}/{trx.docsTotal} Verified</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Multi-step Guided Transaction Timeline */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-blue">{selectedTrx.id}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HS Code: <strong>{selectedTrx.hsCode}</strong></span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                {selectedTrx.product}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Consigned to: <strong>{selectedTrx.partner}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedTrx.value}
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '11px', marginTop: '4px' }}>
                {selectedTrx.paymentStatus}
              </span>
            </div>
          </div>

          {/* Carrier & Tracking Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', backgroundColor: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ship size={20} color="var(--accent-blue)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Carrier Vessel</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedTrx.carrier}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Arrival</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedTrx.eta}</div>
              </div>
            </div>
          </div>

          {/* Guided 5-Step Progress Timeline */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>
              Multi-Step Trade Execution Pipeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {stepsList.map((stepItem, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < selectedTrx.step;
                const isCurrent = stepNum === selectedTrx.step;

                return (
                  <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--accent-blue)' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
                    </div>

                    <div style={{ flex: 1, paddingBottom: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: isCurrent ? 'var(--accent-blue)' : 'var(--text-main)' }}>
                          {stepItem.title}
                        </h4>
                        {isCurrent && <span className="badge badge-blue">In Progress</span>}
                        {isCompleted && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Completed</span>}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {stepItem.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Required Export Compliance Documents */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Required Compliance Documents</h3>
              <button className="btn btn-ghost" style={{ fontSize: '12px', color: 'var(--accent-blue)' }}>
                <UploadCloud size={14} /> Upload Doc
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Commercial Invoice', 'Bill of Lading', 'Certificate of Origin', 'SGS Quality Cert', 'Packing List'].map((doc, i) => (
                <div 
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <FileCheck size={14} color="#10b981" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
