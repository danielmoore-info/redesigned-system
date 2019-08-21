# Magic Meds

The magic meds project was to create a smart medication dispenser which reads a patients RFID and dispenses the pills they are currently scheduled to take. The pill dispenser uses python code to dispense the pills and interface with our GraphQL api in order to track if a user has taken their medication, get what pill to dispense, authentication, etc.

The API is accompanied by a React front end which can be used to create users, create schedules, add medications, add medications to a particular user's schedules. WebSockets are used to provide real time accounts of the number of pills left in the system.

## Directory Structure

**./server** - contains the GraphQL API code.

**./docker-compose.yml** - docker-compose file to build each of the application and the prisma ORM service

**./src** - front end React code for the web interface

**./MP-300419-2307.pdf** - pdf export from the project's confluence page
