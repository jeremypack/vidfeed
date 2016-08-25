**********************************************************************

How To: Setup Development Environment - Simple

**********************************************************************

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



**********************************************************************

How To: Setup Development Environment - Indepth MAC Specific

**********************************************************************

Install Home Brew (http://brew.sh/)
	$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Install PostgresSQL (http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/)
	$ brew update	
	$ brew install postgres			

Start up Postgres Server	
	$ postgres -D /usr/local/var/postgres			
					
Install Pip	
	$ sudo easy_install pip			
					
Instal virtual environment (http://docs.python-guide.org/en/latest/dev/virtualenvs/)
	$ pip install virtualenv	
					
Clone the project in the directory of your choosing.
	$ git clone 		
					
Create virtual environment in the directory of your choosing. (http://docs.python-guide.org/en/latest/dev/virtualenvs/)
	$ virtualenv vidfeed_venv	

Activate virtual environment	
	$ source vidfeed_venv/bin/activate			
					
navigate to vidfeed project folder and install all requirements in virtual environment 
	$ pip install -r requirements.txt			
					
Set up database	(http://www.cyberciti.biz/faq/howto-add-postgresql-user-account/	"psql\list"	shows database and user names)
	$ psql template1 

	in the vim	
	# CREATE USER vidfeed WITH PASSWORD 'vidfeed';			
	# CREATE DATABASE vidfeed_2;			
	# GRANT ALL PRIVILEGES ON DATABASE vidfeed_2 to vidfeed;			
	# \q			
		

Sync DB, cd to vidfeed folder where manage.py exsists			
		
migrate the db schema	
	$ python manage.py migrate			

should run the site	
	$ python manage.py runserver

Create an admin superuser by running 
	$ python manage.py createsuperuser

install node
	https://nodejs.org/en/ (current version)

install nodes front end librarys	
	$ npm install



**********************************************************************

Commands you have to run everytime to start the project

**********************************************************************

Start DB		
	$ postgres -D /usr/local/var/postgres


Activate virtual environment	
	$ source vidfeed_venv/bin/activate
		
Start Server in the virtual environment terminal window
	$ python manage.py runserver
		
Watch for changes by running 	
	$ ./node_modules/.bin/webpack --config webpack.config.js --watch
		
Go too
	http://127.0.0.1:8000/admin/
	
Login with your username and email you supllied to the database earlier