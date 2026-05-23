import { Component, createSignal, createEffect } from 'solid-js';

const PortalInstitucional: Component = () => {
  const [noticias, setNoticias] = createSignal([]);
  const [titulo, setTitulo] = createSignal('');
  const [resumo, setResumo] = createSignal('');
  const [conteudo, setConteudo] = createSignal('');

  const carregarNoticias = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/portal/noticias');
      if (res.ok) setNoticias(await res.json());
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
    }
  };

  createEffect(() => { carregarNoticias(); });

  const publicar = async (e: Event) => {
    e.preventDefault();
    if (!titulo() || !resumo() || !conteudo()) {
      return alert('Preencha os campos editoriais para publicar a matéria.');
    }

    try {
      const res = await fetch('http://localhost:3000/api/portal/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo(),
          resumo: resumo(),
          conteudo: conteudo()
        })
      });

      if (res.ok) {
        alert('Publicação enviada para o ambiente de produção do portal!');
        setTitulo(''); setResumo(''); setConteudo('');
        carregarNoticias();
      }
    } catch (err) {
      alert('Falha ao acionar o CMS do Portal Institucional.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#0f766e', 'margin-top': 0 }}>📰 Módulo 18 - Portal Institucional (Website)</h2>
      <p style={{ color: '#4b5563' }}>Painel de Gestão de Conteúdo (CMS) para publicações, editais, notícias e comunicados à população.</p>

      {/* Editor do CMS */}
      <form onSubmit={publicar} style={{ display: 'flex', 'flex-direction': 'column', gap: '15px', 'max-width': '650px', 'margin-bottom': '40px', padding: '20px', border: '1px solid #5eead4', 'border-radius': '6px', background: '#f0fdfa' }}>
        <strong style={{ color: '#115e59' }}>Redigir Nova Publicação Pública</strong>
        
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Título da Matéria</label>
          <input type="text" value={titulo()} onInput={(e) => setTitulo(e.currentTarget.value)} style={{ padding: '10px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px', 'font-size': '1.05rem' }} placeholder="Insira o título de destaque" />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Resumo (Linha Fina)</label>
          <input type="text" value={resumo()} onInput={(e) => setResumo(e.currentTarget.value)} style={{ padding: '8px', width: '96%', border: '1px solid #d1d5db', 'border-radius': '4px' }} placeholder="Texto curto de apoio..." />
        </div>

        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', 'margin-bottom': '5px' }}>Conteúdo Completo</label>
          <textarea value={conteudo()} onInput={(e) => setConteudo(e.currentTarget.value)} style={{ padding: '10px', width: '96%', height: '120px', border: '1px solid #d1d5db', 'border-radius': '4px', resize: 'vertical' }} placeholder="Corpo da notícia oficial..." />
        </div>

        <button type="submit" style={{ background: '#0f766e', color: '#fff', border: 'none', padding: '12px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer', 'font-size': '1rem' }}>
          Publicar no Website
        </button>
      </form>

      {/* Visão do Cidadão (Simulação) */}
      <h3 style={{ 'border-bottom': '2px solid #e5e7eb', 'padding-bottom': '10px', color: '#374151' }}>Últimas Notícias (Visão Cidadão)</h3>
      <div style={{ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {noticias().length === 0 ? (
          <p style={{ color: '#9ca3af', 'font-style': 'italic' }}>Nenhum conteúdo divulgado recentemente.</p>
        ) : (
          noticias().map((n: any) => (
            <div style={{ border: '1px solid #e5e7eb', 'border-radius': '8px', padding: '15px', 'box-shadow': '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ color: '#111827', margin: '0 0 10px 0' }}>{n.titulo}</h4>
              <p style={{ color: '#6b7280', 'font-size': '0.9rem', margin: '0 0 15px 0', 'font-style': 'italic' }}>{n.resumo}</p>
              <p style={{ color: '#374151', 'font-size': '0.95rem', 'line-height': '1.5', margin: '0 0 15px 0' }}>
                {n.conteudo.length > 100 ? n.conteudo.substring(0, 100) + '...' : n.conteudo}
              </p>
              <div style={{ display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'border-top': '1px solid #f3f4f6', 'padding-top': '10px' }}>
                <span style={{ 'font-size': '0.75rem', color: '#9ca3af', 'font-weight': 'bold' }}>{n.autor}</span>
                <span style={{ 'font-size': '0.75rem', color: '#0f766e', cursor: 'pointer', 'font-weight': 'bold' }}>Ler mais ➔</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PortalInstitucional;
