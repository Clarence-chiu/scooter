@echo Start

rem cd to current file.
cd /D "%~dp0"

rem rm testing database.
@echo "docker-compose rm test_postgres_db -s -f -v"
docker-compose rm test_postgres_db -s -f -v

rem rm volume
rem @echo "docker volume rm nest_scooter_pg_data -f"
rem docker volume rm nest_scooter_pg_data -f

rem rebuild testing database.
@echo "docker-compose up test_postgres_db -d"
docker-compose up test_postgres_db -d

@echo "complate."
rem @pause
