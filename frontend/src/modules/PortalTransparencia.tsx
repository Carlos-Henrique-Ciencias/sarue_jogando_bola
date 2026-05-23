import { Component, createSignal, createEffect } from 'solid-js';

const PortalTransparencia: Component = () => {
  const [relatorios, setRelatorios] = createSignal([]);
  const [titulo, setTitulo] = createSignal('');
  const [categoria, setCategoria] = createSignal('RREO');
  const [exercicio, setExercicio] = createSignal('2026');
  const [link, setLink] = createSignal('');

  const carregarRelatorios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/transparencia/relatorios');
      if (res.ok) setRelatorios(await res.json());
    } catch (err) {
      console.error("Erro ao carregar Portal da Transparência:", err);
    }
  };

  createEffect(() => { carregarRelatorios(); });

  const publicar = async (e: Event) => {
    e.preventDefault();
    if (!titulo() || !link()) return alert('Informe o título e o link/URI do documento PDF.');

    try {
      const res = await fetch('http://localhost:3000/api/transparencia/relatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo(),
          categoria: categoria(),
          exercicio: parseInt(exercicio()),
          link_arquivo: link()
        })
      });

      if (res.ok) {
        alert('Obrigação legal cumprida. Documento disponível publicamente!');
        setTitulo(''); setLink('');
        carregarRelatorios();
      }
    } catch (err) {
      alert('Erro de conexão ao publicar no Portal.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0f766e', 'margin-top': 0 }}>🔍 Módulo 19 - Portal da Transparência</h2>
      <p style={{ color: '#4b5563' }}>Publicação em tempo real de Execução Orçamentária e cumprimento da Lei de Acesso à Informação (LAI).</p>

      {/* Formulário Administrativo (Oculto para o cidadão no mundo real) */}
      <form onSubmit={publicar} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '40px', padding: '15px', border: '1px solid #99f6e4', 'border-radius': '6px', background: '#f0fdfa' }}>
        <strong style={{ color: '#115e59' }}>Área do Contador: Publicar Relatório Oficial</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Título do Documento</label>
          <input type="text" value={titulo()} onInput={(e) => setTitulo(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Ex: 1º Bimestre - Relatório Resumido de Execução Orçamentária" />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Classificação LRF</label>
            <select value={categoria()} onChange={(e) => setCategoria(e.currentTarget.value)} style={{ padding: '8px', width: '100%', border: '1px solid #d1d5db', 'border-radius': '4px' }}>
              <option value="RREO">RREO - Relatório Resumido (Bimestral)</option>
              <option value="RGF">RGF - Relatório Gestão Fiscal (Quadrimestral)</option>
              <option value="CONTRATOS">Relação de Contratos e Aditivos</option>
              <option value="DIARIAS">Concessão de Diárias e Passagens</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Exercício</label>
            <input type="number" value={exercicio()} onInput={(e) => setExercicio(e.currentTarget.value)} style={{ padding: '8px', width: '90%', border: '1px solid #d1d5db', 'border-radius': '4px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>URI / Link do Arquivo (PDF)</label>
          <input type="text" value={link()} onInput={(e) => setLink(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-family': 'monospace' }} placeholder="https://storage.govcore.com/rreo_1bim_2026.pdf" />
        </div>

        <button type="submit" style={{ background: '#0f766e', color: '#fff', border: 'none', padding: '10px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Dar Publicidade Imediata
        </button>
      </form>

      {/* Visão do Cidadão */}
      <h3 style={{ 'border-bottom': '2px solid #e5e7eb', 'padding-bottom': '10px', color: '#374151' }}>Painel do Cidadão: Arquivos Disponíveis</h3>
      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Ano</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Categoria (LRF)</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Documento Assinado</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb', 'text-align': 'center' }}>Acesso</th>
            </tr>
          </thead>
          <tbody>
            {relatorios().length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '15px', 'text-align': 'center', color: '#9ca3af' }}>Nenhum documento anexado ao cofre da transparência.</td>
              </tr>
            ) : (
              relatorios().map((r: any) => (
                <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', 'font-weight': 'bold', color: '#374151' }}>{r.exercicio}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#ccfbf1', color: '#115e59', padding: '4px 8px', 'border-radius': '4px', 'font-size': '0.75rem', 'font-weight': 'bold' }}>
                      {r.categoria}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#4b5563' }}>{r.titulo}</td>
                  <td style={{ padding: '10px', 'text-align': 'center' }}>
                    <a href={r.link_arquivo} target="_blank" style={{ color: '#0ea5e9', 'text-decoration': 'none', 'font-weight': 'bold' }}>
                      Baixar PDF ➔
                    </a>
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

export default PortalTransparencia;
