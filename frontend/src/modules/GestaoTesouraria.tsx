import { Component, createSignal, createEffect } from 'solid-js';

const GestaoTesouraria: Component = () => {
  const [lancamentos, setLancamentos] = createSignal([]);
  const [conta, setConta] = createSignal('Banco do Brasil - Conta Movimento');
  const [tipo, setTipo] = createSignal('ENTRADA');
  const [valor, setValor] = createSignal('');
  const [descricao, setDescricao] = createSignal('');

  const carregarLancamentos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tesouraria/lancamentos');
      if (res.ok) setLancamentos(await res.json());
    } catch (err) {
      console.error("Erro ao buscar fluxo de caixa:", err);
    }
  };

  createEffect(() => { carregarLancamentos(); });

  const saldoTotal = () => {
    return lancamentos().reduce((acc, current: any) => {
      return current.tipo === 'ENTRADA' ? acc + current.valor : acc - current.valor;
    }, 0);
  };

  const executarLancamento = async (e: Event) => {
    e.preventDefault();
    if (!valor() || !descricao()) return alert('Insira a descrição e o valor do fluxo financeiro!');

    try {
      const res = await fetch('http://localhost:3000/api/tesouraria/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conta_bancaria: conta(),
          tipo: tipo(),
          valor: parseFloat(valor()),
          descricao: descricao()
        })
      });

      if (res.ok) {
        alert('Lançamento financeiro processado com sucesso!');
        setDescricao(''); setValor('');
        carregarLancamentos();
      }
    } catch (err) {
      alert('Falha ao conectar ao banco da Tesouraria.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#047857', 'margin-top': 0 }}>💰 Módulo 09 - Gestão de Tesouraria e Caixa</h2>
      <p style={{ color: '#4b5563' }}>Controle de Fluxo de Caixa Real, Saldos Bancários Oficiais e Conciliação Financeira.</p>

      {/* Card de Saldo */}
      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '15px', 'border-radius': '6px', 'margin-bottom': '25px', 'max-width': '300px' }}>
        <span style={{ 'font-size': '0.85rem', color: '#065f46', 'font-weight': 'bold' }}>SALDO EM CONTA CONSOLIDADO</span>
        <h2 style={{ margin: '5px 0 0 0', color: saldoTotal() >= 0 ? '#047857' : '#b91c1c' }}>
          R$ {saldoTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Formulário de Movimentação */}
      <form onSubmit={executarLancamento} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '550px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #a7f3d0', 'border-radius': '6px', background: '#f0fdf4' }}>
        <strong style={{ color: '#065f46' }}>Efetuar Lançamento de Caixa</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Conta Bancária Vinculada</label>
          <select value={conta()} onChange={(e) => setConta(e.currentTarget.value)} style={{ padding: '8px', width: '98%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
            <option value="Banco do Brasil - Conta Movimento">Banco do Brasil - Conta Movimento</option>
            <option value="Caixa Econômica - Arrecadação">Caixa Econômica - Arrecadação</option>
            <option value="Sicoob - Convênios">Sicoob - Convênios</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Tipo de Operação</label>
            <select value={tipo()} onChange={(e) => setTipo(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-weight': 'bold' }}>
              <option value="ENTRADA" style={{ color: '#16a34a' }}>ENTRADA (+) </option>
              <option value="SAIDA" style={{ color: '#dc2626' }}>SAÍDA (-)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor do Lançamento (R$)</label>
            <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descrição da Transação</label>
          <input type="text" value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Repasse ICMS Estado / Pagamento Fornecedor Combustível" />
        </div>

        <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Confirmar Movimentação Bancária
        </button>
      </form>

      {/* Extrato Eletrônico */}
      <h3>Extrato de Lançamentos de Caixa</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Conta</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Descrição</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tipo</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Conciliação</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum fluxo financeiro processado nas contas públicas hoje.</td>
              </tr>
            ) : (
              lancamentos().map((l: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', color: '#4b5563', 'font-size': '0.85rem' }}>{l.conta_bancaria}</td>
                  <td style={{ padding: '10px', 'font-weight': '500' }}>{l.descricao}</td>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: l.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626' }}>{l.tipo}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: l.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626' }}>
                    {l.tipo === 'ENTRADA' ? '+' : '-'} R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: l.conciliado ? '#dcfce7' : '#fee2e2', color: l.conciliado ? '#14532d' : '#991b1b', padding: '2px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {l.conciliado ? 'CONCILIADO' : 'PENDENTE'}
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

export default GestaoTesouraria;
