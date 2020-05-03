# Online 2 Player Tic-Tac-Toe Application

# Demo : 
[http://bit.ly/stone-paper-scissor](http://bit.ly/stone-paper-scissor)

# How to use : 
1. Create a Game<br />
2. Ask the other player to join using the created Game ID.<br />
3. Play.<br />

# Features :
Can create any number of games. <br />
Quick updates using Sockets. <br />
Joined counter shows the count of players that have Joined. <br/>
Winner/Tie status.
Score 

Built using React and Python + Flask

# How to setup:
1. Clone the repo.<br>
2. create a python virtual environment, and install requirements.
### virtualenv venv
### pip install -r requirements.txt
3. Set the Database Variables in api/app/config.py. The application is configured to use Postgresql by default. <br/>
4. Create database using python manage.py create_db in api/. <br />
5. Run the application using
### flask run 

5. If you want to change UI from React, first run 
### `yarn start`
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

6. After making changes, run
### `yarn build`

Builds the app for production to the `build` folder.<br />
The Server is already configured to use React `build` App and serves it on the port specified (5000 by default).
