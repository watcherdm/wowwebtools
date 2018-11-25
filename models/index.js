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
  JSON: _JSON,
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

const User = sequelize.define('user', {
  battletag: STRING,
  bid: INTEGER,
  provider: STRING,
  sub: STRING,
  token: STRING
})

const Character = sequelize.define('character', {
  "bid": INTEGER,
  "name": STRING,
  "realm": STRING,
  "battlegroup": STRING,
  "class": INTEGER,
  "race": INTEGER,
  "gender": INTEGER,
  "level": INTEGER,
  "achievementPoints": INTEGER,
  "thumbnail": STRING,
  "spec": _JSON,
  "guild": STRING,
  "guildRealm": STRING,
  "lastModified": DATE,
  "updatedDate": DATE,
})

Character.belongsTo(User)

const Session = sequelize.define('Sessions', {
  session_id: {
    type: STRING,
    primaryKey: true
  },
  expires: {
    type: DATE
  },
  data: {
    type: STRING(50000)
  }
},
{
  tableName: 'sessions'
})

User.belongsTo(Session)

sequelize.sync()

module.exports = {
  Character,
  User,
  Session
}