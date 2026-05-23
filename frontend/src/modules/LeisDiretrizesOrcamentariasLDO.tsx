import { Component, createSignal, createEffect } from 'solid-js';

const LeisDiretrizesOrcamentariasLDO: Component = () => {
  const [diretrizes, setDiretrizes] = createSignal([]);
  const [ano, setAno] = createSignal('2027');
  const [descricao, setDescricao] = createSignal('');
  const [meta, setMeta] = createSignal('');

  const carregarLdo = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ldo/diretrizes');
      if (res.ok) setDiretrizes(await res.json());
    } catch (err) {
      console.error("Erro ao buscar LDO:", err);
    }
  };

  createEffect(() => { carregarLdo(); });

  const salvarDiretriz = async (e: Event) => {
    e.preventDefault();
    if (!ano() || !descricao() || !meta()) return alert('Todos os campos fiscais são obrigatórios!');

    try {
      const res = await fetch('http://localhost:3000/api/ldo/diretrizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ano: parseInt(ano()),
          descricao: descricao(),
          meta_fiscal: parseFloat(meta())
        })
      });

      if (res.ok) {
        alert('Diretriz e meta orçamentária integradas à LDO!');
        setDescricao(''); setMeta('');
        carregarLdo();
      }
    } catch (err) {
      alert('Não foi possível registrar a diretriz.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>📋 Módulo 04 - Lei de Diretrizes Orçamentárias (LDO)</h2>
      <p style={{ color: '#4b5563' }}>Definição de metas fiscais anuais e regras de equilíbrio orçamentário em conformidade com a LRF.</p>

      {/* Formulário de Metas */}
      <form onSubmit={salvarDiretriz} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '500px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #e5e7eb', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#1e3a8a' }}>Fixar Diretriz e Meta de Arrecadação/Gasto</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Ano de Vigência</label>
          <select value={ano()} onChange={(e) => setAno(e.currentTarget.value)} style={{ padding: '8px', width: '98%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Prioridade / Descrição da Meta</label>
          <textarea value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '95%', height: '50px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Ex: Teto para investimento em Saúde Pública e contenção de despesas de custeio..." />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Meta Fiscal Alvo (R$)</label>
          <input type="number" step="0.01" value={meta()} onInput={(e) => setMeta(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
        </div>

        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Homologar Diretriz na LDO
        </button>
      </form>

      {/* Tabela de Diretrizes */}
      <h3>Anexo de Diretrizes e Prioridades Fiscais</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', width: '100px' }}>Exercício</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Diretrizes Governamentais</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', width: '200px' }}>Meta Fiscal Anual</th>
            </tr>
          </thead>
          <tbody>
            {diretrizes().length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhuma diretriz foi delimitada para as leis orçamentárias ainda.</td>
              </tr>
            ) : (
              diretrizes().map((d: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#1e3a8a' }}>{d.ano}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{d.descricao}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#b45309' }}>
                    R$ {d.meta_fiscal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default LeisDiretrizesOrcamentariasLDO;
