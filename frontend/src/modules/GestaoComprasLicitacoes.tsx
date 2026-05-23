import { Component, createSignal, createEffect } from 'solid-js';

const GestaoComprasLicitacoes: Component = () => {
  const [processos, setProcessos] = createSignal([]);
  const [numero, setNumero] = createSignal('');
  const [modalidade, setModalidade] = createSignal('Pregão Eletrônico');
  const [objeto, setObjeto] = createSignal('');
  const [valor, setValor] = createSignal('');

  const carregarProcessos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/licitacoes/processos');
      if (res.ok) setProcessos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar certames:", err);
    }
  };

  createEffect(() => { carregarProcessos(); });

  const abrirProcesso = async (e: Event) => {
    e.preventDefault();
    if (!numero() || !objeto() || !valor()) return alert('Defina os parâmetros do Termo de Referência!');

    try {
      const res = await fetch('http://localhost:3000/api/licitacoes/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_processo: numero(),
          modalidade: modalidade(),
          objeto: objeto(),
          valor_estimado: parseFloat(valor())
        })
      });

      if (res.ok) {
        alert('Processo Licitatório autuado! Aguardando fase de lances.');
        setNumero(''); setObjeto(''); setValor('');
        carregarProcessos();
      } else {
        alert('Erro: Número do processo administrativo já existente.');
      }
    } catch (err) {
      alert('Falha na comunicação com o PNCP interno.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>⚖️ Módulo 07 - Gestão de Compras e Licitações</h2>
      <p style={{ color: '#4b5563' }}>Autuação de certames sob as diretrizes da Lei 14.133. Preparação para publicação e fase de lances.</p>

      {/* Formulário de Abertura de Edital */}
      <form onSubmit={abrirProcesso} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #e5e7eb', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#1e3a8a' }}>Autuar Novo Processo de Licitação</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Número do Edital / PRC</label>
            <input type="text" value={numero()} onInput={(e) => setNumero(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: PRC 045/2026" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Modalidade</label>
            <select value={modalidade()} onChange={(e) => setModalidade(e.currentTarget.value)} style={{ padding: '8px', width: '98%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="Pregão Eletrônico">Pregão Eletrônico</option>
              <option value="Concorrência">Concorrência Pública</option>
              <option value="Dispensa Eletrônica">Dispensa Eletrônica</option>
              <option value="Inexigibilidade">Inexigibilidade</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Objeto da Licitação (Termo de Referência)</label>
          <textarea value={objeto()} onInput={(e) => setObjeto(e.currentTarget.value)} style={{ padding: '8px', width: '96%', height: '60px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Ex: Aquisição de notebooks para a rede municipal de ensino..." />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor Estimado / Teto Máximo (R$)</label>
          <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
        </div>

        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Gerar Processo Administrativo
        </button>
      </form>

      {/* Tabela de Acompanhamento */}
      <h3>Painel de Certames em Trâmite</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Processo / Edital</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Modalidade</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Objeto</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Estimado</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Fase</th>
            </tr>
          </thead>
          <tbody>
            {processos().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum processo licitatório autuado no momento.</td>
              </tr>
            ) : (
              processos().map((p: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold' }}>{p.numero_processo}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{p.modalidade}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>{p.objeto}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#16a34a' }}>
                    R$ {p.valor_estimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {p.status}
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

export default GestaoComprasLicitacoes;
