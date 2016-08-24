How To: Setup Development Environment

Database
1. Ensure PostgreSQL is installed locally
2. Create a database called vidfeed_2
3. Create a user called vidfeed with password vidfeed

Requirements
1. Create virtualenv using virtualenvwrapper (or other)
2. Workon virtualenv created in 1
3. run "pip install requirements.txt" from root to install required modules in virtualenv

Django
1. Create database tables by running 'python manage.py migrate'
2. Create an admin superuser by running 'python manage.py createsuperuser'
3. Start the project by running 'python manage.py runserver'
4. See the site by browsing to 'localhost:8000'

Frontend
1. Install node version 6.4.0
2. Install node modules by running 'npm install'
3. Watch for changes by running './node_modules/.bin/webpack --config webpack.config.js --watch'
