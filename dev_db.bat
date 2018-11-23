@echo off
setlocal
set COMMAND=%1

IF "%COMMAND%"=="create" (

  (
    echo CREATE ROLE wowwebtools WITH LOGIN PASSWORD '%BLIZZARD_SECRET%' CREATEDB;
  ) | psql postgres postgres

  psql --file=create_dev.sql postgres postgres

)

IF "%COMMAND%"=="delete" (
  (
    echo DROP DATABASE wowwebtools_dev;
  ) | psql postgres postgres

  (
    echo DROP ROLE wowwebtools;
  ) | psql postgres postgres

)

endlocal