create database imunidata;
use imunidata;
create index idx_idade on registro_vacinacao(idade);
create index idx_registro_uf on registro_vacinacao(uf);
create index idx_codigo_registro on registro_vacinacao(id);
create index idx_descricao_vacina on registro_vacinacao(descricao_vacina);
