import { Component, createSignal, createEffect } from 'solid-js';

const GestaoFornecimentoAgua: Component = () => {
  const [leituras, setLeituras] = createSignal([]);
  const [matricula, setMatricula] = createSignal('');
  const [anterior, setAnterior] = createSignal('');
  const [atual, setAtual] = createSignal('');

  const carregarLeituras = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/agua/leituras');
      if (res.ok) setLeituras(await res.json());
    } catch (err) {
      console.error("Erro ao carregar leituras:", err);
    }
  };

  createEffect(() => { carregarLeituras(); });

  const registrarLeitura = async (e: Event) => {
    e.preventDefault();
    if (!matricula() || !anterior() || !atual()) {
      return alert('Informe a matrícula e ambas as leituras do hidrômetro.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/agua/leituras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula_imovel: matricula(),
          leitura_anterior: parseFloat(anterior()),
          leitura_atual: parseFloat(atual())
        })
      });

      if (res.ok) {
        alert('Leitura aferida. Fatura de consumo processada!');
        setMatricula(''); setAnterior(''); setAtual('');
        carregarLeituras();
      } else {
        alert('Erro: A leitura atual não pode ser menor que a anterior (Hidrômetro invertido ou fraude).');
      }
    } catch (err) {
      alert('Falha na comunicação de campo com o servidor central.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0284c7', 'margin-top': 0 }}>💧 Módulo 17 - Fornecimento de Água e Saneamento</h2>
      <p style={{ color: '#4b5563' }}>Registro de leituras de campo e cálculo progressivo automático de fatura (Tarifa Básica e Excedente).</p>

      {/* Formulário do Leiturista */}
      <form onSubmit={registrarLeitura} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #7dd3fc', 'border-radius': '6px', background: '#f0f9ff' }}>
        <strong style={{ color: '#0369a1' }}>Registrar Leitura Mensal de Hidrômetro</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Matrícula da Ligação de Água</label>
          <input type="text" value={matricula()} onInput={(e) => setMatricula(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-family': 'monospace' }} placeholder="Ex: MAT-182744" />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Leitura Anterior (m³)</label>
            <input type="number" step="0.01" value={anterior()} onInput={(e) => setAnterior(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 105.0" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Leitura Atual (m³)</label>
            <input type="number" step="0.01" value={atual()} onInput={(e) => setAtual(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 118.0" />
          </div>
        </div>

        <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Apurar Consumo e Gerar Fatura
        </button>
      </form>

      {/* Relatório Operacional */}
      <h3>Relatório de Consumo e Faturamento Mensal</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Ligação (Matrícula)</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Variação (Ant ➔ Atual)</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Consumo Aferido</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', background: '#e0f2fe' }}>Valor Apurado</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status Fatura</th>
            </tr>
          </thead>
          <tbody>
            {leituras().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Sem leituras processadas neste ciclo.</td>
              </tr>
            ) : (
              leituras().map((l: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold', color: '#4b5563' }}>{l.matricula_imovel}</td>
                  <td style={{ padding: '10px', color: '#6b7280', 'font-size': '0.85rem' }}>
                    {l.leitura_anterior} m³ ➔ {l.leitura_atual} m³
                  </td>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: l.consumo_m3 > 10 ? '#dc2626' : '#16a34a' }}>
                    {l.consumo_m3.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} m³
                  </td>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#0369a1', background: '#f0f9ff' }}>
                    R$ {l.valor_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {l.status}
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

export default GestaoFornecimentoAgua;
