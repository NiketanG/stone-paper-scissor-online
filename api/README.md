# Online 2 Player Stone-Paper-Scissor - API

[Demo](http://bit.ly/stone-paper-scissor)

### How to use :

1. Create a Game
2. Ask the other player to join using the created Game ID.
3. Play.

### Features :

-   Unlimited games
-   Realtime updates using Sockets
-   Online counter shows the count of players that have Joined.
-   Winner/Tie status.

### How to setup backend:

1. Clone the repo.
2. Install requirements.

```
pip install -r requirements.txt
```

3. Set the Enviroment Variables.

```
SECRET_KEY=
DATABASE_URI=
```

4. Create Database table
    > Run these inside the `api` directory

```
python manage.py create_db
```

> The application is configured to use Postgresql by default.

5. Run the backend using

```
flask run
```