import { Component, createSignal, createEffect } from 'solid-js';

const ProtocoloDigitalProcessos: Component = () => {
  const [protocolos, setProtocolos] = createSignal([]);
  const [requerente, setRequerente] = createSignal('');
  const [assunto, setAssunto] = createSignal('Alvará de Funcionamento');
  const [descricao, setDescricao] = createSignal('');

  const carregarProtocolos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/protocolos');
      if (res.ok) setProtocolos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar protocolos:", err);
    }
  };

  createEffect(() => { carregarProtocolos(); });

  const autuarProcesso = async (e: Event) => {
    e.preventDefault();
    if (!requerente() || !descricao()) return alert('Identifique o requerente e o escopo do pedido!');

    // Gerador rápido de número de protocolo (MOCK para UX fluida)
    const numeroGerado = `PRT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

    try {
      const res = await fetch('http://localhost:3000/api/protocolos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_protocolo: numeroGerado,
          requerente: requerente(),
          assunto: assunto(),
          descricao: descricao()
        })
      });

      if (res.ok) {
        alert(`Sucesso! Processo autuado sob o nº: ${numeroGerado}`);
        setRequerente(''); setDescricao('');
        carregarProtocolos();
      }
    } catch (err) {
      alert('Falha na comunicação com a central de atendimento.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0369a1', 'margin-top': 0 }}>📁 Módulo 22 - Protocolo Digital e Processos</h2>
      <p style={{ color: '#4b5563' }}>Fim da era do papel. Autuação, tramitação e acompanhamento de processos administrativos e requerimentos.</p>

      {/* Formulário de Abertura */}
      <form onSubmit={autuarProcesso} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #bae6fd', 'border-radius': '6px', background: '#f0f9ff' }}>
        <strong style={{ color: '#0284c7' }}>Abrir Novo Processo Administrativo (Público/Interno)</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Nome do Requerente</label>
            <input type="text" value={requerente()} onInput={(e) => setRequerente(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Nome do Cidadão ou Servidor" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Assunto do Pedido</label>
            <select value={assunto()} onChange={(e) => setAssunto(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="Alvará de Funcionamento">Alvará de Funcionamento</option>
              <option value="Defesa de Multa">Defesa de Multa de Trânsito</option>
              <option value="Certidão Negativa">Certidão Negativa (CND)</option>
              <option value="Requerimento RH">Requerimento Interno (RH)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descrição / Fundamentação do Pedido</label>
          <textarea value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '96%', height: '60px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Descreva os motivos ou anexe informações relevantes..." />
        </div>

        <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Gerar Número de Protocolo
        </button>
      </form>

      {/* Tabela de Tramitação */}
      <h3>Caixa de Entrada de Protocolos</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nº Processo</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Requerente</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Assunto</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status do Trâmite</th>
            </tr>
          </thead>
          <tbody>
            {protocolos().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum processo tramitando na prefeitura.</td>
              </tr>
            ) : (
              protocolos().map((p: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold', color: '#0369a1' }}>{p.numero_protocolo}</td>
                  <td style={{ padding: '10px', color: '#374151' }}>{p.requerente}</td>
                  <td style={{ padding: '10px', 'font-weight': '500', color: '#4b5563' }}>{p.assunto}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: p.status === 'AGUARDANDO_ANALISE' ? '#fef08a' : '#dcfce7', color: p.status === 'AGUARDANDO_ANALISE' ? '#854d0e' : '#14532d', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProtocoloDigitalProcessos;
