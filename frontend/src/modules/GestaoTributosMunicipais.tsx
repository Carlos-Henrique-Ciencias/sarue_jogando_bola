import { Component, createSignal, createEffect } from 'solid-js';

const GestaoTributosMunicipais: Component = () => {
  const [tributos, setTributos] = createSignal([]);
  const [contribuinte, setContribuinte] = createSignal('');
  const [tipo, setTipo] = createSignal('IPTU');
  const [exercicio, setExercicio] = createSignal('2026');
  const [valor, setValor] = createSignal('');

  const carregarTributos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tributos/lancamentos');
      if (res.ok) setTributos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar tributos:", err);
    }
  };

  createEffect(() => { carregarTributos(); });

  const lancarTributo = async (e: Event) => {
    e.preventDefault();
    if (!contribuinte() || !valor()) return alert('Identifique o contribuinte e o valor base de cálculo!');

    try {
      const res = await fetch('http://localhost:3000/api/tributos/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contribuinte: contribuinte(),
          tipo_tributo: tipo(),
          exercicio: parseInt(exercicio()),
          valor: parseFloat(valor())
        })
      });

      if (res.ok) {
        alert('Lançamento tributário efetuado! Guia disponível para pagamento.');
        setContribuinte(''); setValor('');
        carregarTributos();
      }
    } catch (err) {
      alert('Falha ao acionar o motor de arrecadação.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#166534', 'margin-top': 0 }}>💸 Módulo 15 - Gestão de Tributos Municipais</h2>
      <p style={{ color: '#4b5563' }}>Lançamento e Arrecadação de Impostos Diretos (IPTU, ISSQN, ITBI e Taxas de Alvará).</p>

      {/* Formulário de Lançamento */}
      <form onSubmit={lancarTributo} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #86efac', 'border-radius': '6px', background: '#f0fdf4' }}>
        <strong style={{ color: '#14532d' }}>Efetuar Lançamento Tributário em Massa ou Individual</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Nome/Razão Social ou CPF/CNPJ</label>
          <input type="text" value={contribuinte()} onInput={(e) => setContribuinte(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Dados do Contribuinte..." />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Imposto / Taxa</label>
            <select value={tipo()} onChange={(e) => setTipo(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="IPTU">IPTU - Imposto Predial Territorial</option>
              <option value="ISSQN">ISSQN - Imposto Sobre Serviços</option>
              <option value="ITBI">ITBI - Transferência Imóveis</option>
              <option value="ALVARA">Taxa de Alvará / Localização</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Ano Ref.</label>
            <input type="number" value={exercicio()} onInput={(e) => setExercicio(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor (R$)</label>
            <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <button type="submit" style={{ background: '#166534', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Lançar Crédito Tributário
        </button>
      </form>

      {/* Tabela de Lançamentos */}
      <h3>Livro Eletrônico de Lançamentos Fiscais</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Contribuinte</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tributo</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Exercício</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Emitido</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status Físico</th>
            </tr>
          </thead>
          <tbody>
            {tributos().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum tributo lançado na base ativa.</td>
              </tr>
            ) : (
              tributos().map((t: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#374151' }}>{t.contribuinte}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#166534', 'font-weight': 'bold' }}>{t.tipo_tributo}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>{t.exercicio}</td>
                  <td style={{ padding: '10px', color: '#b45309', 'font-weight': '600' }}>
                    R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: t.status === 'ABERTO' ? '#fef08a' : '#dcfce7', color: t.status === 'ABERTO' ? '#854d0e' : '#14532d', padding: '4px 10px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {t.status}
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

export default GestaoTributosMunicipais;
