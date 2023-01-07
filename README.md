# backend

# 디비생성

npx sequelize db:create --config ./config/config.js

# 테이블 생성
npx sequelize-cli migration:generate --name {테이블명}

# 마이그레이션
npx sequelize-cli db:migrate

# dev run
npm run start:dev