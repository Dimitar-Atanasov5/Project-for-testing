import { beforeEach, jest } from '@jest/globals';
import { loginUserService } from '../../services/loginUserService.js';
import { registerUserService } from '../../services/registerUserService.js';
import { users } from '../../data/users.js';
import bcrypt from 'bcrypt';
import { HttpError } from '../../helpers.js'

describe("Login service tests", () => {

    beforeEach(() => {
        users.length = 0;
    });

    it("Should login user successfully with valid credentials", async () => {

        const newUser = {
            username: "Dimitar1",
            password: "Password1",
            confirmPassword: "Password1",
            firstName: "Dimitar",
            lastName: "Dimov",
            age: "27",
            email: "dimov1@gmail.com"
        };

        await expect(registerUserService(newUser)).resolves.toMatchObject({
            status: 201,
            message: "Successful registration"
        });
        expect(users).toHaveLength(1);
        expect(users[0].password).not.toBe("Password1");
        const isMatch = await bcrypt.compare("Password1", users[0].password);
        expect(isMatch).toBe(true);

        const username = "Dimitar1";
        const password = "Password1";

        await expect(loginUserService(username, password)).resolves.toEqual(
            expect.objectContaining({
                status: 200,
                message: "Login successful",
                token: expect.any(String)
            })
        );
    });
    it("Should return 404 with non existing user", async () => {
        const invalidUserName = "Miro123";
        const invalidPassword = "Parola123";

        await expect(loginUserService(invalidUserName, invalidPassword)).rejects.toMatchObject({
            status: 404,
            message: "Invalid user"
        });
    });
    it("Should return 404 with valid username and wrong password", async () => {
        const newUser = {
            username: "Dimitar1",
            password: "TestPass1",
            confirmPassword: "TestPass1",
            firstName: "Dimitar",
            lastName: "Atanasov",
            age: "35",
            email: "dimodimo1@abv.bg"
        };
        await expect(registerUserService(newUser)).resolves.toMatchObject({
            status: 201,
            message: "Successful registration"
        });
        expect(users).toHaveLength(1);
        expect(users[0].password).not.toBe("Password1");
        const isMatch = await bcrypt.compare("Password1", users[0].password);

        const username = "Dimitar1";
        const password = "Password234"

        await expect(loginUserService(username, password)).rejects.toMatchObject({
            status: 404,
            message: "Invalid password"
        });
    });
    it("Should throw 400 for missing username input", async () => {
        const emptyusername = ""
        const somepass = "Pass1"

        await expect(loginUserService(emptyusername, somepass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
    it("Should throw 400 for missing password input", async () => {
        const username = "Someuser1"
        const emptypass = ""

        await expect(loginUserService(username, emptypass)).rejects.toMatchObject({
            status: 400,
            message: "Username and password are required"
        });
    });
});
