## Heroku Deployment

* In package.json file, add a key engines with node and npm versions as values.
* Install heroku cli
* heroku login
* heroku create
* heroku will create a git remote for you. 
* git push heroku master. 
* To see logs, use herkou logs --tail.

## Authentication for dialogflow

* Click on the service account in the agent settings.
* Create a new service account and give it the role of dialgoflow api client as reader doesn't have querying rights and admin has too many rights.
* Create a json key file and save it somewhere safe.
* Refer [this](https://github.com/googleapis/nodejs-dialogflow#readme) to get started.