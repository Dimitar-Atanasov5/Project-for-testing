import { registerUserService } from '../services/registerUserService.js';
import { loginUserService } from '../services/loginUserService.js';

export async function registerUserController(req, res) {
    try {
        const result = await registerUserService(req.body);
        res.status(result.status).json({
            message: result.message,
            user: result.user,
        });

    } catch (error) {
        res.status(error.status || 500).json({ error: error.errors || error.message || "Server error" });
    };
};

export async function loginUserController(req, res) {
    try {
        const result = await loginUserService(req.body);
        res.status(result.status).json({
            message: result.message,
            token: result.token
        });
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    };
};