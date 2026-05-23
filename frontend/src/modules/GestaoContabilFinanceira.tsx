import { Component, createSignal, createEffect } from 'solid-js';

const GestaoContabilFinanceira: Component = () => {
  const [empenhos, setEmpenhos] = createSignal([]);
  const [numero, setNumero] = createSignal('');
  const [valor, setValor] = createSignal('');
  const [historico, setHistorico] = createSignal('');

  const carregarEmpenhos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/contabil/empenhos');
      if (res.ok) setEmpenhos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar:", err);
    }
  };

  createEffect(() => { carregarEmpenhos(); });

  const emitirEmpenho = async (e: Event) => {
    e.preventDefault();
    if (!numero() || !valor()) return alert('Preencha os campos!');
    try {
      const res = await fetch('http://localhost:3000/api/contabil/empenhos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_empenho: numero(), valor: parseFloat(valor()), historico: historico() })
      });
      if (res.ok) { setNumero(''); setValor(''); setHistorico(''); carregarEmpenhos(); }
      else { alert('Erro: Número de empenho duplicado.'); }
    } catch (err) { alert('Motor fora do ar.'); }
  };

  // Funções de transição de estado
  const liquidar = async (id: string) => {
    if(!confirm('Confirma o recebimento da nota fiscal e liquidação desta despesa?')) return;
    const res = await fetch(`http://localhost:3000/api/contabil/empenhos/${id}/liquidar`, { method: 'PUT' });
    if(res.ok) carregarEmpenhos();
    else alert('Erro: Só é possível liquidar despesas com status EMPENHADO.');
  };

  const pagar = async (id: string) => {
    if(!confirm('Confirma a autorização de pagamento na Tesouraria?')) return;
    const res = await fetch(`http://localhost:3000/api/contabil/empenhos/${id}/pagar`, { method: 'PUT' });
    if(res.ok) carregarEmpenhos();
    else alert('Erro: Só é possível pagar despesas já LIQUIDADAS.');
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>📊 Módulo 02 - Gestão Contábil Financeira</h2>
      
      <form onSubmit={emitirEmpenho} style={{ display: 'flex', gap: '10px', 'margin-bottom': '20px', 'align-items': 'flex-end', 'flex-wrap': 'wrap' }}>
        <div>
          <label style={{ display: 'block', 'font-size': '0.8rem', 'font-weight': 'bold' }}>Nº Empenho</label>
          <input type="text" value={numero()} onInput={(e) => setNumero(e.currentTarget.value)} style={{ padding: '8px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label style={{ display: 'block', 'font-size': '0.8rem', 'font-weight': 'bold' }}>Valor (R$)</label>
          <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', border: '1px solid #ccc', width: '100px' }} />
        </div>
        <div>
          <label style={{ display: 'block', 'font-size': '0.8rem', 'font-weight': 'bold' }}>Histórico</label>
          <input type="text" value={historico()} onInput={(e) => setHistorico(e.currentTarget.value)} style={{ padding: '8px', border: '1px solid #ccc', width: '250px' }} />
        </div>
        <button type="submit" style={{ padding: '9px 15px', background: '#1e3a8a', color: '#fff', border: 'none', cursor: 'pointer' }}>Emitir</button>
      </form>

      <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
        <thead style={{ background: '#f3f4f6', 'text-align': 'left' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nº Empenho</th>
            <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor</th>
            <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #e5e7eb', 'text-align': 'center' }}>Ações Contábeis</th>
          </tr>
        </thead>
        <tbody>
          {empenhos().map((emp: any) => (
            <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
              <td style={{ padding: '10px', 'font-family': 'monospace' }}>{emp.numero_empenho}</td>
              <td style={{ padding: '10px', color: '#16a34a', 'font-weight': 'bold' }}>R$ {emp.valor.toFixed(2)}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  background: emp.status === 'EMPENHADO' ? '#fef08a' : emp.status === 'LIQUIDADO' ? '#bfdbfe' : '#bbf7d0', 
                  color: '#374151', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.8rem', 'font-weight': 'bold' 
                }}>
                  {emp.status}
                </span>
              </td>
              <td style={{ padding: '10px', 'text-align': 'center' }}>
                {emp.status === 'EMPENHADO' && (
                  <button onClick={() => liquidar(emp.id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', 'border-radius': '3px', cursor: 'pointer', 'margin-right': '5px' }}>Comprovar Liquidação</button>
                )}
                {emp.status === 'LIQUIDADO' && (
                  <button onClick={() => pagar(emp.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '5px 10px', 'border-radius': '3px', cursor: 'pointer' }}>Autorizar Pagamento</button>
                )}
                {emp.status === 'PAGO' && (
                  <span style={{ color: '#9ca3af', 'font-size': '0.8rem' }}>Ciclo Encerrado</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestaoContabilFinanceira;
