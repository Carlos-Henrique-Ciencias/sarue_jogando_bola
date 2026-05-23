import { Component, createSignal, createEffect } from 'solid-js';

const GestaoFrotasTransito: Component = () => {
  const [veiculos, setVeiculos] = createSignal([]);
  const [placa, setPlaca] = createSignal('');
  const [modelo, setModelo] = createSignal('');
  const [departamento, setDepartamento] = createSignal('Saúde (Ambulância)');
  const [km, setKm] = createSignal('0');

  const carregarVeiculos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/frotas/veiculos');
      if (res.ok) setVeiculos(await res.json());
    } catch (err) {
      console.error("Erro ao carregar frota:", err);
    }
  };

  createEffect(() => { carregarVeiculos(); });

  const registarViatura = async (e: Event) => {
    e.preventDefault();
    if (!placa() || !modelo() || !km()) {
      return alert('Placa, modelo e quilometragem são obrigatórios!');
    }

    try {
      const res = await fetch('http://localhost:3000/api/frotas/veiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placa: placa().toUpperCase(),
          modelo: modelo(),
          departamento: departamento(),
          quilometragem: parseFloat(km())
        })
      });

      if (res.ok) {
        alert('Viatura adicionada com sucesso à frota municipal!');
        setPlaca(''); setModelo(''); setKm('0');
        carregarVeiculos();
      } else if (res.status === 409) {
        alert('Conflito: Já existe um veículo com esta placa na base de dados.');
      }
    } catch (err) {
      alert('Falha ao comunicar com o centro de logística.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1d4ed8', 'margin-top': 0 }}>🚓 Módulo 24 - Gestão de Frotas e Trânsito</h2>
      <p style={{ color: '#4b5563' }}>Controlo absoluto de viaturas oficiais, alocação departamental e monitorização de quilometragem.</p>

      {/* Formulário de Registo de Viatura */}
      <form onSubmit={registarViatura} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '600px', 'margin-bottom': '30px', padding: '15px', border: '1px solid #93c5fd', 'border-radius': '6px', background: '#eff6ff' }}>
        <strong style={{ color: '#1e40af' }}>Registar Nova Viatura Oficial</strong>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Placa do Veículo</label>
            <input type="text" value={placa()} onInput={(e) => setPlaca(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px', 'text-transform': 'uppercase' }} placeholder="ABC-1234" maxLength="8" />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Modelo / Marca</label>
            <input type="text" value={modelo()} onInput={(e) => setModelo(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: Chevrolet Duster 1.6" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Departamento Vinculado</label>
            <select value={departamento()} onChange={(e) => setDepartamento(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="Saúde (Ambulância)">Secretaria de Saúde (Ambulância)</option>
              <option value="Guarda Municipal">Guarda Municipal (Patrulha)</option>
              <option value="Obras e Zeladoria">Obras e Zeladoria (Camião/Máquina)</option>
              <option value="Gabinete Executivo">Gabinete Executivo</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>KM Inicial</label>
            <input type="number" step="0.1" value={km()} onInput={(e) => setKm(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
          </div>
        </div>

        <button type="submit" style={{ background: '#1d4ed8', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Incorporar à Frota
        </button>
      </form>

      {/* Tabela de Viaturas */}
      <h3>Painel de Logística da Frota</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Placa</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Viatura</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Departamento</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Quilometragem</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Status Operacional</th>
            </tr>
          </thead>
          <tbody>
            {veiculos().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhuma viatura registada no pátio municipal.</td>
              </tr>
            ) : (
              veiculos().map((v: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-family': 'monospace', 'font-weight': 'bold', color: '#111827' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 6px', 'border-radius': '4px', display: 'inline-block' }}>
                      {v.placa}
                    </div>
                  </td>
                  <td style={{ padding: '10px', color: '#4b5563', 'font-weight': '500' }}>{v.modelo}</td>
                  <td style={{ padding: '10px', color: '#1d4ed8' }}>{v.departamento}</td>
                  <td style={{ padding: '10px', color: '#6b7280' }}>
                    {v.quilometragem.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} km
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: v.status === 'DISPONIVEL' ? '#dcfce7' : '#fee2e2', color: v.status === 'DISPONIVEL' ? '#14532d' : '#991b1b', padding: '4px 8px', 'border-radius': '12px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {v.status.replace('_', ' ')}
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

export default GestaoFrotasTransito;
