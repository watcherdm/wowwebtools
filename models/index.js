const {
	DATABASE_URL
} = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(DATABASE_URL, {})

const {
  ABSTRACT,
  STRING,
  CHAR,
  TEXT,
  NUMBER,
  TINYINT,
  SMALLINT,
  MEDIUMINT,
  INTEGER,
  BIGINT,
  FLOAT,
  TIME,
  DATE,
  DATEONLY,
  BOOLEAN,
  NOW,
  BLOB,
  DECIMAL,
  NUMERIC,
  UUID,
  UUIDV1,
  UUIDV4,
  HSTORE,
  JSON,
  JSONB,
  VIRTUAL,
  ARRAY,
  NONE,
  ENUM,
  RANGE,
  REAL,
  DOUBLE,
  'DOUBLE PRECISION': DOUBLE_PRECISION,
  GEOMETRY,
  GEOGRAPHY,
  CIDR,
  INET,
  MACADDR
} = Sequelize

sequelize.define('BlizzardUser', {
	sub: STRING,
	id: INTEGER,
	battletag: STRING
})