const path = require('node:path');
const fs = require('node:fs');
const express = require('express');


const usersFilePath = path.resolve('./users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath));


const port = 3000;
const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const server = express();
server.use(express.json());


//#region Part1:Simple CRUD Operations Using Express.js:

//#region 1. Create an API that adds a new user to your users stored in a JSON file.

server.post("/add-user", (req, res) =>
{
    const newUser = req.body;

    if (!newUser.email || !emailValidation.test(newUser.email)) return res.status(422).json({ error: "Email is required" });
    if (!newUser.age) return res.status(422).json({ error: "Age is required" });
    if (!newUser.name) return res.status(422).json({ error: "Name is required" });

    const existUser = users.find(user => user.email == newUser.email);
    console.log("hello");
    if (existUser)
    {
        res.status(409).json({ error: "Email already exist" });
        return;
    }



});

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
});

console.log("end")

