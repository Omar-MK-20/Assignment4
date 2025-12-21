const path = require('node:path');
const fs = require('node:fs');
const express = require('express');


const usersFilePath = path.resolve('./users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath));


const port = 3000;

const server = express();
server.use(express.json());


//#region 1. Create an API that adds a new user to your users stored in a JSON file.

//#endregion

//#region 2. Create an API that updates an existing user's name, age, or email by their ID.

//#endregion

//#region 3. Create an API that deletes a User by ID.

//#endregion

//#region 4. Create an API that gets a user by their name. 

//#endregion

//#region 5. Create an API that gets all users from the JSON file.

//#endregion

//#region 6. Create an API that filters users by minimum age.

//#endregion

//#region 7. Create an API that gets User by ID.

//#endregion











server.listen(port, () =>
{
    console.log(`Server is running on port :: ${port}`);
})



