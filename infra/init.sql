-- Criação da tabela Colaborador
CREATE TABLE colaborador (
    id_colaborador SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cargo VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    perfil VARCHAR(20) DEFAULT 'colaborador',
    status BOOLEAN DEFAULT TRUE
);

-- Inserção de exemplo na tabela Colaborador
INSERT INTO colaborador (nome, cpf, cargo, email, senha, perfil)
VALUES 
('João Silva', '111.222.333-44', 'Analista', 'joao@email.com', '123456', 'admin'),
('Maria Souza', '222.333.444-55', 'Engenheira', 'maria@email.com', '123456', 'colaborador'),
('Carlos Lima', '333.444.555-66', 'Técnico', 'carlos@email.com', '123456', 'colaborador');

-- Criação da tabela Treinamento
CREATE TABLE treinamento (
    id_treinamento SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    carga_horaria INT NOT NULL,
    obrigatorio BOOLEAN DEFAULT FALSE,
    validade_meses INT DEFAULT 12
);

-- Inserção de exemplo na tabela Treinamento
INSERT INTO treinamento (titulo, descricao, carga_horaria, obrigatorio, validade_meses)
VALUES 
('Segurança do Trabalho', 'Treinamento obrigatório NR-12', 8, TRUE, 12),
('Qualidade', 'Treinamento sobre procedimentos de qualidade', 6, FALSE, 24),
('Uso de Novas Tecnologias', 'Treinamento de novas ferramentas', 4, FALSE, 12);

-- Criação da tabela Turma
CREATE TABLE turma (
    id_turma SERIAL PRIMARY KEY,
    id_treinamento INT REFERENCES treinamento(id_treinamento),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    carga_horaria INT NOT NULL
);

-- Inserção de exemplo na tabela Turma
INSERT INTO turma (id_treinamento, data_inicio, data_fim, carga_horaria)
VALUES 
(1, '2025-09-01', '2025-09-02', 8),
(2, '2025-09-05', '2025-09-05', 6),
(3, '2025-09-10', '2025-09-10', 4);
