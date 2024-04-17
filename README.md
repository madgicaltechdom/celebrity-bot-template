# Celebrity Chatbot Template

Welcome to our guide on making your own celebrity chatbot using our easy template! In this guide, we'll show you step-by-step how to customize the template and create your own celebrity chatbot. Let's get started!


# Prerequisites
Before you begin, ensure you have met the following requirements:

* Node.js and npm installed
* Nest.js CLI installed (npm install -g @nestjs/cli)
* MySQL database accessible

## Getting Started
### Installation and setup
Before moving on to the development part, let's set up a few things that are needed. Follow the below-mentioned steps
 
* Clone the GitHub repository: Open this GitHub Repo and fork it in your organization. Once you have forked it, clone the repository in your preferred IDE. using this command
git clone "URL" 
Move to the working directory using the cd celebrity-bot-template command

* Install the required packages: 
Node.js and npm installed 
Nest.js CLI installed (npm install -g @nestjs/cli)
MySQL database accessible 

* Update Environment Variables: In the cloned repository, you will find a demo .env.text file. Change the file name to .env and add your configuration details, like swift API URL, API key, data_base name, DB_Host, etc.

```bash
API_URL = API_URL
BOT_ID = BOT_ID
API_KEY = API_KEY
DATA_BASE=DATA_BASE
DB_HOST=DB_HOST
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
```
# Webhook URL Setup
 Here's a step-by-step guide to get you started smoothly:

1. ### Sign up for Ngrok: 
Begin by accessing this URL and creating an account on Ngrok. Follow the sign-up process diligently to acquire your authorization token.

2. ### Configure Ngrok: 
Open your terminal and input the commandngrok config add-authtoken <TOKEN>, replacing <TOKEN> with your authorization token. This step authorizes Ngrok to function properly

3. Open a new terminal and run this command:
ngrok http 3000. This will generate a forwarding URL. Copy and save this.

4. Open Postman or any other API platform

5. Generate a new PUT request and insert the API https://v1-api.swiftchat.ai/api/bots/<bot-id>/webhook-url into the URL field, ensuring to replace <bot-id> with your specific bot ID.

6. Add the Bearer API-Key in the authorization tab

7. Add this to the body and send the request. By doing so, the webhook URL will be in the bot for sending and receiving responses.
`{"webhook_url": "<Forwarding URL/message>"}`


# Understanding the Flow
Let's dive into the flow of the celebrity chatbot template so we can grasp how it operates and make any desired modifications:

## Initiating Interaction:
The conversation begins when a user initiates a greeting message such as "hi" or any other greeting.

## Greeting and Main Menu:
- Upon receiving a greeting, the bot responds with a welcoming message.
- The bot presents the user with five main options represented as buttons:
    - "About Celebrity"
    - "Latest News and Project"
    - "Social Media Links"
    - "Ask a Question"
    - "Report a Problem"

## Interaction Paths:
 ### About Celebrity:
    - If the user selects the "About Celebrity" option, the bot displays a brief biography or information about the celebrity.
    - A button is provided to return to the main menu.
 ### Latest News and Project:
    - Choosing the "Latest News and Project" option leads to the display of dummy news about the celebrity and their ongoing projects.
    - Two buttons are presented:
      - "Back to Main Menu": Returns the user to the main menu.
      - "Ask a New Question": Allows the user to pose a question related to the news or projects.
 ### Social Media Links:
    - Upon selecting the "Social Media Links" option, the bot showcases links to the celebrity's social media profiles.
    - A button is included for returning to the main menu.
 ### Ask a Question:
    - Opting for the "Ask a Question" feature prompts the bot to ask the user to pose a question.
    - After the user submits their question, the bot provides a dummy response.
    - Two buttons are available:
       - "Back to Main Menu": Returns the user to the main menu.
       - "Ask a New Question": Allows the user to ask another question.
 ### Report a Problem:
    - If the user selects the "Report a Problem" option, the bot presents a form for the user to report any issues.
    - A button is provided for returning to the main menu.

## Navigational Control:
  - Throughout the interaction, the user can easily navigate between different options and return to the main menu using the "Back to Main Menu" button.
  - "Ask a new question" button follows the same process as Asking a Question

  # Making Modifications
  Now that we've completed the setup phase and made the initial adjustments, let's proceed to the development phase, where you'll have the opportunity to customize your celebrity chatbot.

  ## Update strings:
   - Navigate to the cloned repository and locate the i18n folder.
   - Within the i18n folder, you'll find files for English and possibly other languages.
   - Open the English-localized file, which contains all the text strings and button labels used in our chatbot template.
   - Update the strings like the welcomeMessage, button_option_body, about_celebrity, latest_news, social_media, ask_a_Question, report_problem, backMainMenuMessage, backMainewAskMessage.

 ## Update buttons:
   - Open the same file within the cloned repository. Look for the section where buttons are defined, typically labeled as "button_options."
   - Within this section, you'll find an array of button objects representing the main menu options for your celebrity chatbot.
   - To add or update buttons, simply modify the existing objects or add new ones as needed. Each button object typically includes properties such as type, body (display text), and reply (the message sent back to the bot when the button is clicked).
   - You can customize the button options according to your requirements. For example, you may want to add more options such as "Celebrity Bio" or "Recent Projects."
   - Additionally, if you have sub-categories for specific main menu options, you can create separate arrays within the button configuration file. For instance, if you have sub-categories for "Latest News and Projects," create a variable named "Latest News and Projects" and define sub-category buttons within it.

 ## Creating Functions for Each Button:
   - The chat folder under the src directory contains five files: `aboutcelebrity.service.ts`, `latestnews.serivice.ts`, `socialmedia.service.ts`, `askaquestion.service.ts`, and `reportproblem.service.ts`. 
   - These files handle specific functionalities related to user interactions with the celebrity chatbot. 
   - Developers can modify or add functionality within these files to customize the behavior of the chatbot according to their requirements. 
   - Each file corresponds to a specific button option presented to the user, such as "About the Celebrity," "Latest News and Projects," "Social Media Links," "Ask a Question," and "Report a Problem."
   -  Adjust parameters and remove undesired ones in the `chatbot.service` file accordingly.

# All Set!
With the necessary changes implemented, dependencies installed, and webhook URL configured, we're ready to proceed. Let's get started!
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Link
* [Documentation](https://app.clickup.com/43312857/v/dc/199tpt-7824/199tpt-25476)
