.PHONY: up down build logs clean

up:
	docker-compose up --build

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs

clean:
	docker-compose down -v --rmi all --remove-orphans