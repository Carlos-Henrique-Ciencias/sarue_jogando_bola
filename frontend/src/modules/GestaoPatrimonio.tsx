import { Component, createSignal, createEffect } from 'solid-js';

const GestaoPatrimonio: Component = () => {
  const [bens, setBens] = createSignal([]);
  const [tombamento, setTombamento] = createSignal('');
  const [descricao, setDescricao] = createSignal('');
  const [valor, setValor] = createSignal('');
  const [setor, setSetor] = createSignal('Secretaria de Saúde');

  const carregarBens = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/patrimonio/bens');
      if (res.ok) setBens(await res.json());
    } catch (err) {
      console.error("Erro ao carregar patrimônio:", err);
    }
  };

  createEffect(() => { carregarBens(); });

  const tombarBem = async (e: Event) => {
    e.preventDefault();
    if (!tombamento() || !descricao() || !valor()) return alert('Preencha os dados de registro do bem!');

    try {
      const res = await fetch('http://localhost:3000/api/patrimonio/bens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_tombamento: tombamento(),
          descricao: descricao(),
          valor_aquisicao: parseFloat(valor()),
          setor_alocacao: setor()
        })
      });

      if (res.ok) {
        alert('Bem físico tombado e adicionado ao acervo municipal!');
        setTombamento(''); setDescricao(''); setValor('');
        carregarBens();
      } else if (res.status === 409) {
        alert('Atenção: Este código de tombamento já existe em outro bem!');
      }
    } catch (err) {
      alert('Falha ao conectar ao banco de dados patrimonial.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#854d0e', 'margin-top': 0 }}>🏢 Módulo 14 - Gestão de Patrimônio</h2>
      <p style={{ color: '#4b5563' }}>Inventário, Tombamento e Controle de Bens Móveis e Imóveis da Administração Pública.</p>

      {/* Formulário de Tombamento */}
      <form onSubmit={tombarBem} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #fde047', 'border-radius': '6px', background: '#fefce8' }}>
        <strong style={{ color: '#713f12' }}>Tombar Novo Bem (Físico/Imóvel)</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Plaqueta / Cód. Tombamento</label>
            <input type="text" value={tombamento()} onInput={(e) => setTombamento(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-family': 'monospace' }} placeholder="Ex: TMB-8472" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor de Aquisição (R$)</label>
            <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descrição do Bem (Marca/Modelo/Chassi)</label>
          <input type="text" value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Veículo Renault Kwid 2026 Branca Placa ABC-1234" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Setor de Alocação Atual</label>
          <select value={setor()} onChange={(e) => setSetor(e.currentTarget.value)} style={{ padding: '8px', width: '98%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
            <option value="Secretaria de Saúde">Secretaria Municipal de Saúde (SMS)</option>
            <option value="Secretaria de Educação">Secretaria de Educação (SEMED)</option>
            <option value="Guarda Municipal">Guarda Municipal / Segurança</option>
            <option value="Gabinete do Prefeito">Gabinete do Prefeito</option>
          </select>
        </div>

        <button type="submit" style={{ background: '#ca8a04', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Registrar e Tombar
        </button>
      </form>

      {/* Tabela de Patrimônio */}
      <h3>Inventário Geral de Ativos</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tombamento</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Descrição</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Alocação</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Histórico</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Situação</th>
            </tr>
          </thead>
          <tbody>
            {bens().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum ativo imobilizado registrado no município.</td>
              </tr>
            ) : (
              bens().map((b: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold' }}>{b.codigo_tombamento}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{b.descricao}</td>
                  <td style={{ padding: '10px', color: '#0369a1', 'font-weight': '500' }}>{b.setor_alocacao}</td>
                  <td style={{ padding: '10px', color: '#16a34a' }}>
                    R$ {b.valor_aquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {b.situacao}
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

export default GestaoPatrimonio;
