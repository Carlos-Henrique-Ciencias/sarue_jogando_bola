import { Component, createSignal, createEffect } from 'solid-js';

const GestaoDividaAtiva: Component = () => {
  const [dividas, setDividas] = createSignal([]);
  const [contribuinte, setContribuinte] = createSignal('');
  const [cda, setCda] = createSignal('');
  const [valor, setValor] = createSignal('');

  const carregarDividas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/dividas');
      if (res.ok) setDividas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar dívidas:", err);
    }
  };

  createEffect(() => { carregarDividas(); });

  const inscreverDivida = async (e: Event) => {
    e.preventDefault();
    if (!contribuinte() || !cda() || !valor()) return alert('Informe os dados obrigatórios para gerar a CDA!');

    try {
      const res = await fetch('http://localhost:3000/api/dividas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contribuinte: contribuinte(),
          numero_cda: cda(),
          valor_principal: parseFloat(valor())
        })
      });

      if (res.ok) {
        alert('Cidadão inscrito na Dívida Ativa com sucesso!');
        setContribuinte(''); setCda(''); setValor('');
        carregarDividas();
      } else {
        alert('Erro: Número de CDA já existe no sistema.');
      }
    } catch (err) {
      alert('Falha ao conectar à Procuradoria.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#dc2626', 'margin-top': 0 }}>🚨 Módulo 08 - Gestão de Dívida Ativa</h2>
      <p style={{ color: '#4b5563' }}>Inscrição de débitos tributários não pagos e emissão de Certidão de Dívida Ativa (CDA) para execução fiscal.</p>

      {/* Formulário de Inscrição */}
      <form onSubmit={inscreverDivida} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #fca5a5', 'border-radius': '6px', background: '#fef2f2' }}>
        <strong style={{ color: '#991b1b' }}>Inscrever Novo Débito em Dívida Ativa</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Nome do Contribuinte Inadimplente</label>
          <input type="text" value={contribuinte()} onInput={(e) => setContribuinte(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Nome completo ou Razão Social" />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Número da CDA (Livro/Folha)</label>
            <input type="text" value={cda()} onInput={(e) => setCda(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: CDA-2026-991" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor Principal Devido (R$)</label>
            <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <button type="submit" style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Gerar Certidão (CDA)
        </button>
      </form>

      {/* Tabela de Dívidas */}
      <h3>Livro Eletrônico de Inscrições</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Contribuinte</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nº CDA</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Histórico</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status Processual</th>
            </tr>
          </thead>
          <tbody>
            {dividas().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhuma dívida ativa registrada.</td>
              </tr>
            ) : (
              dividas().map((d: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold' }}>{d.contribuinte}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#4b5563' }}>{d.numero_cda}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#dc2626' }}>
                    R$ {d.valor_principal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {d.status}
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

export default GestaoDividaAtiva;
