import { Component, createSignal, createEffect } from 'solid-js';

const GestaoFolhaPagamento: Component = () => {
  const [folhas, setFolhas] = createSignal([]);
  const [nome, setNome] = createSignal('');
  const [matricula, setMatricula] = createSignal('');
  const [mes, setMes] = createSignal('05/2026');
  const [bruto, setBruto] = createSignal('');
  const [descontos, setDescontos] = createSignal('');

  const carregarFolhas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/folha/contracheques');
      if (res.ok) setFolhas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar folha:", err);
    }
  };

  createEffect(() => { carregarFolhas(); });

  const processarFolha = async (e: Event) => {
    e.preventDefault();
    if (!nome() || !matricula() || !bruto() || !descontos()) return alert('Preencha as métricas financeiras do servidor!');

    try {
      const res = await fetch('http://localhost:3000/api/folha/contracheques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servidor_nome: nome(),
          matricula: matricula(),
          mes_referencia: mes(),
          salario_bruto: parseFloat(bruto()),
          descontos: parseFloat(descontos())
        })
      });

      if (res.ok) {
        alert('Contracheque gerado! Salário líquido calculado no motor Rust.');
        setNome(''); setMatricula(''); setBruto(''); setDescontos('');
        carregarFolhas();
      } else if (res.status === 409) {
        alert('Conflito: A folha deste servidor já foi fechada para este mês!');
      } else {
        alert('Erro: Verifique se os descontos ultrapassam o salário bruto.');
      }
    } catch (err) {
      alert('Falha crítica no motor de RH.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0f766e', 'margin-top': 0 }}>👥 Módulo 11 - Gestão de Folha de Pagamento</h2>
      <p style={{ color: '#4b5563' }}>Processamento de vencimentos, bloqueios de margem consignável e cálculo de descontos oficiais.</p>

      {/* Formulário de Processamento */}
      <form onSubmit={processarFolha} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #99f6e4', 'border-radius': '6px', background: '#f0fdfa' }}>
        <strong style={{ color: '#115e59' }}>Processar Contracheque Individual</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Servidor</label>
            <input type="text" value={nome()} onInput={(e) => setNome(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Nome Completo" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Matrícula</label>
            <input type="text" value={matricula()} onInput={(e) => setMatricula(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 99823" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Mês/Ano Ref.</label>
            <input type="text" value={mes()} onInput={(e) => setMes(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Proventos (R$)</label>
            <input type="number" step="0.01" value={bruto()} onInput={(e) => setBruto(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Descontos (R$)</label>
            <input type="number" step="0.01" value={descontos()} onInput={(e) => setDescontos(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="0.00" />
          </div>
        </div>

        <button type="submit" style={{ background: '#0f766e', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Homologar e Calcular Líquido
        </button>
      </form>

      {/* Relatório de Folha */}
      <h3>Demonstrativo de Folha Processada</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Matrícula</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Servidor</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Mês Ref.</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Bruto</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Descontos</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', background: '#ecfdf5', color: '#065f46' }}>Líquido a Pagar</th>
            </tr>
          </thead>
          <tbody>
            {folhas().length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum cálculo de folha fechado.</td>
              </tr>
            ) : (
              folhas().map((f: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#4b5563' }}>{f.matricula}</td>
                  <td style={{ padding: '10px' }}>{f.servidor_nome}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>{f.mes_referencia}</td>
                  <td style={{ padding: '10px', color: '#0369a1' }}>R$ {f.salario_bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '10px', color: '#dc2626' }}>R$ {f.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '10px', 'font-weight': 'bold', background: '#f0fdf4', color: '#16a34a' }}>
                    R$ {f.salario_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

export default GestaoFolhaPagamento;
