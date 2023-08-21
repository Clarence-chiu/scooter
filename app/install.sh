echo  ======= Init =======

echo 'step 1 install serve-static'
npm install --save @nestjs/serve-static

echo 'step 2 install vue.js'
npm install -g @vue/cli  

echo 'step 3 install axios 套件'
npm install axios --save

echo 'step 4 install prisma module'
yarn add -D prisma

echo 'step 5 install prisma client module'
yarn add @prisma/client

echo 'step 6 install validator module'
yarn add class-validator class-transformer

echo 'step 7 install argon2 (hash)'
yarn add argon2

echo 'step 8 install config module'
yarn add @nestjs/config

echo 'step 8 install passport module'
yarn add @nestjs/passport passport

echo 'step 9 install jwt module'
yarn add @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt

echo 'step 10 install pactumn (unit test) module'
yarn add -D pactum

echo 'step 11 install dotenv module for unit test env)'
yarn add -D dotenv-cli

echo 'step 12 install schedule module and cron module'
yarn add @nestjs/schedule
yarn add -D @type/cron

echo  ======= End =======
