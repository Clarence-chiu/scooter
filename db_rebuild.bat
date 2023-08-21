@echo Start

rem cd to current file.
cd /D "%~dp0"

rem rm testing database.
@echo "docker-compose rm postgres_db -s -f -v"
docker-compose rm postgres_db -s -f -v

rem rm volume
@echo "docker volume rm nest_scooter_pg_data -f"
docker volume rm nest_scooter_pg_data -f

rem rebuild testing database.
@echo "docker-compose up postgres_db -d"
docker-compose up postgres_db -d

@echo "complate."
rem @pause
