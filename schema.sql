--
-- PostgreSQL database dump
--

\restrict Ex90hw5wYmENWH2Lg0ATEaijt0ur1HjU9QrfQjglXnUauYP2qpeO3fHl4YLVeBt

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agua_leituras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agua_leituras (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    matricula_imovel character varying(50) NOT NULL,
    leitura_anterior numeric(10,2) NOT NULL,
    leitura_atual numeric(10,2) NOT NULL,
    consumo_m3 numeric(10,2) NOT NULL,
    valor_fatura numeric(15,2) NOT NULL,
    status character varying(20) DEFAULT 'FATURADO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.agua_leituras OWNER TO postgres;

--
-- Name: bens_patrimoniais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bens_patrimoniais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo_tombamento character varying(50) NOT NULL,
    descricao character varying(255) NOT NULL,
    valor_aquisicao numeric(15,2) NOT NULL,
    setor_alocacao character varying(100) NOT NULL,
    situacao character varying(30) DEFAULT 'ATIVO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bens_patrimoniais OWNER TO postgres;

--
-- Name: cemiterios_obitos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cemiterios_obitos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome_falecido character varying(255) NOT NULL,
    cpf_falecido character varying(20),
    data_obito date NOT NULL,
    cemiterio character varying(100) NOT NULL,
    quadra_lote character varying(50) NOT NULL,
    status character varying(30) DEFAULT 'SEPULTADO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cemiterios_obitos OWNER TO postgres;

--
-- Name: cidadao_chamados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cidadao_chamados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cpf_cidadao character varying(20) NOT NULL,
    categoria character varying(50) NOT NULL,
    descricao text NOT NULL,
    endereco character varying(255) NOT NULL,
    status character varying(30) DEFAULT 'ABERTO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cidadao_chamados OWNER TO postgres;

--
-- Name: controle_interno_alertas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.controle_interno_alertas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo character varying(255) NOT NULL,
    nivel_severidade character varying(20) NOT NULL,
    modulo_origem character varying(50) NOT NULL,
    descricao text NOT NULL,
    resolvido boolean DEFAULT false,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.controle_interno_alertas OWNER TO postgres;

--
-- Name: convenios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.convenios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_convenio character varying(50) NOT NULL,
    orgao_concedente character varying(255) NOT NULL,
    valor_global numeric(15,2) NOT NULL,
    valor_contrapartida numeric(15,2) NOT NULL,
    status character varying(30) DEFAULT 'EM_EXECUCAO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.convenios OWNER TO postgres;

--
-- Name: divida_ativa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.divida_ativa (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contribuinte character varying(255) NOT NULL,
    numero_cda character varying(50) NOT NULL,
    valor_principal numeric(15,2) NOT NULL,
    status character varying(30) DEFAULT 'INSCRITA'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.divida_ativa OWNER TO postgres;

--
-- Name: empenhos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empenhos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_empenho character varying(50) NOT NULL,
    valor numeric(15,2) NOT NULL,
    historico text NOT NULL,
    status character varying(20) DEFAULT 'EMPENHADO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.empenhos OWNER TO postgres;

--
-- Name: esocial_eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.esocial_eventos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    matricula character varying(50) NOT NULL,
    tipo_evento character varying(20) NOT NULL,
    xml_gerado text NOT NULL,
    status character varying(30) DEFAULT 'AGUARDANDO_ENVIO'::character varying,
    protocolo_retorno character varying(100),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.esocial_eventos OWNER TO postgres;

--
-- Name: folha_pagamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folha_pagamento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    servidor_nome character varying(255) NOT NULL,
    matricula character varying(50) NOT NULL,
    mes_referencia character varying(20) NOT NULL,
    salario_bruto numeric(15,2) NOT NULL,
    descontos numeric(15,2) NOT NULL,
    salario_liquido numeric(15,2) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.folha_pagamento OWNER TO postgres;

--
-- Name: frotas_veiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.frotas_veiculos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    placa character varying(10) NOT NULL,
    modelo character varying(100) NOT NULL,
    departamento character varying(100) NOT NULL,
    quilometragem numeric(10,2) DEFAULT 0,
    status character varying(30) DEFAULT 'DISPONIVEL'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.frotas_veiculos OWNER TO postgres;

--
-- Name: ldo_diretrizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ldo_diretrizes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ano integer NOT NULL,
    descricao text NOT NULL,
    meta_fiscal numeric(15,2) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ldo_diretrizes OWNER TO postgres;

--
-- Name: loa_dotacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loa_dotacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    descricao character varying(255) NOT NULL,
    saldo_inicial numeric(15,2) NOT NULL,
    saldo_atual numeric(15,2) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.loa_dotacoes OWNER TO postgres;

--
-- Name: nfse_emissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nfse_emissao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_nota integer NOT NULL,
    prestador_cnpj character varying(20) NOT NULL,
    tomador_cpf_cnpj character varying(20) NOT NULL,
    descricao_servico text NOT NULL,
    valor_servico numeric(15,2) NOT NULL,
    aliquota numeric(5,2) NOT NULL,
    valor_issqn numeric(15,2) NOT NULL,
    status character varying(20) DEFAULT 'AUTORIZADA'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nfse_emissao OWNER TO postgres;

--
-- Name: nfse_emissao_numero_nota_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nfse_emissao_numero_nota_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nfse_emissao_numero_nota_seq OWNER TO postgres;

--
-- Name: nfse_emissao_numero_nota_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nfse_emissao_numero_nota_seq OWNED BY public.nfse_emissao.numero_nota;


--
-- Name: pessoas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pessoas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    cpf_cnpj character varying(14) NOT NULL,
    tipo_pessoa character varying(2) DEFAULT 'PF'::character varying NOT NULL,
    email character varying(150),
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    perfil character varying(50) DEFAULT 'Geral'::character varying
);


ALTER TABLE public.pessoas OWNER TO postgres;

--
-- Name: portal_noticias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portal_noticias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo character varying(255) NOT NULL,
    resumo character varying(500) NOT NULL,
    conteudo text NOT NULL,
    autor character varying(100) DEFAULT 'Assessoria de Comunicação'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.portal_noticias OWNER TO postgres;

--
-- Name: ppa_programas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ppa_programas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(255) NOT NULL,
    objetivo text NOT NULL,
    teto_financeiro numeric(15,2) NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ppa_programas OWNER TO postgres;

--
-- Name: processos_licitatorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.processos_licitatorios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_processo character varying(50) NOT NULL,
    modalidade character varying(50) NOT NULL,
    objeto text NOT NULL,
    valor_estimado numeric(15,2) NOT NULL,
    status character varying(30) DEFAULT 'FASE_INTERNA'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.processos_licitatorios OWNER TO postgres;

--
-- Name: protocolos_processos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.protocolos_processos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero_protocolo character varying(50) NOT NULL,
    requerente character varying(255) NOT NULL,
    assunto character varying(255) NOT NULL,
    descricao text NOT NULL,
    status character varying(30) DEFAULT 'AGUARDANDO_ANALISE'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.protocolos_processos OWNER TO postgres;

--
-- Name: rh_ponto_eletronico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rh_ponto_eletronico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    matricula character varying(50) NOT NULL,
    tipo_registro character varying(30) NOT NULL,
    registrado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rh_ponto_eletronico OWNER TO postgres;

--
-- Name: servidor_solicitacoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servidor_solicitacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    matricula character varying(50) NOT NULL,
    tipo_solicitacao character varying(50) NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    status character varying(30) DEFAULT 'EM_ANALISE_RH'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.servidor_solicitacoes OWNER TO postgres;

--
-- Name: tesouraria_lancamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tesouraria_lancamentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conta_bancaria character varying(100) NOT NULL,
    tipo character varying(10) NOT NULL,
    valor numeric(15,2) NOT NULL,
    descricao character varying(255) NOT NULL,
    conciliado boolean DEFAULT false,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tesouraria_lancamentos OWNER TO postgres;

--
-- Name: transparencia_relatorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transparencia_relatorios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo character varying(255) NOT NULL,
    categoria character varying(50) NOT NULL,
    exercicio integer NOT NULL,
    link_arquivo text NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transparencia_relatorios OWNER TO postgres;

--
-- Name: tributos_lancamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tributos_lancamentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    contribuinte character varying(255) NOT NULL,
    tipo_tributo character varying(50) NOT NULL,
    exercicio integer NOT NULL,
    valor numeric(15,2) NOT NULL,
    status character varying(30) DEFAULT 'ABERTO'::character varying,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tributos_lancamentos OWNER TO postgres;

--
-- Name: nfse_emissao numero_nota; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nfse_emissao ALTER COLUMN numero_nota SET DEFAULT nextval('public.nfse_emissao_numero_nota_seq'::regclass);


--
-- Name: agua_leituras agua_leituras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agua_leituras
    ADD CONSTRAINT agua_leituras_pkey PRIMARY KEY (id);


--
-- Name: bens_patrimoniais bens_patrimoniais_codigo_tombamento_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bens_patrimoniais
    ADD CONSTRAINT bens_patrimoniais_codigo_tombamento_key UNIQUE (codigo_tombamento);


--
-- Name: bens_patrimoniais bens_patrimoniais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bens_patrimoniais
    ADD CONSTRAINT bens_patrimoniais_pkey PRIMARY KEY (id);


--
-- Name: cemiterios_obitos cemiterios_obitos_cemiterio_quadra_lote_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cemiterios_obitos
    ADD CONSTRAINT cemiterios_obitos_cemiterio_quadra_lote_key UNIQUE (cemiterio, quadra_lote);


--
-- Name: cemiterios_obitos cemiterios_obitos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cemiterios_obitos
    ADD CONSTRAINT cemiterios_obitos_pkey PRIMARY KEY (id);


--
-- Name: cidadao_chamados cidadao_chamados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cidadao_chamados
    ADD CONSTRAINT cidadao_chamados_pkey PRIMARY KEY (id);


--
-- Name: controle_interno_alertas controle_interno_alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.controle_interno_alertas
    ADD CONSTRAINT controle_interno_alertas_pkey PRIMARY KEY (id);


--
-- Name: convenios convenios_numero_convenio_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios
    ADD CONSTRAINT convenios_numero_convenio_key UNIQUE (numero_convenio);


--
-- Name: convenios convenios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios
    ADD CONSTRAINT convenios_pkey PRIMARY KEY (id);


--
-- Name: divida_ativa divida_ativa_numero_cda_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.divida_ativa
    ADD CONSTRAINT divida_ativa_numero_cda_key UNIQUE (numero_cda);


--
-- Name: divida_ativa divida_ativa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.divida_ativa
    ADD CONSTRAINT divida_ativa_pkey PRIMARY KEY (id);


--
-- Name: empenhos empenhos_numero_empenho_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empenhos
    ADD CONSTRAINT empenhos_numero_empenho_key UNIQUE (numero_empenho);


--
-- Name: empenhos empenhos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empenhos
    ADD CONSTRAINT empenhos_pkey PRIMARY KEY (id);


--
-- Name: esocial_eventos esocial_eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.esocial_eventos
    ADD CONSTRAINT esocial_eventos_pkey PRIMARY KEY (id);


--
-- Name: folha_pagamento folha_pagamento_matricula_mes_referencia_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folha_pagamento
    ADD CONSTRAINT folha_pagamento_matricula_mes_referencia_key UNIQUE (matricula, mes_referencia);


--
-- Name: folha_pagamento folha_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folha_pagamento
    ADD CONSTRAINT folha_pagamento_pkey PRIMARY KEY (id);


--
-- Name: frotas_veiculos frotas_veiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frotas_veiculos
    ADD CONSTRAINT frotas_veiculos_pkey PRIMARY KEY (id);


--
-- Name: frotas_veiculos frotas_veiculos_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.frotas_veiculos
    ADD CONSTRAINT frotas_veiculos_placa_key UNIQUE (placa);


--
-- Name: ldo_diretrizes ldo_diretrizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ldo_diretrizes
    ADD CONSTRAINT ldo_diretrizes_pkey PRIMARY KEY (id);


--
-- Name: loa_dotacoes loa_dotacoes_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loa_dotacoes
    ADD CONSTRAINT loa_dotacoes_codigo_key UNIQUE (codigo);


--
-- Name: loa_dotacoes loa_dotacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loa_dotacoes
    ADD CONSTRAINT loa_dotacoes_pkey PRIMARY KEY (id);


--
-- Name: nfse_emissao nfse_emissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nfse_emissao
    ADD CONSTRAINT nfse_emissao_pkey PRIMARY KEY (id);


--
-- Name: pessoas pessoas_cpf_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_cpf_cnpj_key UNIQUE (cpf_cnpj);


--
-- Name: pessoas pessoas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pessoas
    ADD CONSTRAINT pessoas_pkey PRIMARY KEY (id);


--
-- Name: portal_noticias portal_noticias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_noticias
    ADD CONSTRAINT portal_noticias_pkey PRIMARY KEY (id);


--
-- Name: ppa_programas ppa_programas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ppa_programas
    ADD CONSTRAINT ppa_programas_pkey PRIMARY KEY (id);


--
-- Name: processos_licitatorios processos_licitatorios_numero_processo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processos_licitatorios
    ADD CONSTRAINT processos_licitatorios_numero_processo_key UNIQUE (numero_processo);


--
-- Name: processos_licitatorios processos_licitatorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.processos_licitatorios
    ADD CONSTRAINT processos_licitatorios_pkey PRIMARY KEY (id);


--
-- Name: protocolos_processos protocolos_processos_numero_protocolo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocolos_processos
    ADD CONSTRAINT protocolos_processos_numero_protocolo_key UNIQUE (numero_protocolo);


--
-- Name: protocolos_processos protocolos_processos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.protocolos_processos
    ADD CONSTRAINT protocolos_processos_pkey PRIMARY KEY (id);


--
-- Name: rh_ponto_eletronico rh_ponto_eletronico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rh_ponto_eletronico
    ADD CONSTRAINT rh_ponto_eletronico_pkey PRIMARY KEY (id);


--
-- Name: servidor_solicitacoes servidor_solicitacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servidor_solicitacoes
    ADD CONSTRAINT servidor_solicitacoes_pkey PRIMARY KEY (id);


--
-- Name: tesouraria_lancamentos tesouraria_lancamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tesouraria_lancamentos
    ADD CONSTRAINT tesouraria_lancamentos_pkey PRIMARY KEY (id);


--
-- Name: transparencia_relatorios transparencia_relatorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transparencia_relatorios
    ADD CONSTRAINT transparencia_relatorios_pkey PRIMARY KEY (id);


--
-- Name: tributos_lancamentos tributos_lancamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tributos_lancamentos
    ADD CONSTRAINT tributos_lancamentos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict Ex90hw5wYmENWH2Lg0ATEaijt0ur1HjU9QrfQjglXnUauYP2qpeO3fHl4YLVeBt

