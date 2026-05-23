import { Component, createSignal, createEffect } from 'solid-js';

const GestaoCemiteriosLuto: Component = () => {
  const [obitos, setObitos] = createSignal([]);
  const [nome, setNome] = createSignal('');
  const [cpf, setCpf] = createSignal('');
  const [dataObito, setDataObito] = createSignal('');
  const [cemiterio, setCemiterio] = createSignal('Cemitério Municipal São João Batista');
  const [lote, setLote] = createSignal('');

  const carregarObitos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/cemiterios/obitos');
      if (res.ok) setObitos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar dados do cemitério:", err);
    }
  };

  createEffect(() => { carregarObitos(); });

  const registarSepultamento = async (e: Event) => {
    e.preventDefault();
    if (!nome() || !dataObito() || !cemiterio() || !lote()) {
      return alert('Obrigatório informar o nome, data do óbito e o local exato do sepultamento.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/cemiterios/obitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_falecido: nome(),
          cpf_falecido: cpf() || null,
          data_obito: dataObito(),
          cemiterio: cemiterio(),
          quadra_lote: lote()
        })
      });

      if (res.ok) {
        alert('Registo de óbito e alocação de jazigo efetuados com sucesso.');
        setNome(''); setCpf(''); setDataObito(''); setLote('');
        carregarObitos();
      } else if (res.status === 409) {
        alert('Erro: Este lote/quadra já se encontra ocupado no sistema. Verifique a disponibilidade.');
      }
    } catch (err) {
      alert('Falha ao comunicar com a base de dados de Serviços Urbanos.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#374151', 'margin-top': 0 }}>🪦 Módulo 23 - Gestão de Cemitérios e Luto</h2>
      <p style={{ color: '#6b7280' }}>Registo digital de óbitos e controlo rigoroso de quadras, lotes e jazigos municipais.</p>

      {/* Formulário de Registo */}
      <form onSubmit={registarSepultamento} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #d1d5db', 'border-radius': '6px', background: '#f9fafb' }}>
        <strong style={{ color: '#111827' }}>Autuar Novo Registo de Sepultamento</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Nome do(a) Falecido(a)</label>
            <input type="text" value={nome()} onInput={(e) => setNome(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Nome completo" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>CPF (Opcional)</label>
            <input type="text" value={cpf()} onInput={(e) => setCpf(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="000.000.000-00" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Data do Óbito</label>
            <input type="date" value={dataObito()} onInput={(e) => setDataObito(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Cemitério de Destino</label>
            <select value={cemiterio()} onChange={(e) => setCemiterio(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="Cemitério Municipal São João Batista">São João Batista (Sede)</option>
              <option value="Cemitério da Saudade">Cemitério da Saudade (Zona Norte)</option>
              <option value="Cemitério Parque das Flores">Parque das Flores</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Identificação do Jazigo (Quadra / Lote)</label>
          <input type="text" value={lote()} onInput={(e) => setLote(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-family': 'monospace' }} placeholder="Ex: Quadra 12, Lote 4B" />
        </div>

        <button type="submit" style={{ background: '#374151', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Consolidar Registo no Livro Oficial
        </button>
      </form>

      {/* Tabela de Registos */}
      <h3>Livro de Registos Fúnebres</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nome do Falecido</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Data Obito</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Cemitério</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Localização (Q/L)</th>
            </tr>
          </thead>
          <tbody>
            {obitos().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum registo efetuado.</td>
              </tr>
            ) : (
              obitos().map((o: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#111827' }}>{o.nome_falecido}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>{o.data_obito}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{o.cemiterio}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#0369a1', 'font-weight': 'bold' }}>
                    {o.quadra_lote}
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

export default GestaoCemiteriosLuto;
