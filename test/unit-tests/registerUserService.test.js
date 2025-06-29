import { beforeAll, beforeEach, expect, jest } from '@jest/globals';
import { registerUserService } from '../../services/registerUserService.js';
import { users } from '../../data/users.js';
import bcrypt from 'bcrypt';
import { HttpError } from '../../helpers.js'


describe("registerUser service tests", () => {

    beforeEach(() => {
        users.length = 0;
    });
    // Desicion table metric.
    test.each([
        [
            { username: "", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Username is required"]
        ],
        [
            { username: "Vanko1", password: "", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Password is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["Please confirm password"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
            ["First name is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "", age: "25", email: "ivanov11@gmail.com" },
            ["Last name is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "", email: "ivanov11@gmail.com" },
            ["Age is required"]
        ],
        [
            { username: "Vanko1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "" },
            ["E-mail is required"]
        ],
        [
            { username: "", password: "", confirmPassword: "", firstName: "", lastName: "", age: "", email: "" },
            [
                "Username is required",
                "Password is required",
                "Please confirm password",
                "First name is required",
                "Last name is required",
                "Age is required",
                "E-mail is required"
            ]
        ]
    ])("Should throw an error 400 with missing fields", async (body, expectedErrors) => {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    });
});
test.each([
    [
        { username: "Ivan 1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
        ["Fields must not contain spaces (except first and last name)"]
    ],
    [
        { username: "Ivan1", password: "ivan 123", confirmPassword: "ivan 123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov11@gmail.com" },
        ["Fields must not contain spaces (except first and last name)"]
    ],
    [
        { username: "Ivan1", password: "ivan123", confirmPassword: "ivan123", firstName: "Ivan", lastName: "Ivanov", age: "2 5", email: "ivanov11@gmail.com" },
        ["Fields must not contain spaces (except first and last name)"]
    ],
    [
        { username: "Ivan1", password: "ivan 123", confirmPassword: "ivan 123", firstName: "Ivan", lastName: "Ivanov", age: "25", email: "ivanov 11@gmail.com" },
        ["Fields must not contain spaces (except first and last name)"]
    ]

])("Should throw an error 400 when internal space is present", async (body, expectedErrors) => {
    await expect(registerUserService(body)).rejects.toMatchObject({
        status: 400,
        errors: expect.arrayContaining(expectedErrors)
    });
});
// Boundary value analysis metric 
beforeEach(() => {
    users.length = 0;
});
test.each([
    { ageInput: "17", expectedErrors: ["Age must be between 18 and 99"] },
    { ageInput: "18", expectedErrors: null },
    { ageInput: "99", expectedErrors: null },
    { ageInput: "100", expectedErrors: ["Age must be between 18 and 99"] },
    { ageInput: "21aaa", expectedErrors: ["Age must be a number"] },
])("Should validate ageInput correctly", async ({ ageInput, expectedErrors }) => {
    const body = {
        username: "Dimitar77",
        password: "Parola789",
        confirmPassword: "Parola789",
        firstName: "Dimo",
        lastName: "Gerasimov",
        email: "dgerasimov123@gmail.com",
        age: ageInput
    };

    if (expectedErrors) {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    } else {
        const result = await registerUserService(body);
        expect(result.status).toBe(201);
        expect(result.message).toBe("Successful registration");
        expect(result).toHaveProperty("message");
        expect(result).toBeDefined();
    };
});
test.each([
    [
        { username: "Ivan123@", password: "Test123", confirmPassword: "Test123", firstName: "Ivan11!", lastName: "P$$etrov", age: "24aa", email: "ivan1@gmailcom" },
        ["First name must contain only letters",
            "Last name must contain only letters",
            "Age must be a number",
            "Invalid e-mail"
        ],
    ]
])("Should throw an error 400 for invalid input formats", async (body, expectedErrors) => {
    await expect(registerUserService(body)).rejects.toMatchObject({
        status: 400,
        errors: expect.arrayContaining(expectedErrors)
    });
});
test.each([
    { passInput: "Pass1", expectedErrors: ["Password must be between 6 and 12 characters"] },
    { passInput: "Pass12", expectedErrors: null },
    { passInput: "Pass12345678", expectedErrors: null },
    { passInput: "Pass123456789", expectedErrors: ["Password must be between 6 and 12 characters"] }
])("Should validate passInput correctly", async ({ passInput, expectedErrors }) => {
    const body = {
        username: "DimitarА1",
        password: passInput,
        confirmPassword: passInput,
        firstName: "Dimo",
        lastName: "Popov",
        email: "Popov12@gmail.com",
        age: "46"
    };
    if (expectedErrors) {
        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 400,
            errors: expect.arrayContaining(expectedErrors)
        });
    } else {
        const result = await registerUserService(body);
        expect(result.status).toBe(201);
        expect(result.message).toBe("Successful registration");
        expect(result).toHaveProperty("message");
        expect(result).toBeDefined();
    };
});

it("Should return 201 with 12 symbols username", async () => {
    const body = {
        username: "DimitarDimov",
        password: "Pass1Pass1",
        confirmPassword: "Pass1Pass1",
        firstName: "Ivan",
        lastName: "Ivanov",
        age: "25",
        email: "ivan1@gmail.com"
    };
    await expect(registerUserService(body)).resolves.toMatchObject({
        status: 201,
        message: "Successful registration"
    });
});

describe("Registration conflict tests", () => {

    it("Should return 409 with same username", async () => {
        const user = {
            username: "Dimo111",
            password: "Parola123",
            confirmPassword: "Parola123",
            firstName: "Dimo",
            lastName: "Hristov",
            age: "47",
            email: "dimovdimo@abv.bg"
        };

        await expect(registerUserService(user)).resolves.toMatchObject({
            status: 201,
            message: "Successful registration"
        });

        await expect(registerUserService(user)).rejects.toMatchObject({
            status: 409,
            message: "User already exists"
        });
    });
});
describe("Password hashing", () => {
    beforeEach(() => {
        users.length = 0;
    });
    it("Should add user and hash his passowrd", async () => {
        const username = "Dimo123";
        const password = "Password1";
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { username, hashedPassword };

        users.push(newUser);

        expect(users).toHaveLength(1);
        expect(users[0].password).not.toBe(password);

        const isMatch = await bcrypt.compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });
});
describe("Register user service error handling", () => {
    let registerUserService;

    beforeAll(async () => {
        jest.resetModules();
        const { mockBcrypt } = await import('../mockFunctions.js');

        jest.unstable_mockModule('bcrypt', () => ({
            default: {
                ...mockBcrypt,
                hash: jest.fn().mockRejectedValue(new Error("Bcrypt failed")),
            },
        }));

        ({ registerUserService } = await import('../../services/registerUserService.js'));
    });

    it("Should throw 500 error if bcrypt fails", async () => {
        const body = {
            username: "TestUser12",
            password: "TestPass1",
            confirmPassword: "TestPass1",
            firstName: "John",
            lastName: "Smith",
            email: "smith1@gmail.com",
            age: "45"
        };

        await expect(registerUserService(body)).rejects.toMatchObject({
            status: 500,
            message: "Server error"
        });
    });
});



