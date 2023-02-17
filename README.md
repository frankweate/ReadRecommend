# capstone-project-neets

## Git Guidelines

Work on your own branch when developing a new feature.

### Commit Style

Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
when possible. This helps to make more sense with features being delivered.

### Conflict Resolution

Git [rebase](https://git-scm.com/docs/git-rebase) is preferred, since the
source tree becomes less cluttered (and interactive rebasing is nice).

## Project Set-Up

The steps below will initialise the server and allow the client to communicate
with it.

### Front-end

The project uses React with Javascript to do all front-end work. The directory
containing this code can be found in `ReadRec/client`. To manage packages
npm is used.

The front-end is installed like below.

```bash
$ npm install
$ npm start
```

### Back-end

The project uses Django with Python to create a web API that the front-end
utilises. The underlying database is PostgreSQL. All commands are run from
the directory `ReadRec/server/`.

First initialise the database.

```
$ sudo su - postgres
$ psql
postgres=# CREATE DATABASE server;
postgres=# CREATE USER serveradmin WITH PASSWORD 'admin';
postgres=# ALTER ROLE serveradmin SET client_encoding TO 'utf8';
postgres=# ALTER ROLE serveradmin SET default_transaction_isolation TO 'read committed';
postgres=# ALTER ROLE serveradmin SET timezone TO 'UTC';
postgres=# GRANT ALL PRIVILEGES ON DATABASE server TO serveradmin;
postgres=# ALTER USER serveradmin CREATEDB;
postgres=# \q
postgres=# exit
```

Initialising Django.

```bash
$ python3 manage.py makemigrations
$ python3 manage.py migrate
$ python3 manage.py loaddata user.json
$ python3 manage.py loaddata catalog.json
$ python3 manage.py loaddata reviews.json
$ python3 manage.py loaddata likes.json
$ python3 manage.py loaddata usercritic.json
$ python3 manage.py loaddata collections.json
$ python3 manage.py loaddata collection_books.json
$ python3 manage.py loaddata tags.json
$ python3 manage.py runserver
```
