# backend

# 디비생성

npx sequelize db:create --config ./config/config.js

# 테이블 생성
npx sequelize-cli migration:generate --name {테이블명}

# 마이그레이션
npx sequelize-cli db:migrate

# dev run
npm run start:dev

# DB 명명 규칙 정리
<공통>
1. 소문자를 사용한다.
2. 단어를 임의로 축약하지 않는다.
3. 가능한 약어의 사용을 피한다. 사용해야 하는 경우, 약어 역시 소문자로 사용한다.

<테이블>
1. 복수형을 사용한다.
2. 이름을 구성하는 각각의 단어를 underscore로 연결되는 snake case를 사용한다.

<칼럼>
1. auto increment 속성의 PK를 대리키로 사용하는 경우, "테이블 이름_id"의 규칙으로 명명한다.
2. 이름을 구성하는 각각의 단어를 snake case를 사용한다.
3. foreign key 컬럼은 부모 테이블의 primary key 컬럼 이름을 그대로 사용한다.
4. boolean 유형의 컬럼이면 "_flag" 접미어를 사용한다.
