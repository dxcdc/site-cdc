import React, { useState } from 'react';

export const DiagnosticButton: React.FC = () => {
  const [info, setInfo] = useState<string>('');

  const handleClick = async () => {
    try {
      const res = await fetch('/api/diagnostic');
      const data = await res.json();
      console.log('🛠️ Diagnostic data:', data);
      setInfo(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Diagnostic error', err);
      setInfo('Error fetching diagnostic data');
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <button onClick={handleClick} style={{ padding: '0.5rem 1rem', background: '#0066ff', color: '#fff', border: 'none', borderRadius: '4px' }}>
        📊 Diagnóstico da Sessão
      </button>
      {info && (
        <pre style={{ background: '#f5f5f5', padding: '0.5rem', marginTop: '0.5rem', overflowX: 'auto' }}>{info}</pre>
      )}
    </div>
  );
};
