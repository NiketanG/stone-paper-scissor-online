# Online 2 Player Stone-Paper-Scissor

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

### How to setup:

1. Clone the repo.
2. Install requirements for Frontend.

```
yarn
OR
npm install
```

4. Install the requirements for Backend

```
cd api
pip install -r requirements.txt
```

3. Set the Enviroment Variables.

```
SECRET_KEY=
DATABASE_URI=
```

4. Create Database table
    > Run this inside the [`api`](/api) directory

```
python manage.py create_db
```

> The application is configured to use Postgresql by default.

5. Run the backend
    > Run this inside the [`api`](/api) directory

```
flask run
```

6. Set the Enviroment Variables for Frontend.

```
API_URL
```

7. Run the frontend server
    > Run this in the [`web`](/web) directory

```
yarn start
OR
npm run start
```

#### Production

1. Build the frontend
    > Run in `web` directory

```
yarn build
OR
npm run build
```

2. Start the server.
    > Run in `api` directory

```
flask run
```
