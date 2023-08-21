## Scooter Project

- 框架: nest.js
- 資料庫: postgres

### requirement

- @nestjs/cli
- @nestjs/serve-static
- @nestjs/config
- @nestjs/passport
- @nestjs/jwt
- @nestjs/schedule
- @vue/cli
- @types/passport-jwt
- @types/cron
- axios
- prisma
- lass-validator
- class-transformer
- argon2
- passport
- passport-jwt
- pactum
- dotenv-cli

___
### Init

#### 專案在 docker container 環境中開發

1. `docker-compose up -d` -> build scooter api in docker container.
2. `./install.sh` -> install requirement package.
3. `yarn prisma:dev:deploy` -> migrate official db.
4. `yarn prisma:test:deploy` -> migrate test db.
5. `yarn test:e2e` -> start e2e testing.

- `db_rebuild.bat` -> restart official db in docker.
- `test_db_rebuild.bat` -> restart test db in docker.

___
### Rental Process

- file: /src/rental/rental.controller.ts
- method: class RentalProcess
- 伺服器啟動 10 秒鐘後會開始執行此 method
	- 會清空 DB 中三張 Table 的所有資料
	- 會新增三筆 Scooter 資料

- Rental flow
	1. 使用者註冊帳號
	2. 使用整登入
	3. 取的所有可租借的 scooter
	4. 使用者租借第一台的 scooter
	5. 使用者嘗試資界另一台 scooter (不會成功)
	6. 另一位使用者嘗試租借第一台 scooter (不會成功)
	7. 使用者歸還 scooter

___
### Task schedule

想法: 如果我是使用者，如果時常騎較長程的路程，或許我會想每隔一段時間收到提醒，
	告知使用者，租用的時間已經超過一個小時了，此想法來自 USPACE(共享停車位)，
	所以在此傳案有加入[Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)，並新增 TasksService，每分鐘固定搜尋 Rent 資料表中，租用時間已經超過一個小時，可提醒用戶使用時間，之後每隔一個小時會再通知一次。


