import { Component, createSignal, createEffect } from 'solid-js';

const LeiOrcamentariaAnualLOA: Component = () => {
  const [dotacoes, setDotacoes] = createSignal([]);
  const [codigo, setCodigo] = createSignal('');
  const [descricao, setDescricao] = createSignal('');
  const [saldo, setSaldo] = createSignal('');

  const carregarLoa = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/loa/dotacoes');
      if (res.ok) setDotacoes(await res.json());
    } catch (err) {
      console.error("Erro ao carregar LOA:", err);
    }
  };

  createEffect(() => { carregarLoa(); });

  const salvarDotacao = async (e: Event) => {
    e.preventDefault();
    if (!codigo() || !descricao() || !saldo()) return alert('Todos os campos da dotação são obrigatórios para consistência contábil!');

    try {
      const res = await fetch('http://localhost:3000/api/loa/dotacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: codigo(),
          descricao: descricao(),
          saldo_inicial: parseFloat(saldo())
        })
      });

      if (res.ok) {
        alert('Nova dotação orçamentária aberta com sucesso no exercício corrente!');
        setCodigo(''); setDescricao(''); setSaldo('');
        carregarLoa();
      } else {
        alert('Erro: Verifique se esse código estruturado de dotação já foi cadastrado.');
      }
    } catch (err) {
      alert('Motor orçamentário indisponível.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>🏛️ Módulo 05 - Lei Orçamentária Anual (LOA)</h2>
      <p style={{ color: '#4b5563' }}>Fixação da Despesa e Abertura de Créditos. Gestão de Fichas de Dotação Orçamentária por Unidade Gestora.</p>

      {/* Formulário de Dotação */}
      <form onSubmit={salvarDotacao} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '550px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #e5e7eb', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#1e3a8a' }}>Abrir Nova Ficha de Dotação Orçamentária</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Código Estruturado (Órgão.Unid.Função.Subf.Prog.Ação.Elem)</label>
          <input type="text" value={codigo()} onInput={(e) => setCodigo(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-family': 'monospace' }} placeholder="Ex: 02.10.10.301.0012.2023.339030" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descrição da Destinação do Recurso</label>
          <input type="text" value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Aquisição de Medicamentos para a Farmácia Básica" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Crédito Inicial Fixado (R$)</label>
          <input type="number" step="0.01" value={saldo()} onInput={(e) => setSaldo(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
        </div>

        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Consolidar Dotação na LOA
        </button>
      </form>

      {/* Tabela de Dotações */}
      <h3>Quadro de Detalhamento da Despesa (QDD)</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Código Estruturado</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Descrição da Ação</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Orçamento Inicial</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Saldo Atual Disponível</th>
            </tr>
          </thead>
          <tbody>
            {dotacoes().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum crédito foi fixado na LOA para o presente exercício.</td>
              </tr>
            ) : (
              dotacoes().map((d: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold', color: '#1e3a8a' }}>{d.codigo}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{d.descricao}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>
                    R$ {d.saldo_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: d.saldo_atual > 0 ? '#16a34a' : '#dc2626' }}>
                    R$ {d.saldo_atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default LeiOrcamentariaAnualLOA;
