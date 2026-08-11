import React, { useEffect, useState } from 'react';
import { Box, Button, H1, Label, Text } from '@adminjs/design-system';

const GoogleAccessPage = () => {
  const [data, setData] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const response = await fetch('/admin/api/oauth-access', { credentials: 'same-origin' });
    if (!response.ok) throw new Error('Não foi possível carregar os acessos');
    setData(await response.json());
  };

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  const addEmail = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const response = await fetch('/admin/api/oauth-access', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const payload = response.status === 204 ? {} : await response.json();
    if (!response.ok) setMessage(payload.error || 'Não foi possível autorizar o e-mail');
    else {
      setEmail('');
      setMessage('E-mail autorizado com sucesso.');
      await load();
    }
    setBusy(false);
  };

  const removeEmail = async (id, value) => {
    if (!window.confirm(`Remover a autorização de ${value}?`)) return;
    const response = await fetch(`/admin/api/oauth-access/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    if (!response.ok) setMessage('Não foi possível remover o e-mail.');
    else {
      setMessage('Autorização removida.');
      await load();
    }
  };

  return (
    <Box padding={['xl', 'xxl']}>
      <H1>Acesso Google</H1>
      <Text marginTop="md">
        Cadastre os e-mails que poderão entrar no painel usando uma conta Google verificada.
      </Text>

      <div className={`cdc-oauth-status ${data?.configured ? 'is-ready' : 'is-pending'}`}>
        <strong>{data?.configured ? 'OAuth configurado' : 'OAuth aguardando credenciais'}</strong>
        {data?.callbackUrl && <span>Retorno: {data.callbackUrl}</span>}
      </div>

      <form className="cdc-oauth-form" onSubmit={addEmail}>
        <div>
          <Label htmlFor="cdc-oauth-email">Novo e-mail autorizado</Label>
          <input
            id="cdc-oauth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nome@dominio.org.br"
            required
          />
        </div>
        <Button type="submit" disabled={busy}>{busy ? 'Salvando...' : 'Autorizar e-mail'}</Button>
      </form>

      {message && <p className="cdc-oauth-message" role="status">{message}</p>}

      <section className="cdc-oauth-list">
        <h2>E-mails protegidos</h2>
        {(data?.protectedEmails || []).map((value) => (
          <div className="cdc-oauth-row is-protected" key={`protected-${value}`}>
            <span>{value}</span><small>E-mail principal</small>
          </div>
        ))}

        <h2>E-mails adicionados pelo painel</h2>
        {data?.emails?.length ? data.emails.map((item) => (
          <div className="cdc-oauth-row" key={item.id}>
            <span>{item.email}</span>
            <button type="button" onClick={() => removeEmail(item.id, item.email)}>Remover</button>
          </div>
        )) : <Text>Nenhum e-mail adicional cadastrado.</Text>}
      </section>
    </Box>
  );
};

export default GoogleAccessPage;
