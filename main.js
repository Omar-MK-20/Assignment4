const path = require('node:path');
const fs = require('node:fs');
const express = require('express');


const usersFilePath = path.resolve('./users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath));


const port = 3000;

// regex validation for email
const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const server = express();
server.use(express.json());


//#region Part1:Simple CRUD Operations Using Express.js:

//#region 1. Create an API that adds a new user to your users stored in a JSON file.

server.post("/add-user", (req, res) =>
{
    const newUser = req.body;

    // age validation
    if (newUser.age == undefined) return res.status(422).json({ error: "Age is required" });
    if (newUser.age < 0) return res.status(422).json({ error: "Age must be a non-negative number" });

    // name validation
    if (!newUser.name) return res.status(422).json({ error: "Name is required" });

    // email validation
    if (!newUser.email || !emailValidation.test(newUser.email)) return res.status(422).json({ error: "Invalid Email" });

    const existUser = users.find(user => user.email == newUser.email);
    if (existUser)
    {
        return res.status(409).json({ error: "Email already exist" });
    }

    req.body.id = users[users.length - 1]?.id + 1 || 1;

    users.push(req.body);
    saveData();

    return res.json({ message: "User added successfully", user: req.body });

});

//#endregion

//#region 2. Create an API that updates an existing user's name, age, or email by their ID.

server.patch("/update-user/:userId", (req, res) =>
{
    const { userId } = req.params;
    const { name, email, age } = req.body;

    // check if user exists
    const user = users.find(user => user.id == userId);
    if (!user)
    {
        return res.status(404).json({ error: "User not found" });
    }

    // Array that tracks what did updated
    let updatedData = [];

    // name update
    if (name && user.name != name) 
    {
        user.name = name;
        updatedData.push("name");
    }

    // email update
    if (email && user.email != email)
    {
        // check if email format is not correct
        if (!emailValidation.test(email)) return res.status(422).json({ error: "Invalid Email" });
        const existUser = users.find(user => user.email == email && user.id != userId);

        // check if another user has the same email
        if (existUser) return res.status(409).json({ error: "Email already exist" });
        user.email = email;
        updatedData.push("email");
    }


    // age update
    if (age != undefined && user.age != age)
    {
        // check if age is a negative number
        if (age < 0) return res.status(422).json({ error: "Age must be a non-negative number" });
        user.age = age;
        updatedData.push("age");
    }

    // if there is updated data save to the json file
    if (updatedData.length) saveData();
    return updatedData.length
        ? res.json({ message: `User ${updatedData.join(", ")} updated successfully`, user })
        : res.json({ message: `Data didn't change` });

});


//#endregion

//#region 3. Create an API that deletes a User by ID.

server.delete("/delete-user/:userId", (req, res) =>
{
    const { userId } = req.params;

    const userIndex = users.findIndex(user => user.id == userId);

    if (userIndex == -1)
    {
        return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);
    saveData();
    return res.json({ message: "User deleted successfully", users });
});

//#endregion

//#region 4. Create an API that gets a user by their name.

server.get("/user/getByName", (req, res) =>
{
    const { name } = req.query;

    if (!name)
    {
        return res.status(422).json({ error: `"name" query parameter is required` });
    }

    const filteredUsers = users.filter(user => user.name.toLowerCase() == name.toLowerCase());

    if (!filteredUsers.length)
    {
        return res.status(404).json({ error: "User name not found" });
    }

    return res.json({ message: "Success", count: filteredUsers.length, filteredUsers });

});

//#endregion

//#region 5. Create an API that gets all users from the JSON file.

server.get("/users", (req, res) =>
{
    if (!users.length) return res.json({ message: "No user data found", users });
    return res.json({ message: "Success", count: users.length, users });
});


//#endregion

//#region 6. Create an API that filters users by minimum age.

server.get("/user/getMinAge", (req, res) =>
{
    const { minAge } = req.query;

    if (minAge == undefined)
    {
        return res.status(422).json({ error: `'minAge' query parameter is required` });
    }

    if (isNaN(Number(minAge)) || Number(minAge) < 0)
    {
        return res.status(422).json({ error: `'minAge' must be non-negative number` });
    }

    const filteredUsers = users.filter(user => user.age >= minAge);

    if (!filteredUsers.length)
    {
        return res.status(404).json({ error: "No user found" });
    }

    return res.json({ message: "Success", count: filteredUsers.length, filteredUsers });

});

//#endregion

//#region 7. Create an API that gets User by ID.

server.get("/users/:userId", (req, res) =>
{
    const { userId } = req.params;

    const user = users.find(user => user.id == userId);

    if (!user)
    {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Success", user });

});

//#endregion

//#endregion



server.listen(port, () =>
{
    console.log(`Server is running on port :: ${port}`);
});




//#region Helper Functions

/**
 * A function that saves the `users` data in `users.json` file using `fs` module
 */

function saveData()
{
    try
    {
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        console.log(`User data saved successfully in users.json`);
    }
    catch (errorSavingData)
    {
        console.log({ errorSavingData });
    }
}

//#endregion