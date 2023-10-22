# API de Agenda de Contatos

Está é a documentação de requisitos para a API de Agenda de contatos.

## Funcionaliade

- Os usuários devem poder adicionar novos contatos com informações como nome, número de telefone, e-mail, etc.

## Requisitos Funcionais
- [x] Cadastro de Contatos
- [x] Visualização de Contatos
- [x] Atualização de Contatos
- [] Exclusão de Contatos

## Requisitos de Autenticação e Autorização
- [x] Autenticação de Usuários
- [x] Autorização de Acesso às Operações
- [x] Criação de usuário

## Regras de négocio
- Os usuários devem ser cadastrados com nome e email
- O email deve ser uma chave única
- Os contatos devem conter pelo menos um nome e uma forma de contato (número de telefone, endereço de email, etc.)
- Somente usuários autenticados podem executar operações de criação, atualização e exclusão de contatos.
- A autorização é baseada em funções de usuário, como administrador e usuário regular.
- Todos os dados da API devem ser armazenados de forma segura e protegidos contra acesso não autorizado.
- As entradas do usuário devem ser validadas para evitar a inserção de dados incorretos ou maliciosos.