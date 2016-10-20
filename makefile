default: run

createsuperuser:
	python manage.py createsuperuser

shell:
	python manage.py shell

makemigrations:
	python manage.py makemigrations $(app)

migrate:
	python manage.py migrate

run:
	python manage.py runserver

showurls:
	python manage.py show_urls

node_version:
	nvm use 6.4.0

watch:
	./node_modules/.bin/webpack --config webpack.config.js --watch

build-production:
	./node_modules/.bin/webpack --config webpack.prod.config.js