// backend/src/routes.rs
use axum::{routing::{get, post, put}, Router};
use sqlx::PgPool;
use crate::handlers::{administrativo, financeiro, operacional};

pub fn criar_rotas_erp() -> Router<PgPool> {
    Router::new()
        // Administrativo Geral
        .route("/api/pessoas", post(administrativo::criar_pessoa).get(administrativo::listar_pessoas))
        .route("/api/portal/noticias", post(administrativo::publicar_noticia).get(administrativo::listar_noticias))
        .route("/api/cidadao/chamados", post(administrativo::abrir_chamado).get(administrativo::listar_chamados))
        .route("/api/protocolos", post(administrativo::abrir_protocolo).get(administrativo::listar_protocolos))
        
        // Financeiro, Orçamento e Prestação de Contas
        .route("/api/contabil/empenhos", post(financeiro::criar_empenho).get(financeiro::listar_empenhos))
        .route("/api/contabil/empenhos/:id/liquidar", put(financeiro::liquidar_empenho))
        .route("/api/contabil/empenhos/:id/pagar", put(financeiro::pagar_empenho))
        .route("/api/ppa/programas", post(financeiro::criar_programa_ppa).get(financeiro::listar_programas_ppa))
        .route("/api/ldo/diretrizes", post(financeiro::criar_diretriz_ldo).get(financeiro::listar_diretrizes_ldo))
        .route("/api/loa/dotacoes", post(financeiro::criar_dotacao_loa).get(financeiro::listar_dotacoes_loa))
        .route("/api/convenios", post(financeiro::criar_convenio).get(financeiro::listar_convenios))
        .route("/api/licitacoes/processos", post(financeiro::criar_processo).get(financeiro::listar_processos))
        .route("/api/dividas", post(financeiro::criar_divida).get(financeiro::listar_dividas))
        .route("/api/tesouraria/lancamentos", post(financeiro::criar_lancamento).get(financeiro::listar_lancamentos))
        .route("/api/auditoria/alertas", post(financeiro::criar_alerta).get(financeiro::listar_alertas))
        .route("/api/transparencia/relatorios", post(financeiro::publicar_relatorio).get(financeiro::listar_relatorios))
        
        // Operacional, Folha, Tributos e Logística
        .route("/api/folha/contracheques", post(operacional::criar_contracheque).get(operacional::listar_contracheques))
        .route("/api/servidor/:matricula/contracheques", get(operacional::buscar_contracheques_servidor))
        .route("/api/servidor/solicitacoes", post(operacional::criar_solicitacao))
        .route("/api/servidor/:matricula/solicitacoes", get(operacional::buscar_solicitacoes_servidor))
        .route("/api/esocial/eventos", post(operacional::gerar_evento_esocial).get(operacional::listar_eventos_esocial))
        .route("/api/esocial/eventos/:id/transmitir", put(operacional::transmitir_evento_esocial))
        .route("/api/rh/ponto", post(operacional::bater_ponto).get(operacional::listar_pontos))
        .route("/api/patrimonio/bens", post(operacional::criar_bem).get(operacional::listar_bens))
        .route("/api/tributos/lancamentos", post(operacional::criar_tributo).get(operacional::listar_tributos))
        .route("/api/nfse/notas", post(operacional::emitir_nfse).get(operacional::listar_nfse))
        .route("/api/agua/leituras", post(operacional::registrar_leitura).get(operacional::listar_leituras))
        .route("/api/cemiterios/obitos", post(operacional::registrar_obito).get(operacional::listar_obitos))
        .route("/api/frotas/veiculos", post(operacional::registrar_veiculo).get(operacional::listar_veiculos))
}