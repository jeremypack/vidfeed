How To: Setup Development Environment

Database
- Ensure PostgreSQL is installed locally
- Create a database called vidfeed_2
- Create a user called vidfeed with password vidfeed

Requirements
- Create virtualenv using virtualenvwrapper (or other)
- Workon virtualenv created in 1
- run "pip install requirements.txt" from root to install required modules in virtualenv

Django
- Create database tables by running 'python manage.py migrate'
- Create an admin superuser by running 'python manage.py createsuperuser'
- Start the project by running 'python manage.py runserver'
- See the site by browsing to 'localhost:8000'

Frontend
- Install node version 6.4.0
- Install node modules by running 'npm install'
- Watch for changes by running './node_modules/.bin/webpack --config webpack.config.js --watch'
