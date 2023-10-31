create database projeto2;

create table usuarios (
	id serial primary key,
  nome text not null,
  email text not null unique, 
  senha text not null
);

create table categorias (
	id serial primary key,
  descricao text
);

create table transacoes (
	id serial primary key, 
  tipo text not null, 
  descricao text, 
  valor integer not null,
  data timestamp not null, 
  usuario_id integer not null, 
  categoria_id integer not null, 
  foreign key (usuario_id) references usuarios (id),
  foreign key (categoria_id) references categorias (id)
);

insert into categorias (descricao) values 
('Alimentação'),
('Assinaturas e serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');