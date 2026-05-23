import { Component, createSignal, createEffect } from 'solid-js';

const PlanoPlurianualPPA: Component = () => {
  const [programas, setProgramas] = createSignal([]);
  const [nome, setNome] = createSignal('');
  const [objetivo, setObjetivo] = createSignal('');
  const [teto, setTeto] = createSignal('');

  const carregarPpa = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/ppa/programas');
      if (res.ok) setProgramas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar programas do PPA:", err);
    }
  };

  createEffect(() => { carregarPpa(); });

  const salvarPrograma = async (e: Event) => {
    e.preventDefault();
    if (!nome() || !objetivo() || !teto()) return alert('Todos os parâmetros estratégicos são mandatórios.');

    try {
      const res = await fetch('http://localhost:3000/api/ppa/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome(),
          objetivo: objetivo(),
          teto_financeiro: parseFloat(teto())
        })
      });

      if (res.ok) {
        alert('Macro-programa inserido nas diretrizes do PPA municipal!');
        setNome(''); setObjetivo(''); setTeto('');
        carregarPpa();
      }
    } catch (err) {
      alert('Falha crítica de comunicação com o motor de planejamento.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>🎯 Módulo 03 - Plano Plurianual (PPA)</h2>
      <p style={{ color: '#4b5563' }}>Planejamento de Médio Prazo. Definição das Metas Físicas e Tetos Orçamentários Globais do Município.</p>

      {/* Form de Cadastro de Diretriz */}
      <form onSubmit={salvarPrograma} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '500px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #e5e7eb', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#1e3a8a' }}>Cadastrar Programa Estratégico (Macro-Metas)</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Nome do Programa</label>
          <input type="text" value={nome()} onInput={(e) => setNome(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Modernização da Infraestrutura Urbana" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Diretriz / Objetivo Geral</label>
          <textarea value={objetivo()} onInput={(e) => setObjetivo(e.currentTarget.value)} style={{ padding: '8px', width: '95%', height: '50px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Ex: Pavimentação e saneamento nos bairros periféricos..." />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Teto Financeiro Global Quadrienal (R$)</label>
          <input type="number" step="0.01" value={teto()} onInput={(e) => setTeto(e.currentTarget.value)} style={{ padding: '8px', width: '95%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
        </div>

        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Fixar Programa no PPA
        </button>
      </form>

      {/* Tabela de Programas */}
      <h3>Macro-Programas Fixados para o Próximo Quadriênio</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>ID Governamental</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Programa</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Objetivo Estratégico</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Teto Orçado</th>
            </tr>
          </thead>
          <tbody>
            {programas().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum programa macro-estratégico foi planejado para este ciclo.</td>
              </tr>
            ) : (
              programas().map((p: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-size': '0.8rem', color: '#6b7280' }}>{p.id.substring(0,8)}...</td>
                  <td style={{ padding: '10px', 'font-weight': 'bold' }}>{p.nome}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{p.objetivo}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#1e3a8a' }}>
                    R$ {p.teto_financeiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default PlanoPlurianualPPA;
