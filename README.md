# App

Gympass style app

## RFs (Requisitos funcionais)

Features solicitadas pelo cliente

- [x] Deve ser possível se cadastrar
- [x] Deve ser possível se autenticar
- [x] Deve ser possível obter o perfil de um usário logado
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [ ] Deve ser possível que o usuário obtenha seu histórico de check-ins
- [ ] Deve ser possível buscar academias próximas
- [ ] Deve ser possível buscar academias pelo nome
- [ ] Deve ser possível realizar check-in em uma academia
- [ ] Deve ser possível validar o check-in
- [ ] Deve ser possível cadastrar uma academia

## RNs (Regras de negócio)

Condições ou regras para que feature esteja disponível para o usuário. Bastante disso é informado pelo próprio cliente

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado
- [ ] O usuário não pode fazer 2 ou mais check-ins no mesmo dia
- [ ] O usuário não pode fazer check-in se não estiver num raio de 100m da academia onde deseja fazer check-in
- [ ] O check-in só pode ser validade até 20 minutos após criado
- [ ] O check-in só pode ser validado por admins
- [ ] A academia só pode ser cadastrada por admins

## RNF (Requisitos não funcionais)

Pontos técnicos relacionados à aplicação, como stack a ser utilizada, indexação de tabelas, paginação etc.

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um DB PostgreSQL
- [ ] Todas as listas de dados precisam estar páginas com 20 itens por páginas
- [ ] O usuário deve ser identificado por um JWT (Json Web Token)
