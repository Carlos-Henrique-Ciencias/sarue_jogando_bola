// backend/src/models.rs
use serde::{Deserialize, Serialize};

// --- VERTICAL: ADMINISTRAÇÃO E CIDADÃO ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Pessoa { pub id: String, pub nome: String, pub cpf_cnpj: String, pub tipo_pessoa: String, pub email: Option<String>, pub perfil: String }
#[derive(Deserialize)] pub struct CriarPessoaInput { pub nome: String, pub cpf_cnpj: String, pub tipo_pessoa: String, pub email: Option<String>, pub perfil: String }

// --- VERTICAL: ORÇAMENTO E CONTABILIDADE ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Empenho { pub id: String, pub numero_empenho: String, pub valor: f64, pub historico: String, pub status: String }
#[derive(Deserialize)] pub struct CriarEmpenhoInput { pub numero_empenho: String, pub valor: f64, pub historico: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct PpaPrograma { pub id: String, pub nome: String, pub objetivo: String, pub teto_financeiro: f64 }
#[derive(Deserialize)] pub struct CriarPpaInput { pub nome: String, pub objetivo: String, pub teto_financeiro: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct LdoDiretriz { pub id: String, pub ano: i32, pub descricao: String, pub meta_fiscal: f64 }
#[derive(Deserialize)] pub struct CriarLdoInput { pub ano: i32, pub descricao: String, pub meta_fiscal: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct LoaDotacao { pub id: String, pub codigo: String, pub descricao: String, pub saldo_inicial: f64, pub saldo_atual: f64 }
#[derive(Deserialize)] pub struct CriarLoaInput { pub codigo: String, pub descricao: String, pub saldo_inicial: f64 }

// --- VERTICAL: CONTRATOS, LICITAÇÕES E LOGÍSTICA ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Convenio { pub id: String, pub numero_convenio: String, pub orgao_concedente: String, pub valor_global: f64, pub valor_contrapartida: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarConvenioInput { pub numero_convenio: String, pub orgao_concedente: String, pub valor_global: f64, pub valor_contrapartida: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct ProcessoLicitatorio { pub id: String, pub numero_processo: String, pub modalidade: String, pub objeto: String, pub valor_estimado: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarProcessoInput { pub numero_processo: String, pub modalidade: String, pub objeto: String, pub valor_estimado: f64 }

// --- VERTICAL: ARRECADAÇÃO, TESOURARIA E AUDITORIA ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Divida { pub id: String, pub contribuinte: String, pub numero_cda: String, pub valor_principal: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarDividaInput { pub contribuinte: String, pub numero_cda: String, pub valor_principal: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Lancamento { pub id: String, pub conta_bancaria: String, pub tipo: String, pub valor: f64, pub descricao: String, pub conciliado: bool }
#[derive(Deserialize)] pub struct CriarLancamentoInput { pub conta_bancaria: String, pub tipo: String, pub valor: f64, pub descricao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct AlertaAuditoria { pub id: String, pub titulo: String, pub nivel_severidade: String, pub modulo_origem: String, pub descricao: String, pub resolvido: bool }
#[derive(Deserialize)] pub struct CriarAlertaInput { pub titulo: String, pub nivel_severidade: String, pub modulo_origem: String, pub descricao: String }

// --- VERTICAL: RECURSOS HUMANOS ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Contracheque { pub id: String, pub servidor_nome: String, pub matricula: String, pub mes_referencia: String, pub salario_bruto: f64, pub descontos: f64, pub salario_liquido: f64 }
#[derive(Deserialize)] pub struct CriarContrachequeInput { pub servidor_nome: String, pub matricula: String, pub mes_referencia: String, pub salario_bruto: f64, pub descontos: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct SolicitacaoServidor { pub id: String, pub matricula: String, pub tipo_solicitacao: String, pub data_inicio: String, pub data_fim: String, pub status: String }
#[derive(Deserialize)] pub struct CriarSolicitacaoInput { pub matricula: String, pub tipo_solicitacao: String, pub data_inicio: String, pub data_fim: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct EventoEsocial { pub id: String, pub matricula: String, pub tipo_evento: String, pub xml_gerado: String, pub status: String, pub protocolo_retorno: Option<String> }
#[derive(Deserialize)] pub struct CriarEventoInput { pub matricula: String, pub tipo_evento: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct RegistroPonto { pub id: String, pub matricula: String, pub tipo_registro: String, pub registrado_em: String }
#[derive(Deserialize)] pub struct CriarRegistroPontoInput { pub matricula: String, pub tipo_registro: String }

// --- VERTICAL: PATRIMÔNIO, TRIBUTOS E SERVIÇOS URBANOS ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct BemPatrimonial { pub id: String, pub codigo_tombamento: String, pub descricao: String, pub valor_aquisicao: f64, pub setor_alocacao: String, pub situacao: String }
#[derive(Deserialize)] pub struct CriarBemInput { pub codigo_tombamento: String, pub descricao: String, pub valor_aquisicao: f64, pub setor_alocacao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Tributo { pub id: String, pub contribuinte: String, pub tipo_tributo: String, pub exercicio: i32, pub valor: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarTributoInput { pub contribuinte: String, pub tipo_tributo: String, pub exercicio: i32, pub valor: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct NotaFiscal { pub id: String, pub numero_nota: i32, pub prestador_cnpj: String, pub tomador_cpf_cnpj: String, pub descricao_servico: String, pub valor_servico: f64, pub aliquota: f64, pub valor_issqn: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarNotaFiscalInput { pub prestador_cnpj: String, pub tomador_cpf_cnpj: String, pub descricao_servico: String, pub valor_servico: f64, pub aliquota: f64 }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct LeituraAgua { pub id: String, pub matricula_imovel: String, pub leitura_anterior: f64, pub leitura_atual: f64, pub consumo_m3: f64, pub valor_fatura: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarLeituraInput { pub matricula_imovel: String, pub leitura_anterior: f64, pub leitura_atual: f64 }

// --- VERTICAL: PORTAIS, OUVIDORIA E DETALHES ADMINISTRATIVOS ---
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Noticia { pub id: String, pub titulo: String, pub resumo: String, pub conteudo: String, pub autor: String }
#[derive(Deserialize)] pub struct CriarNoticiaInput { pub titulo: String, pub resumo: String, pub conteudo: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct RelatorioTransparencia { pub id: String, pub titulo: String, pub categoria: String, pub exercicio: i32, pub link_arquivo: String }
#[derive(Deserialize)] pub struct CriarRelatorioInput { pub titulo: String, pub categoria: String, pub exercicio: i32, pub link_arquivo: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct ChamadoCidadao { pub id: String, pub cpf_cidadao: String, pub categoria: String, pub descricao: String, pub endereco: String, pub status: String }
#[derive(Deserialize)] pub struct CriarChamadoInput { pub cpf_cidadao: String, pub categoria: String, pub descricao: String, pub endereco: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct Protocolo { pub id: String, pub numero_protocolo: String, pub requerente: String, pub assunto: String, pub descricao: String, pub status: String }
#[derive(Deserialize)] pub struct CriarProtocoloInput { pub numero_protocolo: String, pub requerente: String, pub assunto: String, pub descricao: String }
#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct RegistroObito { pub id: String, pub nome_falecido: String, pub cpf_falecido: Option<String>, pub data_obito: String, pub cemiterio: String, pub quadra_lote: String, pub status: String }
#[derive(Deserialize)] pub struct CriarObitoInput { pub nome_falecido: String, pub cpf_falecido: Option<String>, pub data_obito: String, pub cemiterio: String, pub quadra_lote: String }

#[derive(Serialize, Deserialize, sqlx::FromRow)] pub struct VeiculoFrota { pub id: String, pub placa: String, pub modelo: String, pub departamento: String, pub quilometragem: f64, pub status: String }
#[derive(Deserialize)] pub struct CriarVeiculoInput { pub placa: String, pub modelo: String, pub departamento: String, pub quilometragem: f64 }