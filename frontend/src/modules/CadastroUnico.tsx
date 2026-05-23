import { Component, createSignal, createEffect } from 'solid-js';

const CadastroUnico: Component = () => {
  const [pessoas, setPessoas] = createSignal([]);
  const [nome, setNome] = createSignal('');
  const [cpf, setCpf] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [perfil, setPerfil] = createSignal('Geral'); // Chave seletora de destino

  const carregarPessoas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/pessoas');
      if (res.ok) setPessoas(await res.json());
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  createEffect(() => { carregarPessoas(); });

  const enviarAoDestino = async (e: Event) => {
    e.preventDefault();
    if (!nome() || !cpf()) return alert('Campos obrigatórios ausentes!');

    try {
      const res = await fetch('http://localhost:3000/api/pessoas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome(),
          cpf_cnpj: cpf(),
          tipo_pessoa: 'PF',
          email: email() || null,
          perfil: perfil()
        })
      });

      if (res.ok) {
        alert(`Sucesso: Registro direcionado para o ecossistema de [${perfil()}]!`);
        setNome(''); setCpf(''); setEmail('');
        carregarPessoas();
      } else {
        alert('Erro ao processar. CPF duplicado.');
      }
    } catch (err) {
      alert('Backend indisponível.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', 'border-radius': '8px', 'box-shadow': '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#1e3a8a', 'margin-top': 0 }}>👤 Zona de Cadastro Único Municipal</h2>
      <p style={{ color: '#4b5563' }}>Insira os dados e selecione o destino correto para roteamento transacional do cidadão.</p>

      <form onSubmit={enviarAoDestino} style={{ display: 'flex', gap: '15px', 'flex-wrap': 'wrap', 'align-items': 'flex-end', 'margin-bottom': '25px' }}>
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600' }}>Nome Completo</label>
          <input type="text" value={nome()} onInput={(e) => setNome(e.currentTarget.value)} style={{ padding: '10px', 'border-radius': '4px', border: '1px solid #d1d5db', width: '250px' }} placeholder="Nome do Cidadão" />
        </div>
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600' }}>CPF</label>
          <input type="text" value={cpf()} onInput={(e) => setCpf(e.currentTarget.value)} style={{ padding: '10px', 'border-radius': '4px', border: '1px solid #d1d5db', width: '160px' }} placeholder="Apenas números" maxLength={14} />
        </div>
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600' }}>E-mail</label>
          <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} style={{ padding: '10px', 'border-radius': '4px', border: '1px solid #d1d5db', width: '220px' }} placeholder="parceiro@gov.br" />
        </div>
        <div>
          <label style={{ display: 'block', 'font-size': '0.85rem', 'font-weight': '600', color: '#dc2626' }}>🎯 Chave Seletora de Destino</label>
          <select value={perfil()} onChange={(e) => setPerfil(e.currentTarget.value)} style={{ padding: '10px', 'border-radius': '4px', border: '1px solid #dc2626', background: '#fef2f2', 'font-weight': 'bold', cursor: 'pointer' }}>
            <option value="Geral">Cidadão Comum (Geral)</option>
            <option value="Paciente">Paciente (Módulo Saúde)</option>
            <option value="Estudante">Estudante (Módulo Educação)</option>
            <option value="Servidor">Servidor Público (Módulo Folha)</option>
            <option value="Fornecedor">Fornecedor (Módulo Compras)</option>
          </select>
        </div>
        <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '11px 25px', 'border-radius': '4px', 'font-weight': 'bold', cursor: 'pointer' }}>
          Processar Registro
        </button>
      </form>

      <div style={{ 'overflow-x': 'auto' }}>
        <table style={{ width: '100%', 'border-collapse': 'collapse', 'font-size': '0.9rem' }}>
          <thead>
            <tr style={{ 'background-color': '#f3f4f6', 'text-align': 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Nome</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>CPF</th>
              <th style={{ padding: '10px', border: '1px solid #e5e7eb' }}>Destino / Perfil Atribuído</th>
            </tr>
          </thead>
          <tbody>
            {pessoas().map((p: any) => (
              <tr style={{ 'border-bottom': '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', 'font-weight': '500' }}>{p.nome}</td>
                <td style={{ padding: '10px' }}>{p.cpf_cnpj}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ background: p.perfil !== 'Geral' ? '#dcfce7' : '#f3f4f6', color: p.perfil !== 'Geral' ? '#166534' : '#374151', padding: '4px 10px', 'border-radius': '12px', 'font-size': '0.8rem', 'font-weight': 'bold' }}>
                    {p.perfil}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CadastroUnico;
