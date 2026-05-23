import { Component, createSignal, createEffect, onCleanup } from 'solid-js';

const GestaoPontoEletronico: Component = () => {
  const [pontos, setPontos] = createSignal([]);
  const [matricula, setMatricula] = createSignal('');
  const [horaAtual, setHoraAtual] = createSignal(new Date().toLocaleTimeString());

  // Relógio digital em tempo real
  const timer = setInterval(() => setHoraAtual(new Date().toLocaleTimeString()), 1000);
  onCleanup(() => clearInterval(timer));

  const carregarPontos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/rh/ponto');
      if (res.ok) setPontos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar registros de ponto:", err);
    }
  };

  createEffect(() => { carregarPontos(); });

  const registrarPonto = async (tipo: string) => {
    if (!matricula()) return alert('Digite sua matrícula antes de bater o ponto.');

    try {
      const res = await fetch('http://localhost:3000/api/rh/ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: matricula(),
          tipo_registro: tipo
        })
      });

      if (res.ok) {
        alert(`Sucesso! Registro de [${tipo}] efetivado no sistema.`);
        setMatricula('');
        carregarPontos();
      }
    } catch (err) {
      alert('Falha na comunicação com o relógio central.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#4338ca', 'margin-top': 0 }}>⏱️ Módulo 21 - Ponto Eletrônico</h2>
      <p style={{ color: '#4b5563' }}>Terminal digital para controle de jornada de trabalho dos servidores municipais.</p>

      {/* Relógio Digital de Ponto */}
      <div style={{ display: 'flex', 'flex-direction': 'column', 'align-items': 'center', gap: '20px', 'max-width': '500px', 'margin-bottom': '40px', padding: '25px', border: '1px solid #c7d2fe', 'border-radius': '12px', background: '#e0e7ff', 'box-shadow': 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
        
        <div style={{ background: '#1e1b4b', color: '#10b981', padding: '15px 40px', 'border-radius': '8px', 'font-family': 'monospace', 'font-size': '2.5rem', 'font-weight': 'bold', 'letter-spacing': '2px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.3)' }}>
          {horaAtual()}
        </div>

        <input 
          type="text" 
          value={matricula()} 
          onInput={(e) => setMatricula(e.currentTarget.value)} 
          style={{ padding: '12px', width: '80%', border: '2px solid #a5b4fc', 'border-radius': '6px', 'font-size': '1.2rem', 'text-align': 'center' }} 
          placeholder="Digite a Matrícula" 
        />

        <div style={{ display: 'grid', 'grid-template-columns': '1fr 1fr', gap: '10px', width: '85%' }}>
          <button onClick={() => registrarPonto('ENTRADA')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px', 'border-radius': '6px', 'font-weight': 'bold', cursor: 'pointer' }}>▶ Entrada</button>
          <button onClick={() => registrarPonto('SAIDA_ALMOCO')} style={{ background: '#ca8a04', color: '#fff', border: 'none', padding: '12px', 'border-radius': '6px', 'font-weight': 'bold', cursor: 'pointer' }}>⏸ Pausa Refeição</button>
          <button onClick={() => registrarPonto('RETORNO_ALMOCO')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px', 'border-radius': '6px', 'font-weight': 'bold', cursor: 'pointer' }}>⏯ Retorno</button>
          <button onClick={() => registrarPonto('SAIDA')} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px', 'border-radius': '6px', 'font-weight': 'bold', cursor: 'pointer' }}>⏹ Saída</button>
        </div>
      </div>

      {/* Relatório de Batidas */}
      <h3 style={{ color: '#374151' }}>Últimos Registros do Sistema</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Matrícula</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Data / Hora Exata</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tipo de Batida</th>
            </tr>
          </thead>
          <tbody>
            {pontos().length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum ponto registrado hoje.</td>
              </tr>
            ) : (
              pontos().map((p: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#4b5563' }}>{p.matricula}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', color: '#374151' }}>{p.registrado_em}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      background: p.tipo_registro === 'ENTRADA' ? '#dcfce7' : p.tipo_registro === 'SAIDA' ? '#fee2e2' : '#fef9c3', 
                      color: p.tipo_registro === 'ENTRADA' ? '#14532d' : p.tipo_registro === 'SAIDA' ? '#991b1b' : '#854d0e', 
                      padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' 
                    }}>
                      {p.tipo_registro.replace('_', ' ')}
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

export default GestaoPontoEletronico;
