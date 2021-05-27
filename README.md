# Aeuen

We used React to develop our project. Configurations are in app/package.json file. Main codes are in app/src/ folder. 

## App.js

The main entry point of our project. There we configure, routing and firebase login system. The code renders the header of the website and changes the content depending on the route.

## firebase.js

Needed configurations for firebase. (Credentials, Firestore, Auth, Storage)

## css folder

There we store all of our stylesheet files

## modals folder

In this folder we store all of the popup modals (i.e: request collaboration, playlist, etc.)

## components folder

Main components are stored in this folder. 

  - ### InfoSection.js
    - Home page component
  - ### Events.jsx
    - Component that renders and shows the list of events
  - ### Event.js
    - Component that renders an event item in the events list
  - ### EventDetail.js
    - Component that shows the full description of an event
  - ### CreateEvent.js
    - Component that renders the create event page
  - ### Login.js, Signup.js, Header.js
    - Components that render the login, signup pages and the header of our website
  - ### Map.js
    - This component is used in CreateEvent.js in order to show the map (MapBox)  


