import { Component, createSignal } from 'solid-js';

// Importação dos 24 Módulos
import GestaoContabilFinanceira from './modules/GestaoContabilFinanceira';
import PlanoPlurianualPPA from './modules/PlanoPlurianualPPA';
import LeisDiretrizesOrcamentariasLDO from './modules/LeisDiretrizesOrcamentariasLDO';
import LeiOrcamentariaAnualLOA from './modules/LeiOrcamentariaAnualLOA';
import GestaoConveniosParcerias from './modules/GestaoConveniosParcerias';
import GestaoComprasLicitacoes from './modules/GestaoComprasLicitacoes';
import GestaoDividaAtiva from './modules/GestaoDividaAtiva';
import GestaoTesouraria from './modules/GestaoTesouraria';
import GestaoControleInterno from './modules/GestaoControleInterno';
import GestaoFolhaPagamento from './modules/GestaoFolhaPagamento';
import PortalServidorMunicipal from './modules/PortalServidorMunicipal';
import GestaoeSocial from './modules/GestaoeSocial';
import GestaoPatrimonio from './modules/GestaoPatrimonio';
import GestaoTributosMunicipais from './modules/GestaoTributosMunicipais';
import NotaFiscalEletronicaNFSe from './modules/NotaFiscalEletronicaNFSe';
import GestaoFornecimentoAgua from './modules/GestaoFornecimentoAgua';
import PortalInstitucional from './modules/PortalInstitucional';
import PortalTransparencia from './modules/PortalTransparencia';
import AplicativoCidadao from './modules/AplicativoCidadao';
import GestaoPontoEletronico from './modules/GestaoPontoEletronico';
import ProtocoloDigitalProcessos from './modules/ProtocoloDigitalProcessos';
import GestaoCemiteriosLuto from './modules/GestaoCemiteriosLuto';
import GestaoFrotasTransito from './modules/GestaoFrotasTransito';

const ModuloEmConstrucao = () => <div style={{ padding: '20px' }}><h2>Módulo em Integração</h2></div>;

const App: Component = () => {
  const [moduloAtivo, setModuloAtivo] = createSignal<number | null>(null);

  const modulos = [
    { id: 1, num: '01', titulo: 'Cadastro Único (Cidadão/Empresa)', componente: <ModuloEmConstrucao /> },
    { id: 2, num: '02', titulo: 'Gestão Contábil e Financeira', componente: <GestaoContabilFinanceira /> },
    { id: 3, num: '03', titulo: 'Plano Plurianual (PPA)', componente: <PlanoPlurianualPPA /> },
    { id: 4, num: '04', titulo: 'Diretrizes Orçamentárias (LDO)', componente: <LeisDiretrizesOrcamentariasLDO /> },
    { id: 5, num: '05', titulo: 'Lei Orçamentária Anual (LOA)', componente: <LeiOrcamentariaAnualLOA /> },
    { id: 6, num: '06', titulo: 'Gestão de Convênios e Parcerias', componente: <GestaoConveniosParcerias /> },
    { id: 7, num: '07', titulo: 'Gestão de Compras e Licitações', componente: <GestaoComprasLicitacoes /> },
    { id: 8, num: '08', titulo: 'Gestão de Dívida Ativa', componente: <GestaoDividaAtiva /> },
    { id: 9, num: '09', titulo: 'Gestão de Tesouraria e Caixa', componente: <GestaoTesouraria /> },
    { id: 10, num: '10', titulo: 'Gestão de Controle Interno', componente: <GestaoControleInterno /> },
    { id: 11, num: '11', titulo: 'Gestão de Folha de Pagamento', componente: <GestaoFolhaPagamento /> },
    { id: 12, num: '12', titulo: 'Portal do Servidor Municipal', componente: <PortalServidorMunicipal /> },
    { id: 13, num: '13', titulo: 'Gestão do e-Social', componente: <GestaoeSocial /> },
    { id: 14, num: '14', titulo: 'Gestão de Patrimônio', componente: <GestaoPatrimonio /> },
    { id: 15, num: '15', titulo: 'Gestão de Tributos Municipais', componente: <GestaoTributosMunicipais /> },
    { id: 16, num: '16', titulo: 'Nota Fiscal Eletrônica (NFSe)', componente: <NotaFiscalEletronicaNFSe /> },
    { id: 17, num: '17', titulo: 'Fornecimento de Água / Saneamento', componente: <GestaoFornecimentoAgua /> },
    { id: 18, num: '18', titulo: 'Portal Institucional (Website)', componente: <PortalInstitucional /> },
    { id: 19, num: '19', titulo: 'Portal da Transparência', componente: <PortalTransparencia /> },
    { id: 20, num: '20', titulo: 'App do Cidadão (Ouvidoria)', componente: <AplicativoCidadao /> },
    { id: 21, num: '21', titulo: 'Ponto Eletrônico', componente: <GestaoPontoEletronico /> },
    { id: 22, num: '22', titulo: 'Protocolo Digital e Processos', componente: <ProtocoloDigitalProcessos /> },
    { id: 23, num: '23', titulo: 'Gestão de Cemitérios e Luto', componente: <GestaoCemiteriosLuto /> },
    { id: 24, num: '24', titulo: 'Gestão de Frotas e Trânsito', componente: <GestaoFrotasTransito /> },
  ];

  const renderizarDashboard = () => (
    <div style={{ 'max-width': '1440px', margin: '0 auto', padding: '0 0 10px 0' }}>
      
      {/* Header Expandido e Imponente */}
      <header style={{ 
        'text-align': 'center', 
        'margin-bottom': '28px',
        'padding-bottom': '16px',
        'border-bottom': '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'center', gap: '16px', 'margin-bottom': '6px' }}>
          <div style={{ 
            background: '#f0f9ff', padding: '8px 14px', 'border-radius': '8px', border: '1px solid #e0f2fe', 
            'font-size': '1.2rem', display: 'flex', 'align-items': 'center', color: '#0369a1', 'font-weight': 'bold'
          }}>
             ESTADO 🏛️
          </div>
          {/* Título Principal Crescido (de 2rem para 2.7rem) */}
          <h1 style={{ margin: 0, 'font-size': '2.7rem', 'font-weight': '800', 'letter-spacing': '-0.04em', color: '#0f172a' }}>
            GovCore <span style={{ color: '#0284c7', 'font-weight': '300' }}>ERP</span>
          </h1>
        </div>
        <p style={{ margin: 0, 'font-size': '0.85rem', color: '#94a3b8', 'font-weight': '600', 'letter-spacing': '0.1em', 'text-transform': 'uppercase' }}>
          Sistema Integrado de Gestão Pública Municipal
        </p>
      </header>

      {/* Grid Calibrada para Otimização de Altura */}
      <div style={{ 
        display: 'grid', 
        'grid-template-columns': 'repeat(auto-fill, minmax(310px, 1fr))', 
        gap: '12px', 
        padding: '0 20px' 
      }}>
        {modulos.map((mod) => (
          <div 
            onClick={() => setModuloAtivo(mod.id)}
            style={{
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              'border-radius': '6px', 
              padding: '14px 18px',
              cursor: 'pointer', 
              transition: 'all 0.15s ease-in-out', 
              'box-shadow': '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex', 
              'align-items': 'center', 
              'text-align': 'left',
              'min-height': '64px', // Cresceu um pouco para dar mais presença física
              gap: '16px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.04)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
            }}
          >
            {/* ID Numérico limpo */}
            <span style={{ 
              'font-family': 'monospace', 
              'font-size': '1.15rem', 
              'font-weight': '700', 
              color: '#0284c7',
              background: '#f0f9ff',
              padding: '6px 10px',
              'border-radius': '4px',
              'text-align': 'center'
            }}>
              {mod.num}
            </span>

            {/* Texto do Módulo em Maiúsculo e encorpado */}
            <span style={{ 
              color: '#334155', 
              'font-size': '0.85rem', // Ganhou o tamanho perfeito para legibilidade premium
              'font-weight': '700',
              'text-transform': 'uppercase',
              'letter-spacing': '0.02em',
              'line-height': '1.3'
            }}>
              {mod.titulo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 'font-family': 'system-ui, -apple-system, sans-serif', 'background-color': '#f8fafc', 'min-height': '100vh', padding: '15px 20px' }}>
      
      <style>{`
        .modulo-container-workflow h2, 
        .modulo-container-workflow p, 
        .modulo-container-workflow h3 {
          text-align: center !important;
        }
        .modulo-container-workflow form {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .modulo-container-workflow .card-saldo, 
        .modulo-container-workflow [style*="max-width: 300px"],
        .modulo-container-workflow [style*="max-width: 350px"] {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}</style>

      {moduloAtivo() === null ? (
        renderizarDashboard()
      ) : (
        <div style={{ 'max-width': '1200px', margin: '0 auto' }}>
          <button 
            onClick={() => setModuloAtivo(null)}
            style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', 'border-radius': '6px', 'margin-bottom': '20px', cursor: 'pointer', 'font-weight': 'bold', 'font-size': '0.85rem' }}
          >
            ⬅ Voltar ao Painel Geral
          </button>
          
          <div class="modulo-container-workflow" style={{ background: '#fff', 'border-radius': '12px', 'box-shadow': '0 10px 15px -3px rgba(0,0,0,0.05)', padding: '10px' }}>
            {modulos.find(m => m.id === moduloAtivo())?.componente}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
