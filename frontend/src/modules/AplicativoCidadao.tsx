import { Component, createSignal, createEffect } from 'solid-js';

const AplicativoCidadao: Component = () => {
  const [chamados, setChamados] = createSignal([]);
  const [cpf, setCpf] = createSignal('');
  const [categoria, setCategoria] = createSignal('Iluminação Pública');
  const [descricao, setDescricao] = createSignal('');
  const [endereco, setEndereco] = createSignal('');

  const carregarChamados = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/cidadao/chamados');
      if (res.ok) setChamados(await res.json());
    } catch (err) {
      console.error("Erro ao carregar ouvidoria:", err);
    }
  };

  createEffect(() => { carregarChamados(); });

  const enviarChamado = async (e: Event) => {
    e.preventDefault();
    if (!cpf() || !descricao() || !endereco()) return alert('Preencha os detalhes da ocorrência para acionar a zeladoria.');

    try {
      const res = await fetch('http://localhost:3000/api/cidadao/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf_cidadao: cpf(),
          categoria: categoria(),
          descricao: descricao(),
          endereco: endereco()
        })
      });

      if (res.ok) {
        alert('Sua solicitação foi registrada e enviada à secretaria responsável!');
        setDescricao(''); setEndereco('');
        carregarChamados();
      }
    } catch (err) {
      alert('Falha na conexão com a central da prefeitura.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#c2410c', 'margin-top': 0 }}>📱 Módulo 20 - Aplicativo do Cidadão (Ouvidoria)</h2>
      <p style={{ color: '#4b5563' }}>Plataforma mobile/web para abertura de chamados de zeladoria urbana, tapa-buracos e iluminação.</p>

      {/* Interface Simulada do Celular do Cidadão */}
      <div style={{ display: 'flex', gap: '30px', 'flex-wrap': 'wrap' }}>
        
        <div style={{ flex: '1 1 350px' }}>
          <form onSubmit={enviarChamado} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', padding: '20px', border: '1px solid #fde047', 'border-radius': '20px', background: '#fefce8', 'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ 'text-align': 'center', 'border-bottom': '1px solid #facc15', 'padding-bottom': '10px', 'margin-bottom': '10px' }}>
              <strong style={{ color: '#a16207', 'font-size': '1.1rem' }}>Sinalizar Problema na Cidade</strong>
            </div>
            
            <div>
              <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Seu CPF</label>
              <input type="text" value={cpf()} onInput={(e) => setCpf(e.currentTarget.value)} style={{ padding: '10px', width: '94%', border: '1px solid #d1d5db', 'border-radius': '8px' }} placeholder="000.000.000-00" />
            </div>

            <div>
              <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Qual o problema?</label>
              <select value={categoria()} onChange={(e) => setCategoria(e.currentTarget.value)} style={{ padding: '10px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '8px' }}>
                <option value="Iluminação Pública">💡 Lâmpada de Poste Queimada</option>
                <option value="Pavimentação">🚧 Buraco na Via (Tapa-Buraco)</option>
                <option value="Limpeza Urbana">🗑️ Coleta de Lixo Irregular</option>
                <option value="Saneamento">💧 Vazamento de Água/Esgoto</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Endereço da Ocorrência</label>
              <input type="text" value={endereco()} onInput={(e) => setEndereco(e.currentTarget.value)} style={{ padding: '10px', width: '94%', border: '1px solid #d1d5db', 'border-radius': '8px' }} placeholder="Ex: Rua da Praia, Barra dos Coqueiros..." />
            </div>

            <div>
              <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Detalhes Adicionais</label>
              <textarea value={descricao()} onInput={(e) => setDescricao(e.currentTarget.value)} style={{ padding: '10px', width: '94%', height: '70px', border: '1px solid #d1d5db', 'border-radius': '8px', resize: 'none' }} placeholder="Descreva o problema exato..." />
            </div>

            <button type="submit" style={{ background: '#ca8a04', color: '#fff', border: 'none', padding: '12px', 'border-radius': '8px', 'font-weight': 'bold', cursor: 'pointer', 'font-size': '1rem', 'margin-top': '10px' }}>
              Enviar Solicitação
            </button>
          </form>
        </div>

        {/* Tabela de Acompanhamento (Visão da Secretaria de Obras) */}
        <div style={{ flex: '2 1 400px' }}>
          <h3 style={{ 'margin-top': 0, color: '#374151' }}>Painel da Secretaria de Obras</h3>
          <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
            <thead>
              <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Tipo</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Endereço / Local</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Relato do Cidadão</th>
                <th style={{ padding: '10px', border: '1px solid #e5e7eb', 'text-align': 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {chamados().length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum chamado de zeladoria em aberto.</td></tr>
              ) : (
                chamados().map((c: any) => (
                  <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px', 'font-weight': 'bold', color: '#a16207' }}>{c.categoria}</td>
                    <td style={{ padding: '10px', color: '#4b5563', 'font-weight': '500' }}>{c.endereco}</td>
                    <td style={{ padding: '10px', color: '#6b7280', 'font-size': '0.85rem' }}>{c.descricao}</td>
                    <td style={{ padding: '10px', 'text-align': 'center' }}>
                      <span style={{ background: '#fef08a', color: '#854d0e', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                        {c.status}
                      </span>
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

export default AplicativoCidadao;
