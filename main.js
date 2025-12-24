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
    if (!newUser.age) return res.status(422).json({ error: "Age is required" });
    if (newUser.age < 0) return res.status(422).json({ error: "Age must be a non-negative number" });

    // name validation
    if (!newUser.name) return res.status(422).json({ error: "Name is required" });

    // email validation
    if (!newUser.email || !emailValidation.test(newUser.email)) return res.status(422).json({ error: "Invalid Email" });

    const existUser = users.find(user => user.email == newUser.email);
    if (existUser)
    {
        res.status(409).json({ error: "Email already exist" });
        return;
    }

    req.body.id = users[users.length - 1]?.id + 1 || 1;

    saveData(req.body);

    return res.json({ message: "User added successfully", user: req.body });

});

//#endregion

//#region 2. Create an API that updates an existing user's name, age, or email by their ID.

server.patch("/update-user/:userId", (req, res) =>
{
    const { userId } = req.params;
    const { name, email, age } = req.body;

    const user = users.find(user => user.id == userId);

    let updatedData = [];

    if (name && user.name != name) 
    {
        user.name = name;
        updatedData.push("name");
    }

    if (email && user.email != email)
    {
        if (!emailValidation.test(email)) return res.status(422).json({ error: "Invalid Email" });
        const existUser = users.find(user => user.email == email && user.id != userId);
        if (existUser) return res.status(409).json({ error: "Email already exist" });
        user.email = email;
        updatedData.push("email");
    }

    if (age && user.age != age)
    {
        if (age < 0) return res.status(422).json({ error: "Age must be a non-negative number" });
        user.age = age;
        updatedData.push("age");
    }

    console.log("🚀 ~ updatedData.length:", updatedData.length);
    return updatedData.length
        ? res.json({ message: `User ${updatedData.join(", ")} updated successfully`, user })
        : res.json({ message: `Data didn't change` });


    saveData()

});


//#endregion

//#region 3. Create an API that deletes a User by ID.

//#endregion

//#region 4. Create an API that gets a user by their name. 

//#endregion

//#region 5. Create an API that gets all users from the JSON file.

server.get("/get-all-users", (req, res) =>
{
    res.json({ message: "Success", users });
});


//#endregion

//#region 6. Create an API that filters users by minimum age.

//#endregion

//#region 7. Create an API that gets User by ID.

//#endregion





server.listen(port, () =>
{
    console.log(`Server is running on port :: ${port}`);
});







//#region Helper Functions


/**
 * A function that saves the data in `users.json` file using `fs` module
 * @param {object[]} data - The data that will be saved in `users.json`.
 */

function saveData(data)
{
    try
    {
        users.push(data);
        fs.writeFileSync(usersFilePath, JSON.stringify(users));
        console.log(`User data saved successfully in users.json`);
    }
    catch (errorSavingData)
    {
        console.log({ errorSavingData });
    }
}
