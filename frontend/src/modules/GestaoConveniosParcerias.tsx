import { Component, createSignal, createEffect } from 'solid-js';

const GestaoConveniosParcerias: Component = () => {
  const [convenios, setConvenios] = createSignal([]);
  const [numero, setNumero] = createSignal('');
  const [orgao, setOrgao] = createSignal('');
  const [valorGlobal, setValorGlobal] = createSignal('');
  const [contrapartida, setContrapartida] = createSignal('');

  const carregarConvenios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/convenios');
      if (res.ok) setConvenios(await res.json());
    } catch (err) {
      console.error("Erro ao carregar convênios:", err);
    }
  };

  createEffect(() => { carregarConvenios(); });

  const salvarConvenio = async (e: Event) => {
    e.preventDefault();
    if (!numero() || !orgao() || !valorGlobal() || !contrapartida()) {
      return alert('Todos os campos são obrigatórios para a prestação de contas legal!');
    }

    try {
      const res = await fetch('http://localhost:3000/api/convenios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_convenio: numero(),
          orgao_concedente: orgao(),
          valor_global: parseFloat(valorGlobal()),
          valor_contrapartida: parseFloat(contrapartida())
        })
      });

      if (res.ok) {
        alert('Termo de Convênio inserido no plano de fundos externos!');
        setNumero(''); setOrgao(''); setValorGlobal(''); setContrapartida('');
        carregarConvenios();
      } else {
        alert('Erro: Certifique-se de que o número do convênio já não foi registrado.');
      }
    } catch (err) {
      alert('Falha ao conectar ao motor de convênios.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>🤝 Módulo 06 - Gestão de Convênios e Parcerias</h2>
      <p style={{ color: '#4b5563' }}>Rastreamento de Recursos de Fontes Externas (Emendas e Parcerias Estaduais/Federais) e Alocação de Contrapartidas.</p>

      {/* Formulário de Cadastro */}
      <form onSubmit={salvarConvenio} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '550px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #e5e7eb', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#1e3a8a' }}>Registrar Novo Convênio / Termo de Fomento</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Número do Instrumento / Processo</label>
          <input type="text" value={numero()} onInput={(e) => setNumero(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 943210/2026" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Órgão Concedente / Repassador</label>
          <input type="text" value={orgao()} onInput={(e) => setOrgao(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Ministério da Saúde / Governo do Estado" />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor Global de Repasse (R$)</label>
            <input type="number" step="0.01" value={valorGlobal()} onInput={(e) => setValorGlobal(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Contrapartida Municipal (R$)</label>
            <input type="number" step="0.01" value={contrapartida()} onInput={(e) => setContrapartida(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Homologar Instrumento de Parceria
        </button>
      </form>

      {/* Tabela de Resultados */}
      <h3>Livro de Registros de Recursos Conveniados</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nº Instrumento</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Concedente</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Repasse</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Contrapartida</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Situação</th>
            </tr>
          </thead>
          <tbody>
            {convenios().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum repasse ou termo externo foi vinculado ao município até ao momento.</td>
              </tr>
            ) : (
              convenios().map((c: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold' }}>{c.numero_convenio}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{c.orgao_concedente}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#16a34a' }}>
                    R$ {c.valor_global.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px', color: '#dc2626' }}>
                    R$ {c.valor_contrapartida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '4px 10px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {c.status}
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

export default GestaoConveniosParcerias;
