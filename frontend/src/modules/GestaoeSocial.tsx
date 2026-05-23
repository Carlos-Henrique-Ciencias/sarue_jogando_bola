import { Component, createSignal, createEffect } from 'solid-js';

const GestaoeSocial: Component = () => {
  const [eventos, setEventos] = createSignal([]);
  const [matricula, setMatricula] = createSignal('');
  const [tipo, setTipo] = createSignal('S-1200 (Remuneração)');

  const carregarEventos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/esocial/eventos');
      if (res.ok) setEventos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar fila do e-Social:", err);
    }
  };

  createEffect(() => { carregarEventos(); });

  const gerarXml = async (e: Event) => {
    e.preventDefault();
    if (!matricula()) return alert('Informe a matrícula do servidor base para o evento.');

    try {
      const res = await fetch('http://localhost:3000/api/esocial/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula: matricula(),
          tipo_evento: tipo()
        })
      });

      if (res.ok) {
        alert('Carga XML gerada e incluída na fila de transmissão.');
        setMatricula('');
        carregarEventos();
      }
    } catch (err) {
      alert('Falha ao acionar motor de estruturação XML.');
    }
  };

  const transmitirGovBr = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/esocial/eventos/${id}/transmitir`, { method: 'PUT' });
      if (res.ok) {
        alert('Comunicação estabelecida. Lote enviado à Receita Federal!');
        carregarEventos();
      } else {
        alert('Este lote já foi processado ou está travado.');
      }
    } catch (err) {
      alert('Timeout na conexão com o Serpro/Gov.br.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0369a1', 'margin-top': 0 }}>📡 Módulo 13 - Gestão do e-Social</h2>
      <p style={{ color: '#4b5563' }}>Fila assíncrona de estruturação XML e mensageria oficial ICP-Brasil para a Receita Federal.</p>

      {/* Gerador de Carga */}
      <form onSubmit={gerarXml} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '550px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #bae6fd', 'border-radius': '6px', background: '#f0f9ff' }}>
        <strong style={{ color: '#0284c7' }}>Estruturar Nova Carga de Evento</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Tipo Sócio-Trabalhista</label>
            <select value={tipo()} onChange={(e) => setTipo(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="S-2200 (Admissão)">S-2200 (Admissão)</option>
              <option value="S-1200 (Remuneração)">S-1200 (Remuneração)</option>
              <option value="S-2299 (Desligamento)">S-2299 (Desligamento)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Matrícula Alvo</label>
            <input type="text" value={matricula()} onInput={(e) => setMatricula(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 99823" />
          </div>
        </div>

        <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Gerar Payload XML
        </button>
      </form>

      {/* Painel de Transmissão */}
      <h3>Fila de Mensageria (MOCK GOV.BR)</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Matrícula</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Evento</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Snapshot XML</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status Receita</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', 'text-align': 'center' }}>Ação ICP-Brasil</th>
            </tr>
          </thead>
          <tbody>
            {eventos().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Fila vazia. Nenhum lote pendente de envio.</td>
              </tr>
            ) : (
              eventos().map((ev: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold' }}>{ev.matricula}</td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{ev.tipo_evento}</td>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-size': '0.75rem', color: '#9ca3af' }}>
                    {ev.xml_gerado.substring(0, 25)}...
                  </td>
                  <td style={{ padding: '10px' }}>
                    {ev.status === 'AGUARDANDO_ENVIO' ? (
                      <span style={{ background: '#fef08a', color: '#854d0e', padding: '4px 8px', 'border-radius': '4px', 'font-weight': 'bold', 'font-size': '0.75rem' }}>NA FILA</span>
                    ) : (
                      <div style={{ display: 'flex', 'flex-direction': 'column' }}>
                        <span style={{ color: '#16a34a', 'font-weight': 'bold' }}>✓ RECIBO OFICIAL</span>
                        <span style={{ 'font-family': 'monospace', 'font-size': '0.75rem', color: '#6b7280' }}>{ev.protocolo_retorno}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px', 'text-align': 'center' }}>
                    {ev.status === 'AGUARDANDO_ENVIO' && (
                      <button onClick={() => transmitirGovBr(ev.id)} style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '6px 12px', 'border-radius': '4px', cursor: 'pointer', 'font-size': '0.8rem' }}>
                        Transmitir Lote
                      </button>
                    )}
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

export default GestaoeSocial;
