CREATE DATABASE guia_praias;

USE guia_praias;

CREATE TABLE usuario(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(200) NOT NULL,
email VARCHAR(200) NOT NULL UNIQUE,
senha TEXT NOT NULL
);

CREATE TABLE praia(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(200) NOT NULL,
regiao ENUM ('Norte','Sul','Leste','Oeste'),
descricao VARCHAR(250),
nivel_perigo ENUM('Verde','Amarela','Vermelha','Roxa'),
surf BOOLEAN NOT NULL
);

CREATE TABLE avaliacao(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
nota DECIMAL(4,2) CHECK (nota >= 1 AND nota <= 5),
comentario VARCHAR(200),
usuario_id 	INT UNIQUE,
FOREIGN KEY (usuario_id) REFERENCES usuario(id),
praia_id INT UNIQUE,
FOREIGN KEY (praia_id) REFERENCES praia(id)
);

CREATE TABLE favorito(
usuario_id 	INT NOT NULL,
FOREIGN KEY (usuario_id) REFERENCES usuario(id),
praia_id INT NOT NULL,
FOREIGN KEY (praia_id) REFERENCES praia(id)
);

INSERT INTO praia (nome, regiao, descricao, nivel_perigo, surf) VALUES
-- NORTE
('Jurerê Internacional', 'Norte', 'Praia sofisticada com mar calmo e boa infraestrutura', 'Verde', false),
('Jurerê Tradicional', 'Norte', 'Área mais tranquila de Jurerê, ambiente familiar', 'Verde', false),
('Canasvieiras', 'Norte', 'Praia turística com mar calmo', 'Verde', false),
('Cachoeira do Bom Jesus', 'Norte', 'Praia tranquila e menos movimentada', 'Verde', false),
('Ponta das Canas', 'Norte', 'Ótima para famílias, mar calmo', 'Verde', false),
('Lagoinha do Norte', 'Norte', 'Pequena e tranquila, mar calmo', 'Verde', false),
('Praia Brava', 'Norte', 'Ondas fortes, muito procurada por surfistas', 'Vermelha', true),
('Ingleses', 'Norte', 'Praia grande com mar variável', 'Amarela', false),
('Santinho', 'Norte', 'Praia com boas ondas e sítios arqueológicos', 'Amarela', true),

-- LESTE
('Barra da Lagoa', 'Leste', 'Praia com canal e boa infraestrutura', 'Verde', false),
('Prainha da Barra', 'Leste', 'Pequena e tranquila ao lado da Barra', 'Verde', false),
('Moçambique', 'Leste', 'Praia longa, preservada e com ondas fortes', 'Vermelha', true),
('Praia Mole', 'Leste', 'Muito popular entre jovens e surfistas', 'Amarela', true),
('Joaquina', 'Leste', 'Famosa pelas dunas e surf', 'Amarela', true),
('Galheta', 'Leste', 'Praia naturalista e preservada', 'Amarela', true),

-- SUL
('Campeche', 'Sul', 'Praia extensa com mar agitado', 'Vermelha', true),
('Morro das Pedras', 'Sul', 'Praia com ondas fortes e correnteza', 'Vermelha', true),
('Armação', 'Sul', 'Praia tradicional com acesso a trilhas', 'Amarela', false),
('Matadeiro', 'Sul', 'Praia isolada e muito bonita', 'Amarela', true),
('Lagoinha do Leste', 'Sul', 'Praia selvagem com acesso por trilha', 'Vermelha', false),
('Pântano do Sul', 'Sul', 'Comunidade tradicional com mar aberto', 'Amarela', false),
('Açores', 'Sul', 'Praia tranquila e pouco movimentada', 'Verde', false),
('Solidão', 'Sul', 'Praia isolada e calma', 'Verde', false),
('Saquinho', 'Sul', 'Praia pequena acessível por trilha', 'Verde', false),

-- OESTE (baía, sem ondas fortes)
('Santo Antônio de Lisboa', 'Oeste', 'Praia histórica com mar calmo', 'Verde', false),
('Cacupé', 'Oeste', 'Região gastronômica com vista para o pôr do sol', 'Verde', false),
('Praia do Sambaqui', 'Oeste', 'Praia tranquila com vilarejo tradicional', 'Verde', false),
('Itaguaçu', 'Oeste', 'Pequena praia urbana com restaurantes', 'Verde', false),
('Bom Abrigo', 'Oeste', 'Praia calma próxima ao continente', 'Verde', false),
('Coqueiros', 'Oeste', 'Área urbana com mar calmo', 'Verde', false);