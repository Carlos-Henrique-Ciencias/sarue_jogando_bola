use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post, put},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

// --- MODELOS CONSOLIDADOS (1 ao 23) ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Pessoa { id: String, nome: String, cpf_cnpj: String, tipo_pessoa: String, email: Option<String>, perfil: String }
#[derive(Deserialize)] struct CriarPessoaInput { nome: String, cpf_cnpj: String, tipo_pessoa: String, email: Option<String>, perfil: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Empenho { id: String, numero_empenho: String, valor: f64, historico: String, status: String }
#[derive(Deserialize)] struct CriarEmpenhoInput { numero_empenho: String, valor: f64, historico: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct PpaPrograma { id: String, nome: String, objetivo: String, teto_financeiro: f64 }
#[derive(Deserialize)] struct CriarPpaInput { nome: String, objetivo: String, teto_financeiro: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct LdoDiretriz { id: String, ano: i32, descricao: String, meta_fiscal: f64 }
#[derive(Deserialize)] struct CriarLdoInput { ano: i32, descricao: String, meta_fiscal: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct LoaDotacao { id: String, codigo: String, descricao: String, saldo_inicial: f64, saldo_atual: f64 }
#[derive(Deserialize)] struct CriarLoaInput { codigo: String, descricao: String, saldo_inicial: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Convenio { id: String, numero_convenio: String, orgao_concedente: String, valor_global: f64, valor_contrapartida: f64, status: String }
#[derive(Deserialize)] struct CriarConvenioInput { numero_convenio: String, orgao_concedente: String, valor_global: f64, valor_contrapartida: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct ProcessoLicitatorio { id: String, numero_processo: String, modalidade: String, objeto: String, valor_estimado: f64, status: String }
#[derive(Deserialize)] struct CriarProcessoInput { numero_processo: String, modalidade: String, objeto: String, valor_estimado: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Divida { id: String, contribuinte: String, numero_cda: String, valor_principal: f64, status: String }
#[derive(Deserialize)] struct CriarDividaInput { contribuinte: String, numero_cda: String, valor_principal: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Lancamento { id: String, conta_bancaria: String, tipo: String, valor: f64, descricao: String, conciliado: bool }
#[derive(Deserialize)] struct CriarLancamentoInput { conta_bancaria: String, tipo: String, valor: f64, descricao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct AlertaAuditoria { id: String, titulo: String, nivel_severidade: String, modulo_origem: String, descricao: String, resolvido: bool }
#[derive(Deserialize)] struct CriarAlertaInput { titulo: String, nivel_severidade: String, modulo_origem: String, descricao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Contracheque { id: String, servidor_nome: String, matricula: String, mes_referencia: String, salario_bruto: f64, descontos: f64, salario_liquido: f64 }
#[derive(Deserialize)] struct CriarContrachequeInput { servidor_nome: String, matricula: String, mes_referencia: String, salario_bruto: f64, descontos: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct SolicitacaoServidor { id: String, matricula: String, tipo_solicitacao: String, data_inicio: String, data_fim: String, status: String }
#[derive(Deserialize)] struct CriarSolicitacaoInput { matricula: String, tipo_solicitacao: String, data_inicio: String, data_fim: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct EventoEsocial { id: String, matricula: String, tipo_evento: String, xml_gerado: String, status: String, protocolo_retorno: Option<String> }
#[derive(Deserialize)] struct CriarEventoInput { matricula: String, tipo_evento: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct BemPatrimonial { id: String, codigo_tombamento: String, descricao: String, valor_aquisicao: f64, setor_alocacao: String, situacao: String }
#[derive(Deserialize)] struct CriarBemInput { codigo_tombamento: String, descricao: String, valor_aquisicao: f64, setor_alocacao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Tributo { id: String, contribuinte: String, tipo_tributo: String, exercicio: i32, valor: f64, status: String }
#[derive(Deserialize)] struct CriarTributoInput { contribuinte: String, tipo_tributo: String, exercicio: i32, valor: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct NotaFiscal { id: String, numero_nota: i32, prestador_cnpj: String, tomador_cpf_cnpj: String, descricao_servico: String, valor_servico: f64, aliquota: f64, valor_issqn: f64, status: String }
#[derive(Deserialize)] struct CriarNotaFiscalInput { prestador_cnpj: String, tomador_cpf_cnpj: String, descricao_servico: String, valor_servico: f64, aliquota: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct LeituraAgua { id: String, matricula_imovel: String, leitura_anterior: f64, leitura_atual: f64, consumo_m3: f64, valor_fatura: f64, status: String }
#[derive(Deserialize)] struct CriarLeituraInput { matricula_imovel: String, leitura_anterior: f64, leitura_atual: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Noticia { id: String, titulo: String, resumo: String, conteudo: String, autor: String }
#[derive(Deserialize)] struct CriarNoticiaInput { titulo: String, resumo: String, conteudo: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct RelatorioTransparencia { id: String, titulo: String, categoria: String, exercicio: i32, link_arquivo: String }
#[derive(Deserialize)] struct CriarRelatorioInput { titulo: String, categoria: String, exercicio: i32, link_arquivo: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct ChamadoCidadao { id: String, cpf_cidadao: String, categoria: String, descricao: String, endereco: String, status: String }
#[derive(Deserialize)] struct CriarChamadoInput { cpf_cidadao: String, categoria: String, descricao: String, endereco: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct RegistroPonto { id: String, matricula: String, tipo_registro: String, registrado_em: String }
#[derive(Deserialize)] struct CriarRegistroPontoInput { matricula: String, tipo_registro: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct Protocolo { id: String, numero_protocolo: String, requerente: String, assunto: String, descricao: String, status: String }
#[derive(Deserialize)] struct CriarProtocoloInput { numero_protocolo: String, requerente: String, assunto: String, descricao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] struct RegistroObito { id: String, nome_falecido: String, cpf_falecido: Option<String>, data_obito: String, cemiterio: String, quadra_lote: String, status: String }
#[derive(Deserialize)] struct CriarObitoInput { nome_falecido: String, cpf_falecido: Option<String>, data_obito: String, cemiterio: String, quadra_lote: String }

// --- MODELOS: FROTAS E TRÂNSITO (NOVO!) ---
#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct VeiculoFrota {
    id: String,
    placa: String,
    modelo: String,
    departamento: String,
    quilometragem: f64,
    status: String,
}
#[derive(Deserialize)]
struct CriarVeiculoInput {
    placa: String,
    modelo: String,
    departamento: String,
    quilometragem: f64,
}

#[tokio::main]
async fn main() {
    let pool = PgPoolOptions::new().max_connections(20)
        .connect("postgres://postgres:root@localhost:5432/govcore_erp").await.unwrap();

    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/api/pessoas", post(criar_pessoa).get(listar_pessoas))
        .route("/api/contabil/empenhos", post(criar_empenho).get(listar_empenhos))
        .route("/api/contabil/empenhos/:id/liquidar", put(liquidar_empenho))
        .route("/api/contabil/empenhos/:id/pagar", put(pagar_empenho))
        .route("/api/ppa/programas", post(criar_programa_ppa).get(listar_programas_ppa))
        .route("/api/ldo/diretrizes", post(criar_diretriz_ldo).get(listar_diretrizes_ldo))
        .route("/api/loa/dotacoes", post(criar_dotacao_loa).get(listar_dotacoes_loa))
        .route("/api/convenios", post(criar_convenio).get(listar_convenios))
        .route("/api/licitacoes/processos", post(criar_processo).get(listar_processos))
        .route("/api/dividas", post(criar_divida).get(listar_dividas))
        .route("/api/tesouraria/lancamentos", post(criar_lancamento).get(listar_lancamentos))
        .route("/api/auditoria/alertas", post(criar_alerta).get(listar_alertas))
        .route("/api/folha/contracheques", post(criar_contracheque).get(listar_contracheques))
        .route("/api/servidor/:matricula/contracheques", get(buscar_contracheques_servidor))
        .route("/api/servidor/solicitacoes", post(criar_solicitacao))
        .route("/api/servidor/:matricula/solicitacoes", get(buscar_solicitacoes_servidor))
        .route("/api/esocial/eventos", post(gerar_evento_esocial).get(listar_eventos_esocial))
        .route("/api/esocial/eventos/:id/transmitir", put(transmitir_evento_esocial))
        .route("/api/patrimonio/bens", post(criar_bem).get(listar_bens))
        .route("/api/tributos/lancamentos", post(criar_tributo).get(listar_tributos))
        .route("/api/nfse/notas", post(emitir_nfse).get(listar_nfse))
        .route("/api/agua/leituras", post(registrar_leitura).get(listar_leituras))
        .route("/api/portal/noticias", post(publicar_noticia).get(listar_noticias))
        .route("/api/transparencia/relatorios", post(publicar_relatorio).get(listar_relatorios))
        .route("/api/cidadao/chamados", post(abrir_chamado).get(listar_chamados))
        .route("/api/rh/ponto", post(bater_ponto).get(listar_pontos))
        .route("/api/protocolos", post(abrir_protocolo).get(listar_protocolos))
        .route("/api/cemiterios/obitos", post(registrar_obito).get(listar_obitos))
        // Novas Rotas de Frotas e Trânsito (Módulo 24)
        .route("/api/frotas/veiculos", post(registrar_veiculo).get(listar_veiculos))
        .layer(cors)
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("📡 SISTEMA GOVCORE COMPLETO (24 Módulos) rodando em http://{}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- HANDLERS (TODOS OS MÓDULOS 1 A 23) ---
async fn criar_pessoa(State(p): State<PgPool>, Json(b): Json<CriarPessoaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO pessoas (nome, cpf_cnpj, tipo_pessoa, email, perfil) VALUES ($1, $2, $3, $4, $5)").bind(&b.nome).bind(&b.cpf_cnpj).bind(&b.tipo_pessoa).bind(&b.email).bind(&b.perfil).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_pessoas(State(p): State<PgPool>) -> Result<Json<Vec<Pessoa>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Pessoa>("SELECT id::text, nome, cpf_cnpj, tipo_pessoa, email, perfil FROM pessoas").fetch_all(&p).await.unwrap())) }
async fn criar_empenho(State(p): State<PgPool>, Json(b): Json<CriarEmpenhoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO empenhos (numero_empenho, valor, historico) VALUES ($1, $2, $3)").bind(&b.numero_empenho).bind(b.valor).bind(&b.historico).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_empenhos(State(p): State<PgPool>) -> Result<Json<Vec<Empenho>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Empenho>("SELECT id::text, numero_empenho, valor::float8, historico, status FROM empenhos ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn liquidar_empenho(State(p): State<PgPool>, Path(id): Path<String>) -> Result<StatusCode, StatusCode> { sqlx::query("UPDATE empenhos SET status = 'LIQUIDADO' WHERE id = $1::uuid AND status = 'EMPENHADO'").bind(id).execute(&p).await.unwrap(); Ok(StatusCode::OK) }
async fn pagar_empenho(State(p): State<PgPool>, Path(id): Path<String>) -> Result<StatusCode, StatusCode> { sqlx::query("UPDATE empenhos SET status = 'PAGO' WHERE id = $1::uuid AND status = 'LIQUIDADO'").bind(id).execute(&p).await.unwrap(); Ok(StatusCode::OK) }
async fn criar_programa_ppa(State(p): State<PgPool>, Json(b): Json<CriarPpaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO ppa_programas (nome, objetivo, teto_financeiro) VALUES ($1, $2, $3)").bind(&b.nome).bind(&b.objetivo).bind(b.teto_financeiro).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_programas_ppa(State(p): State<PgPool>) -> Result<Json<Vec<PpaPrograma>>, StatusCode> { Ok(Json(sqlx::query_as::<_, PpaPrograma>("SELECT id::text, nome, objetivo, teto_financeiro::float8 FROM ppa_programas ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_diretriz_ldo(State(p): State<PgPool>, Json(b): Json<CriarLdoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO ldo_diretrizes (ano, descricao, meta_fiscal) VALUES ($1, $2, $3)").bind(b.ano).bind(&b.descricao).bind(b.meta_fiscal).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_diretrizes_ldo(State(p): State<PgPool>) -> Result<Json<Vec<LdoDiretriz>>, StatusCode> { Ok(Json(sqlx::query_as::<_, LdoDiretriz>("SELECT id::text, ano, descricao, meta_fiscal::float8 FROM ldo_diretrizes ORDER BY ano DESC, criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_dotacao_loa(State(p): State<PgPool>, Json(b): Json<CriarLoaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO loa_dotacoes (codigo, descricao, saldo_inicial, saldo_atual) VALUES ($1, $2, $3, $3)").bind(&b.codigo).bind(&b.descricao).bind(b.saldo_inicial).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_dotacoes_loa(State(p): State<PgPool>) -> Result<Json<Vec<LoaDotacao>>, StatusCode> { Ok(Json(sqlx::query_as::<_, LoaDotacao>("SELECT id::text, codigo, descricao, saldo_inicial::float8, saldo_atual::float8 FROM loa_dotacoes ORDER BY codigo ASC").fetch_all(&p).await.unwrap())) }
async fn criar_convenio(State(p): State<PgPool>, Json(b): Json<CriarConvenioInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO convenios (numero_convenio, orgao_concedente, valor_global, valor_contrapartida) VALUES ($1, $2, $3, $4)").bind(&b.numero_convenio).bind(&b.orgao_concedente).bind(b.valor_global).bind(b.valor_contrapartida).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_convenios(State(p): State<PgPool>) -> Result<Json<Vec<Convenio>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Convenio>("SELECT id::text, numero_convenio, orgao_concedente, valor_global::float8, valor_contrapartida::float8, status FROM convenios ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_processo(State(p): State<PgPool>, Json(b): Json<CriarProcessoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO processos_licitatorios (numero_processo, modalidade, objeto, valor_estimado) VALUES ($1, $2, $3, $4)").bind(&b.numero_processo).bind(&b.modalidade).bind(&b.objeto).bind(b.valor_estimado).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_processos(State(p): State<PgPool>) -> Result<Json<Vec<ProcessoLicitatorio>>, StatusCode> { Ok(Json(sqlx::query_as::<_, ProcessoLicitatorio>("SELECT id::text, numero_processo, modalidade, objeto, valor_estimado::float8, status FROM processos_licitatorios ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_divida(State(p): State<PgPool>, Json(b): Json<CriarDividaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO divida_ativa (contribuinte, numero_cda, valor_principal) VALUES ($1, $2, $3)").bind(&b.contribuinte).bind(&b.numero_cda).bind(b.valor_principal).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_dividas(State(p): State<PgPool>) -> Result<Json<Vec<Divida>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Divida>("SELECT id::text, contribuinte, numero_cda, valor_principal::float8, status FROM divida_ativa ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_lancamento(State(p): State<PgPool>, Json(b): Json<CriarLancamentoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO tesouraria_lancamentos (conta_bancaria, tipo, valor, descricao) VALUES ($1, $2, $3, $4)").bind(&b.conta_bancaria).bind(&b.tipo).bind(b.valor).bind(&b.descricao).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_lancamentos(State(p): State<PgPool>) -> Result<Json<Vec<Lancamento>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Lancamento>("SELECT id::text, conta_bancaria, tipo, valor::float8, descricao, conciliado FROM tesouraria_lancamentos ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_alerta(State(p): State<PgPool>, Json(b): Json<CriarAlertaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO controle_interno_alertas (titulo, nivel_severidade, modulo_origem, descricao) VALUES ($1, $2, $3, $4)").bind(&b.titulo).bind(&b.nivel_severidade).bind(&b.modulo_origem).bind(&b.descricao).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_alertas(State(p): State<PgPool>) -> Result<Json<Vec<AlertaAuditoria>>, StatusCode> { Ok(Json(sqlx::query_as::<_, AlertaAuditoria>("SELECT id::text, titulo, nivel_severidade, modulo_origem, descricao, resolvido FROM controle_interno_alertas ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_contracheque(State(p): State<PgPool>, Json(b): Json<CriarContrachequeInput>) -> Result<(StatusCode, Json<String>), StatusCode> { let l = b.salario_bruto - b.descontos; if l < 0.0 { return Err(StatusCode::BAD_REQUEST); } let r = sqlx::query("INSERT INTO folha_pagamento (servidor_nome, matricula, mes_referencia, salario_bruto, descontos, salario_liquido) VALUES ($1, $2, $3, $4, $5, $6)").bind(&b.servidor_nome).bind(&b.matricula).bind(&b.mes_referencia).bind(b.salario_bruto).bind(b.descontos).bind(l).execute(&p).await; match r { Ok(_) => Ok((StatusCode::CREATED, Json("Ok".to_string()))), Err(_) => Err(StatusCode::CONFLICT) } }
async fn listar_contracheques(State(p): State<PgPool>) -> Result<Json<Vec<Contracheque>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Contracheque>("SELECT id::text, servidor_nome, matricula, mes_referencia, salario_bruto::float8, descontos::float8, salario_liquido::float8 FROM folha_pagamento ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn buscar_contracheques_servidor(State(p): State<PgPool>, Path(m): Path<String>) -> Result<Json<Vec<Contracheque>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Contracheque>("SELECT id::text, servidor_nome, matricula, mes_referencia, salario_bruto::float8, descontos::float8, salario_liquido::float8 FROM folha_pagamento WHERE matricula = $1 ORDER BY mes_referencia DESC").bind(m).fetch_all(&p).await.unwrap())) }
async fn criar_solicitacao(State(p): State<PgPool>, Json(b): Json<CriarSolicitacaoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO servidor_solicitacoes (matricula, tipo_solicitacao, data_inicio, data_fim) VALUES ($1, $2, $3::date, $4::date)").bind(&b.matricula).bind(&b.tipo_solicitacao).bind(&b.data_inicio).bind(&b.data_fim).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn buscar_solicitacoes_servidor(State(p): State<PgPool>, Path(m): Path<String>) -> Result<Json<Vec<SolicitacaoServidor>>, StatusCode> { Ok(Json(sqlx::query_as::<_, SolicitacaoServidor>("SELECT id::text, matricula, tipo_solicitacao, data_inicio::text, data_fim::text, status FROM servidor_solicitacoes WHERE matricula = $1 ORDER BY criado_em DESC").bind(m).fetch_all(&p).await.unwrap())) }
async fn gerar_evento_esocial(State(p): State<PgPool>, Json(b): Json<CriarEventoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { let xml_mock = format!("<eSocial><evento tipo=\"{}\"><matricula>{}</matricula></evento></eSocial>", b.tipo_evento, b.matricula); sqlx::query("INSERT INTO esocial_eventos (matricula, tipo_evento, xml_gerado) VALUES ($1, $2, $3)").bind(&b.matricula).bind(&b.tipo_evento).bind(xml_mock).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_eventos_esocial(State(p): State<PgPool>) -> Result<Json<Vec<EventoEsocial>>, StatusCode> { Ok(Json(sqlx::query_as::<_, EventoEsocial>("SELECT id::text, matricula, tipo_evento, xml_gerado, status, protocolo_retorno FROM esocial_eventos ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn transmitir_evento_esocial(State(p): State<PgPool>, Path(id): Path<String>) -> Result<(StatusCode, Json<String>), StatusCode> { let p_mock = format!("PROT-GOVBR-{}", uuid::Uuid::new_v4().to_string().chars().take(8).collect::<String>().to_uppercase()); let r = sqlx::query("UPDATE esocial_eventos SET status = 'ENVIADO', protocolo_retorno = $1 WHERE id = $2::uuid AND status = 'AGUARDANDO_ENVIO'").bind(p_mock).bind(id).execute(&p).await.unwrap(); if r.rows_affected() == 0 { return Err(StatusCode::BAD_REQUEST); } Ok((StatusCode::OK, Json("Ok".to_string()))) }
async fn criar_bem(State(p): State<PgPool>, Json(b): Json<CriarBemInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO bens_patrimoniais (codigo_tombamento, descricao, valor_aquisicao, setor_alocacao) VALUES ($1, $2, $3, $4)").bind(&b.codigo_tombamento).bind(&b.descricao).bind(b.valor_aquisicao).bind(&b.setor_alocacao).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_bens(State(p): State<PgPool>) -> Result<Json<Vec<BemPatrimonial>>, StatusCode> { Ok(Json(sqlx::query_as::<_, BemPatrimonial>("SELECT id::text, codigo_tombamento, descricao, valor_aquisicao::float8, setor_alocacao, situacao FROM bens_patrimoniais ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn criar_tributo(State(p): State<PgPool>, Json(b): Json<CriarTributoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO tributos_lancamentos (contribuinte, tipo_tributo, exercicio, valor) VALUES ($1, $2, $3, $4)").bind(&b.contribuinte).bind(&b.tipo_tributo).bind(b.exercicio).bind(b.valor).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_tributos(State(p): State<PgPool>) -> Result<Json<Vec<Tributo>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Tributo>("SELECT id::text, contribuinte, tipo_tributo, exercicio, valor::float8, status FROM tributos_lancamentos ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn emitir_nfse(State(p): State<PgPool>, Json(b): Json<CriarNotaFiscalInput>) -> Result<(StatusCode, Json<String>), StatusCode> { let v = b.valor_servico * (b.aliquota / 100.0); sqlx::query("INSERT INTO nfse_emissao (prestador_cnpj, tomador_cpf_cnpj, descricao_servico, valor_servico, aliquota, valor_issqn) VALUES ($1, $2, $3, $4, $5, $6)").bind(&b.prestador_cnpj).bind(&b.tomador_cpf_cnpj).bind(&b.descricao_servico).bind(b.valor_servico).bind(b.aliquota).bind(v).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_nfse(State(p): State<PgPool>) -> Result<Json<Vec<NotaFiscal>>, StatusCode> { Ok(Json(sqlx::query_as::<_, NotaFiscal>("SELECT id::text, numero_nota, prestador_cnpj, tomador_cpf_cnpj, descricao_servico, valor_servico::float8, aliquota::float8, valor_issqn::float8, status FROM nfse_emissao ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn registrar_leitura(State(p): State<PgPool>, Json(b): Json<CriarLeituraInput>) -> Result<(StatusCode, Json<String>), StatusCode> { let c = b.leitura_atual - b.leitura_anterior; if c < 0.0 { return Err(StatusCode::BAD_REQUEST); } let v = if c <= 10.0 { 35.0 } else { 35.0 + ((c - 10.0) * 5.0) }; sqlx::query("INSERT INTO agua_leituras (matricula_imovel, leitura_anterior, leitura_atual, consumo_m3, valor_fatura) VALUES ($1, $2, $3, $4, $5)").bind(&b.matricula_imovel).bind(b.leitura_anterior).bind(b.leitura_atual).bind(c).bind(v).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_leituras(State(p): State<PgPool>) -> Result<Json<Vec<LeituraAgua>>, StatusCode> { Ok(Json(sqlx::query_as::<_, LeituraAgua>("SELECT id::text, matricula_imovel, leitura_anterior::float8, leitura_atual::float8, consumo_m3::float8, valor_fatura::float8, status FROM agua_leituras ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn publicar_noticia(State(p): State<PgPool>, Json(b): Json<CriarNoticiaInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO portal_noticias (titulo, resumo, conteudo) VALUES ($1, $2, $3)").bind(&b.titulo).bind(&b.resumo).bind(&b.conteudo).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_noticias(State(p): State<PgPool>) -> Result<Json<Vec<Noticia>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Noticia>("SELECT id::text, titulo, resumo, conteudo, autor FROM portal_noticias ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn publicar_relatorio(State(p): State<PgPool>, Json(b): Json<CriarRelatorioInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO transparencia_relatorios (titulo, categoria, exercicio, link_arquivo) VALUES ($1, $2, $3, $4)").bind(&b.titulo).bind(&b.categoria).bind(b.exercicio).bind(&b.link_arquivo).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_relatorios(State(p): State<PgPool>) -> Result<Json<Vec<RelatorioTransparencia>>, StatusCode> { Ok(Json(sqlx::query_as::<_, RelatorioTransparencia>("SELECT id::text, titulo, categoria, exercicio, link_arquivo FROM transparencia_relatorios ORDER BY exercicio DESC, criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn abrir_chamado(State(p): State<PgPool>, Json(b): Json<CriarChamadoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO cidadao_chamados (cpf_cidadao, categoria, descricao, endereco) VALUES ($1, $2, $3, $4)").bind(&b.cpf_cidadao).bind(&b.categoria).bind(&b.descricao).bind(&b.endereco).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_chamados(State(p): State<PgPool>) -> Result<Json<Vec<ChamadoCidadao>>, StatusCode> { Ok(Json(sqlx::query_as::<_, ChamadoCidadao>("SELECT id::text, cpf_cidadao, categoria, descricao, endereco, status FROM cidadao_chamados ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn bater_ponto(State(p): State<PgPool>, Json(b): Json<CriarRegistroPontoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO rh_ponto_eletronico (matricula, tipo_registro) VALUES ($1, $2)").bind(&b.matricula).bind(&b.tipo_registro).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_pontos(State(p): State<PgPool>) -> Result<Json<Vec<RegistroPonto>>, StatusCode> { Ok(Json(sqlx::query_as::<_, RegistroPonto>("SELECT id::text, matricula, tipo_registro, to_char(registrado_em, 'DD/MM/YYYY HH24:MI:SS') as registrado_em FROM rh_ponto_eletronico ORDER BY registrado_em DESC").fetch_all(&p).await.unwrap())) }
async fn abrir_protocolo(State(p): State<PgPool>, Json(b): Json<CriarProtocoloInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO protocolos_processos (numero_protocolo, requerente, assunto, descricao) VALUES ($1, $2, $3, $4)").bind(&b.numero_protocolo).bind(&b.requerente).bind(&b.assunto).bind(&b.descricao).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_protocolos(State(p): State<PgPool>) -> Result<Json<Vec<Protocolo>>, StatusCode> { Ok(Json(sqlx::query_as::<_, Protocolo>("SELECT id::text, numero_protocolo, requerente, assunto, descricao, status FROM protocolos_processos ORDER BY criado_em DESC").fetch_all(&p).await.unwrap())) }
async fn registrar_obito(State(p): State<PgPool>, Json(b): Json<CriarObitoInput>) -> Result<(StatusCode, Json<String>), StatusCode> { sqlx::query("INSERT INTO cemiterios_obitos (nome_falecido, cpf_falecido, data_obito, cemiterio, quadra_lote) VALUES ($1, $2, $3::date, $4, $5)").bind(&b.nome_falecido).bind(&b.cpf_falecido).bind(&b.data_obito).bind(&b.cemiterio).bind(&b.quadra_lote).execute(&p).await.unwrap(); Ok((StatusCode::CREATED, Json("Ok".to_string()))) }
async fn listar_obitos(State(p): State<PgPool>) -> Result<Json<Vec<RegistroObito>>, StatusCode> { Ok(Json(sqlx::query_as::<_, RegistroObito>("SELECT id::text, nome_falecido, cpf_falecido, to_char(data_obito, 'DD/MM/YYYY') as data_obito, cemiterio, quadra_lote, status FROM cemiterios_obitos ORDER BY data_obito DESC").fetch_all(&p).await.unwrap())) }

// --- HANDLERS: FROTAS E TRÂNSITO (NOVO FINAL!) ---
async fn registrar_veiculo(
    State(pool): State<PgPool>,
    Json(payload): Json<CriarVeiculoInput>,
) -> Result<(StatusCode, Json<String>), StatusCode> {
    let resultado = sqlx::query(
        "INSERT INTO frotas_veiculos (placa, modelo, departamento, quilometragem) VALUES ($1, $2, $3, $4)"
    )
    .bind(&payload.placa)
    .bind(&payload.modelo)
    .bind(&payload.departamento)
    .bind(payload.quilometragem)
    .execute(&pool)
    .await;

    match resultado {
        Ok(_) => Ok((StatusCode::CREATED, Json("Veículo registado na frota municipal!".to_string()))),
        Err(_) => Err(StatusCode::CONFLICT), // Placa duplicada
    }
}

async fn listar_veiculos(State(pool): State<PgPool>) -> Result<Json<Vec<VeiculoFrota>>, StatusCode> {
    let veiculos = sqlx::query_as::<_, VeiculoFrota>(
        "SELECT id::text, placa, modelo, departamento, quilometragem::float8, status FROM frotas_veiculos ORDER BY criado_em DESC"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(veiculos))
}
