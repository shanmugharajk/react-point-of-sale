# node-react-pos

Steps to deploy the backend api in heroku

1. create a Heroku app
    `heroku create app-name-here`

2. Push the code to heroku git
    `git push heroku master`

3. Run the server
    `heroku ps:scale web=1`

4. Add the following variables in the `Config Vars` section under the `Settings` tab in your heroku app.
    `IS_PROD=true, JWT_SECRET=your secret here`

5. To chceck whether it is deployed fine run
    `heroku open`
This will give `Cannot GET /` in the browser. Since this is not configured route, so thats fine.

6. To connect the hosted api to the react project run
    `yarn start:web`
(Update your api domain in the script)
