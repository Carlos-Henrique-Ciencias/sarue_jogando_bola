import { Component, createSignal, createEffect } from 'solid-js';

const NotaFiscalEletronicaNFSe: Component = () => {
  const [notas, setNotas] = createSignal([]);
  const [prestador, setPrestador] = createSignal('');
  const [tomador, setTomador] = createSignal('');
  const [descricao, setDescricao] = createSignal('');
  const [valor, setValor] = createSignal('');
  const [aliquota, setAliquota] = createSignal('5.0'); // Padrão municipal

  const carregarNotas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/nfse/notas');
      if (res.ok) setNotas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar NFSe:", err);
    }
  };

  createEffect(() => { carregarNotas(); });

  const emitirNota = async (e: Event) => {
    e.preventDefault();
    if (!prestador() || !tomador() || !descricao() || !valor()) {
      return alert('Preencha os dados do prestador, tomador e os valores do serviço.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/nfse/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prestador_cnpj: prestador(),
          tomador_cpf_cnpj: tomador(),
          descricao_servico: descricao(),
          valor_servico: parseFloat(valor()),
          aliquota: parseFloat(aliquota())
        })
      });

      if (res.ok) {
        alert('Nota Fiscal de Serviço (NFSe) emitida! Imposto calculado pelo motor fiscal.');
        setTomador(''); setDescricao(''); setValor('');
        carregarNotas();
      }
    } catch (err) {
      alert('Falha na comunicação com a SEFAZ Municipal.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0369a1', 'margin-top': 0 }}>📄 Módulo 16 - Nota Fiscal Eletrônica (NFSe)</h2>
      <p style={{ color: '#4b5563' }}>Emissão de notas de serviço e apuração instantânea do Imposto Sobre Serviços (ISSQN).</p>

      {/* Formulário de Emissão de NFSe */}
      <form onSubmit={emitirNota} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #bae6fd', 'border-radius': '6px', background: '#f0f9ff' }}>
        <strong style={{ color: '#0284c7' }}>Emitir Nova NFSe (Prestador)</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>CNPJ do Prestador (Sua Empresa)</label>
            <input type="text" value={prestador()} onInput={(e) => setPrestador(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="00.000.000/0001-00" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>CPF/CNPJ do Tomador (Cliente)</label>
            <input type="text" value={tomador()} onInput={(e) => setTomador(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="123.456.789-00" />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Discriminação dos Serviços Prestados</label>
          <textarea value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '8px', width: '96%', height: '60px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'none' }} placeholder="Ex: Serviços de desenvolvimento de software e manutenção de banco de dados..." />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Valor do Serviço (R$)</label>
            <input type="number" step="0.01" value={valor()} onInput={(e) => setValor(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Alíquota ISS (%)</label>
            <select value={aliquota()} onChange={(e) => setAliquota(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-weight': 'bold', color: '#dc2626' }}>
              <option value="2.0">2.0%</option>
              <option value="3.0">3.0%</option>
              <option value="4.0">4.0%</option>
              <option value="5.0">5.0%</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Transmitir e Gerar Nota Fiscal
        </button>
      </form>

      {/* Relatório de Notas Emitidas */}
      <h3>Registro de Notas Autorizadas</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nº Nota</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Prestador</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tomador</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Valor Total</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', background: '#fee2e2', color: '#991b1b' }}>ISSQN Retido</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {notas().length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhuma nota fiscal emitida nesta competência.</td>
              </tr>
            ) : (
              notas().map((n: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#0369a1' }}>#{n.numero_nota}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#4b5563' }}>{n.prestador_cnpj}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#4b5563' }}>{n.tomador_cpf_cnpj}</td>
                  <td style={{ padding: '10px', 'font-weight': '600', color: '#16a34a' }}>
                    R$ {n.valor_servico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#dc2626', background: '#fef2f2' }}>
                    R$ {n.valor_issqn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#dcfce7', color: '#14532d', padding: '4px 8px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {n.status}
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

export default NotaFiscalEletronicaNFSe;
