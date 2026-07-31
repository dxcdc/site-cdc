// src/components/atoms/DiagnosticButton.tsx
// Ferramenta de diagnóstico de imagens — RESTRITA AO AMBIENTE DE DESENVOLVIMENTO.
// Não renderiza em produção. Para habilitar em staging, defina NEXT_PUBLIC_DIAGNOSTIC=true.

'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { resolveMediaUrl } from '@/lib/media';

interface ImageDiagResult {
  url: string;
  status: number | string;
  contentType: string;
  timeMs: number;
  ok: boolean;
  error?: string;
}

const IMAGE_SAMPLES = [
  { label: 'Banner (banners/)', path: 'banners/6-_MG_8182.jpg' },
  { label: 'Notícia (noticias/)', path: 'noticias/100-IMG_0711.jpg' },
  { label: 'Parceiro (parceiros/)', path: 'parceiros/6-logo_(3)_(1).png' },
];

async function testImageUrl(url: string): Promise<ImageDiagResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return {
      url,
      status: res.status,
      contentType: res.headers.get('content-type') ?? '(none)',
      timeMs: Date.now() - start,
      ok: res.ok,
    };
  } catch (err: any) {
    return {
      url,
      status: 'ERR',
      contentType: '—',
      timeMs: Date.now() - start,
      ok: false,
      error: err?.message ?? String(err),
    };
  }
}

export default function DiagnosticButton() {
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_DIAGNOSTIC === 'true';

  const [results, setResults] = useState<ImageDiagResult[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isDev) return null;

  const runDiagnostic = async () => {
    setLoading(true);
    setResults([]);
    setApiStatus('');

    // 1. Testa API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
      const data = await res.json();
      setApiStatus(`✅ Backend: ${data.status} (HTTP ${res.status})`);
    } catch (err: any) {
      setApiStatus(`❌ Backend inacessível: ${err?.message}`);
    }

    // 2. Testa imagens reais
    const tested = await Promise.all(
      IMAGE_SAMPLES.map(async (sample) => {
        const resolvedUrl = resolveMediaUrl(sample.path) ?? sample.path;
        return testImageUrl(resolvedUrl);
      })
    );
    setResults(tested);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        my: 2,
        p: 2,
        border: '2px dashed #aaa',
        borderRadius: 2,
        bgcolor: '#f9f9f9',
        maxWidth: 640,
        fontFamily: 'monospace',
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        🔧 Diagnóstico de Imagens (dev only)
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={runDiagnostic}
        disabled={loading}
      >
        {loading ? 'Testando...' : 'Executar diagnóstico'}
      </Button>

      {apiStatus && (
        <Typography variant="body2" mt={1}>
          {apiStatus}
        </Typography>
      )}

      {results.length > 0 && (
        <Box mt={2}>
          <Divider sx={{ mb: 1 }} />
          {results.map((r, i) => (
            <Box key={i} mb={1.5}>
              <Typography variant="caption" display="block" color="text.secondary">
                {IMAGE_SAMPLES[i].label}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                <strong>URL:</strong> {r.url}
              </Typography>
              <Typography variant="body2" color={r.ok ? 'success.main' : 'error.main'}>
                <strong>Status:</strong> {r.status} &nbsp;|&nbsp;
                <strong>Content-Type:</strong> {r.contentType} &nbsp;|&nbsp;
                <strong>Tempo:</strong> {r.timeMs}ms
              </Typography>
              {r.error && (
                <Typography variant="body2" color="error">
                  Erro: {r.error}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
