import { Component, createSignal, createEffect } from 'solid-js';

const GestaoControleInterno: Component = () => {
  const [alertas, setAlertas] = createSignal([]);
  const [titulo, setTitulo] = createSignal('');
  const [severidade, setSeveridade] = createSignal('ALERTA');
  const [modulo, setModulo] = createSignal('Licitações');
  const [descricao, setDescricao] = createSignal('');

  const carregarAlertas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auditoria/alertas');
      if (res.ok) setAlertas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar auditoria:", err);
    }
  };

  createEffect(() => { carregarAlertas(); });

  const emitirAlerta = async (e: Event) => {
    e.preventDefault();
    if (!titulo() || !descricao()) return alert('Preencha os dados da infração ou alerta preventivo!');

    try {
      const res = await fetch('http://localhost:3000/api/auditoria/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo(),
          nivel_severidade: severidade(),
          modulo_origem: modulo(),
          descricao: descricao()
        })
      });

      if (res.ok) {
        alert('Apontamento de Controle Interno registrado com sucesso!');
        setTitulo(''); setDescricao('');
        carregarAlertas();
      }
    } catch (err) {
      alert('Falha de conexão com o banco de auditoria.');
    }
  };

  const corSeveridade = (nivel: string) => {
    if (nivel === 'CRITICO') return { bg: '#fee2e2', text: '#991b1b' };
    if (nivel === 'ALERTA') return { bg: '#fef3c7', text: '#b45309' };
    return { bg: '#e0f2fe', text: '#0369a1' };
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#4c1d95', 'margin-top': 0 }}>🔎 Módulo 10 - Gestão de Controle Interno</h2>
      <p style={{ color: '#4b5563' }}>Auditoria, Compliance e Monitoramento Preventivo da Lei de Responsabilidade Fiscal (LRF).</p>

      {/* Formulário de Apontamento */}
      <form onSubmit={emitirAlerta} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #ddd6fe', 'border-radius': '6px', background: '#f5f3ff' }}>
        <strong style={{ color: '#5b21b6' }}>Registrar Apontamento de Auditoria Manual</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Classificação de Severidade</label>
            <select value={severidade()} onChange={(e) => setSeveridade(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-weight': 'bold' }}>
              <option value="INFORMATIVO">🔵 Informativo</option>
              <option value="ALERTA">🟡 Alerta Preventivo</option>
              <option value="CRITICO">🔴 Risco Crítico (Bloqueio)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Módulo de Origem</label>
            <select value={modulo()} onChange={(e) => setModulo(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="Folha de Pagamento">Folha de Pagamento</option>
              <option value="Licitações">Licitações e Contratos</option>
              <option value="Contabilidade">Contabilidade (Despesa)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Título da Ocorrência</label>
          <input type="text" value={titulo()} onInput={(e) => setTitulo(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Limite Prudencial da LRF Atingido" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descrição Detalhada / Base Legal</label>
          <textarea value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '96%', height: '60px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Descreva a infração ou risco detectado..." />
        </div>

        <button type="submit" style={{ background: '#4c1d95', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Autuar Apontamento
        </button>
      </form>

      {/* Painel de Alertas */}
      <h3>Painel de Monitoramento Contínuo</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Severidade</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Módulo Afetado</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Ocorrência</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {alertas().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhuma inconformidade detectada pelo Controle Interno.</td>
              </tr>
            ) : (
              alertas().map((a: any) => {
                const cor = corSeveridade(a.nivel_severidade);
                return (
                  <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: cor.bg, color: cor.text, padding: '4px 10px', 'border-radius': '4px', 'font-weight': 'bold', 'font-size': '0.75rem' }}>
                        {a.nivel_severidade}
                      </span>
                    </td>
                    <td style={{ padding: '10px', 'font-weight': '600', color: '#4b5563' }}>{a.modulo_origem}</td>
                    <td style={{ padding: '10px' }}>
                      <strong style={{ display: 'block', color: '#111827' }}>{a.titulo}</strong>
                      <span style={{ 'font-size': '0.8rem', color: '#6b7280' }}>{a.descricao}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {a.resolvido ? (
                        <span style={{ color: '#10b981', 'font-weight': 'bold' }}>✓ Sanado</span>
                      ) : (
                        <span style={{ color: '#ef4444', 'font-weight': 'bold' }}>! Pendente</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoControleInterno;
