import { afterEach, beforeAll, describe, jest } from '@jest/globals';
import { mockRequest, mockResponse } from '../mockFunctions.js';

let registerUserService, loginUserService;
let registerUserController, loginUserServiceController

beforeAll(async () => {
    jest.unstable_mockModule('../../services/registerUserService.js', () => ({
        registerUserService: jest.fn()
    }));

    jest.unstable_mockModule('../../services/loginUserService.js', () => ({
        loginUserService: jest.fn()
    }));

    ({ registerUserService } = await import('../../services/registerUserService.js'));
    ({ loginUserService } = await import('../../services/loginUserService.js'));

    ({ registerUserController, loginUserServiceController } = await import('../../controllers/authControllers.js'))
});

afterEach(() => {
    jest.clearAllMocks()
});
describe("Register controller unit test", () => {
    it("Should return 201 on successful registration", async () => {
        const req = mockRequest();
        req.body = {
            username: "User1",
            password: "Test123",
            confirmPassword: "Test123",
            firstName: "User",
            lastName: "Testov",
            age: "25",
            email: "user1@test.bg"
        };

        const res = mockResponse();

        registerUserService.mockResolvedValue({
            status: 201,
            message: "Successful registration",
            user: { username: "User1" }
        });

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Successful registration",
            user: { username: "User1" }
        });
    });
    it("Should throw 404 with invalid age input", async () => {
        const req = mockRequest()
        req.body = {
            username: "User11",
            password: "Test123",
            confirmPassword: "Test123",
            firstName: "User",
            lastName: "Testov",
            age: "25аа",
            email: "user1@test.bg"
        };

        const res = mockResponse();

        registerUserService.mockResolvedValue({
            status: 404,
            message: "Age must be a number"
        });

        await registerUserController(req, res);

        expect(registerUserService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "Age must be a number"
        });
    });
    it("Should return 500 and default message when error has no status or message", async () => {
        const req = mockRequest();
        req.body = { username: "User" };
        const res = mockResponse();

        registerUserService.mockRejectedValue({});

        await registerUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Server error"
        });
    });
    describe("Login controller unit tests", () => {
        it("Should return 200 with valid username and password", async () => {
            const req = mockRequest()
            req.body = {
                username: "User11",
                password: "Test123"
            };

            const res = mockResponse()

            loginUserService.mockResolvedValue({
                status: 200,
                message: "Login successful"
            });
            await loginUserServiceController(req, res);

            expect(loginUserService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful"
            });
        });
        it("Should handle error thrown by loginUserService", async () => {
            const req = mockRequest();
            req.body = { username: "User1", password: "wrong" };
            const res = mockResponse();

            loginUserService.mockRejectedValue({ message: "Invalid password", status: 404 });

            await loginUserServiceController(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
        });
        it("Should return provided error status and message from loginUserService", async () => {
            const req = mockRequest();
            req.body = { username: "WrongUser", password: "WrongPass" };
            const res = mockResponse();

            // Симулация на грешка с .status
            loginUserService.mockRejectedValue({
                message: "Invalid credentials",
                status: 401
            });

            await loginUserServiceController(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
        });
        it("Should default to status 400 when error has no status", async () => {
            const req = mockRequest();
            req.body = { username: "User", password: "pass" };
            const res = mockResponse();


            loginUserService.mockRejectedValue(new Error("Something broke"));

            await loginUserServiceController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Something broke" });
        });
        it("Should return error status and message when service throws HttpError", async () => {
            const req = mockRequest();
            req.body = { username: "SomeUser" };
            const res = mockResponse();

            registerUserService.mockRejectedValue({
                status: 409,
                message: "Username already exists"
            });

            await registerUserController(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                error: "Username already exists"
            });
        });
    });
});    
