'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  Globe2, 
  Check, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { MOCK_OPPORTUNITIES, MOCK_MARKETS } from '../mockData';

export default function OpportunitiesView({ onExpressInterest }) {
  const [wizardStep, setWizardStep] = useState(1);
  const [productName, setProductName] = useState('Wireless Earbuds');
  const [hsCode, setHsCode] = useState('8518.30');
  const [productCategory, setProductCategory] = useState('Electronics');
  const [importPurpose, setImportPurpose] = useState('resale');
  const [selectedProcess, setSelectedProcess] = useState('direct');
  const [selectedCountries, setSelectedCountries] = useState(['de', 'us']);

  const toggleCountry = (id) => {
    if (selectedCountries.includes(id)) {
      setSelectedCountries(selectedCountries.filter(c => c !== id));
    } else {
      setSelectedCountries([...selectedCountries, id]);
    }
  };

  return (
    <div className="view-container">
      
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span>Import Opportunity</span>
        <ChevronRight size={14} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {wizardStep === 1 && 'Product Details'}
          {wizardStep === 2 && 'Process Selection'}
          {wizardStep === 3 && 'Market Selection'}
          {wizardStep === 4 && 'Results & Recommendations'}
        </span>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', overflowX: 'auto', gap: '16px' }}>
        {[
          { step: 1, title: 'Product Details' },
          { step: 2, title: 'Process' },
          { step: 3, title: 'Market Selection' },
          { step: 4, title: 'Results' }
        ].map((item) => {
          const isActive = wizardStep === item.step;
          const isDone = wizardStep > item.step;

          return (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setWizardStep(item.step)}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#0066FF' : isDone ? '#10b981' : '#e2e8f0',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {isDone ? <Check size={16} /> : item.step}
              </div>
              <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#0066FF' : '#475569' }}>
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Product Details */}
      {wizardStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Product Details</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Product Name</label>
                <input 
                  type="text" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>HS Code</label>
                <input 
                  type="text" 
                  value={hsCode} 
                  onChange={(e) => setHsCode(e.target.value)} 
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Product Category</label>
              <input 
                type="text" 
                value={productCategory} 
                onChange={(e) => setProductCategory(e.target.value)} 
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>Purpose</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="purpose" 
                    checked={importPurpose === 'resale'} 
                    onChange={() => setImportPurpose('resale')} 
                  />
                  Import for Resale
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="purpose" 
                    checked={importPurpose === 'manufacturing'} 
                    onChange={() => setImportPurpose('manufacturing')} 
                  />
                  Import for Manufacturing
                </label>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Additional Description (Optional)</label>
              <textarea 
                rows={3} 
                defaultValue="High quality wireless earbuds with noise cancellation and long battery life."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button 
                onClick={() => setWizardStep(2)}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Product Image Card like reference screenshot */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '220px', height: '220px', margin: '0 auto 16px auto', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                <img 
                  src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80" 
                  alt="Product"
                  style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{productName}</h3>
              <span className="badge badge-blue" style={{ marginTop: '4px' }}>HS: {hsCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Select Import Process */}
      {wizardStep === 2 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Select Import Process</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Choose the process that best describes your import requirement.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { id: 'direct', title: 'Direct Import', desc: 'Import directly from international verified suppliers.' },
              { id: 'indent', title: 'Indent / Procurement', desc: 'Import goods based on an indent or purchase order.' },
              { id: 'third_party', title: 'Third Party Import', desc: 'Import through a third party intermediary.' },
              { id: 'manufacturing', title: 'Import for Manufacturing', desc: 'Import raw materials or components for manufacturing.' },
              { id: 'project', title: 'Project Import', desc: 'Import goods for a specific project or contract.' }
            ].map((proc) => {
              const isSelected = selectedProcess === proc.id;
              return (
                <div 
                  key={proc.id}
                  onClick={() => setSelectedProcess(proc.id)}
                  style={{
                    padding: '18px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: isSelected ? '#0066FF' : '#e2e8f0',
                    backgroundColor: isSelected ? '#e6f0ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{proc.title}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{proc.desc}</p>
                  </div>
                  <input type="radio" checked={isSelected} readOnly />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => setWizardStep(1)} className="btn btn-secondary">Back</button>
            <button onClick={() => setWizardStep(3)} className="btn btn-primary">Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 3: Select Target Markets */}
      {wizardStep === 3 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Select Target Markets</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Choose one or more countries you want to import from.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {MOCK_MARKETS.map((m) => {
              const isSelected = selectedCountries.includes(m.id);
              return (
                <div 
                  key={m.id}
                  onClick={() => toggleCountry(m.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: isSelected ? '#0066FF' : '#e2e8f0',
                    backgroundColor: isSelected ? '#e6f0ff' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{m.flag}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{m.country}</span>
                  </div>
                  <input type="checkbox" checked={isSelected} readOnly />
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button onClick={() => setWizardStep(2)} className="btn btn-secondary">Back</button>
            <button onClick={() => setWizardStep(4)} className="btn btn-primary">View Results <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Step 4: Results & Top Opportunities Table like reference screenshot */}
      {wizardStep === 4 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
                Top Import Opportunities for {productName} (HS: {hsCode})
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Based on market demand, supplier availability, and import feasibility.
              </p>
            </div>
            <button className="btn btn-secondary">Download Report</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', marginTop: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Country</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Demand Score</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Import Value (USD)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Growth (YoY)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Supplier Availability</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Ease of Import</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MARKETS.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    <span style={{ marginRight: '8px' }}>{m.flag}</span> {m.country}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-emerald">{m.demandLevel}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{m.marketSize}</td>
                  <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>{m.yoyGrowth}</td>
                  <td style={{ padding: '14px 16px' }}>High</td>
                  <td style={{ padding: '14px 16px' }}>Easy</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onExpressInterest({ title: `Import Order: ${productName}`, destination: m.country, flag: m.flag, importerName: `${m.country} Global Trade` })}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
