import { Component, createSignal } from 'solid-js';

const PortalServidorMunicipal: Component = () => {
  const [matriculaLogada, setMatriculaLogada] = createSignal('');
  const [inputMatricula, setInputMatricula] = createSignal('');
  
  const [meusContracheques, setMeusContracheques] = createSignal([]);
  const [minhasSolicitacoes, setMinhasSolicitacoes] = createSignal([]);
  
  const [tipo, setTipo] = createSignal('Férias Regulamentares');
  const [dataInicio, setDataInicio] = createSignal('');
  const [dataFim, setDataFim] = createSignal('');

  const autenticar = async (e: Event) => {
    e.preventDefault();
    if (!inputMatricula()) return alert('Insira sua matrícula para acessar o portal.');
    setMatriculaLogada(inputMatricula());
    carregarDadosServidor(inputMatricula());
  };

  const carregarDadosServidor = async (mat: string) => {
    try {
      const resContra = await fetch(`http://localhost:3000/api/servidor/${mat}/contracheques`);
      if (resContra.ok) setMeusContracheques(await resContra.json());

      const resSol = await fetch(`http://localhost:3000/api/servidor/${mat}/solicitacoes`);
      if (resSol.ok) setMinhasSolicitacoes(await resSol.json());
    } catch (err) {
      console.error("Erro ao carregar dados do portal:", err);
    }
  };

  const enviarSolicitacao = async (e: Event) => {
    e.preventDefault();
    if (!dataInicio() || !dataFim()) return alert('Defina o período da solicitação!');

    try {
      const res = await fetch('http://localhost:3000/api/servidor/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: matriculaLogada(),
          tipo_solicitacao: tipo(),
          data_inicio: dataInicio(),
          data_fim: dataFim()
        })
      });

      if (res.ok) {
        alert('Requerimento protocolado com sucesso no RH!');
        setDataInicio(''); setDataFim('');
        carregarDadosServidor(matriculaLogada());
      }
    } catch (err) {
      alert('Falha ao conectar aos servidores do município.');
    }
  };

  if (!matriculaLogada()) {
    return (
      <div style={{ background: '#fff', padding: '40px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)', 'max-width': '400px', margin: '0 auto', 'text-align': 'center' }}>
        <h2 style={{ color: '#0369a1', 'margin-top': 0 }}>🔒 Acesso ao Portal</h2>
        <p style={{ color: '#4b5563', 'margin-bottom': '20px' }}>Área restrita do Servidor Público Municipal.</p>
        <form onSubmit={autenticar} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px' }}>
          <input type="text" value={inputMatricula()} onInput={(e) => setInputMatricula(e.currentTarget.value)} style={{ padding: '12px', border: '1px solid #d1d5db', 'border-radius': '4px', 'text-align': 'center', 'font-size': '1.1rem' }} placeholder="Digite sua Matrícula" />
          <button type="submit" style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '12px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer', 'font-size': '1rem' }}>Entrar no Sistema</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'margin-bottom': '20px', 'border-bottom': '2px solid #e0f2fe', 'padding-bottom': '10px' }}>
        <h2 style={{ color: '#0369a1', margin: 0 }}>👤 Portal do Servidor</h2>
        <div>
          <span style={{ 'font-weight': 'bold', color: '#374151', 'margin-right': '15px' }}>Matrícula Ativa: {matriculaLogada()}</span>
          <button onClick={() => setMatriculaLogada('')} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '5px 10px', 'border-radius': '4px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', 'flex-wrap': 'wrap' }}>
        
        {/* Painel Esquerdo: Requerimentos */}
        <div style={{ flex: '1 1 300px' }}>
          <form onSubmit={enviarSolicitacao} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', padding: '15px', border: '1px solid #bae6fd', 'border-radius': '6px', background: '#f0f9ff' }}>
            <strong style={{ color: '#0284c7' }}>Abrir Requerimento (RH)</strong>
            
            <div>
              <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Tipo de Afastamento</label>
              <select value={tipo()} onChange={(e) => setTipo(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
                <option value="Férias Regulamentares">Férias Regulamentares</option>
                <option value="Licença Prêmio">Licença Prêmio</option>
                <option value="Atestado Médico">Atestado Médico</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Início</label>
                <input type="date" value={dataInicio()} onInput={(e) => setDataInicio(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Retorno</label>
                <input type="date" value={dataFim()} onInput={(e) => setDataFim(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
              </div>
            </div>

            <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
              Protocolar Pedido
            </button>
          </form>

          <h4 style={{ color: '#374151', 'margin-top': '25px' }}>Meus Requerimentos</h4>
          <ul style={{ padding: 0, 'list-style': 'none' }}>
            {minhasSolicitacoes().length === 0 ? <li style={{ color: '#9ca3af', 'font-size': '0.9rem' }}>Nenhum pedido efetuado.</li> : 
              minhasSolicitacoes().map((s: any) => (
                <li style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px', 'margin-bottom': '10px', 'border-radius': '4px', 'font-size': '0.85rem' }}>
                  <strong>{s.tipo_solicitacao}</strong><br/>
                  <span style={{ color: '#6b7280' }}>De {s.data_inicio} até {s.data_fim}</span><br/>
                  <span style={{ color: '#0369a1', 'font-weight': 'bold' }}>Status: {s.status}</span>
                </li>
              ))
            }
          </ul>
        </div>

        {/* Painel Direito: Contracheques */}
        <div style={{ flex: '2 1 400px' }}>
          <h3 style={{ 'margin-top': 0, color: '#374151' }}>Meus Contracheques Disponíveis</h3>
          <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
            <thead>
              <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Competência</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Rendimentos</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Descontos</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb', background: '#e0f2fe' }}>Líquido Recebido</th>
              </tr>
            </thead>
            <tbody>
              {meusContracheques().length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum recibo processado para esta matrícula.</td></tr>
              ) : (
                meusContracheques().map((c: any) => (
                  <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px', 'font-weight': 'bold', color: '#4b5563' }}>{c.mes_referencia}</td>
                    <td style={{ padding: '10px', color: '#16a34a' }}>R$ {c.salario_bruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px', color: '#dc2626' }}>R$ {c.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px', 'font-weight': 'bold', color: '#0369a1', background: '#f0f9ff' }}>
                      R$ {c.salario_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortalServidorMunicipal;
