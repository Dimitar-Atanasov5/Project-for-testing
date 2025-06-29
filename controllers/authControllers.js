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
        res.status(error.status || 500).json({ error: error.message || "Server error" });
    };
};

export async function loginUserServiceController(req, res) {
    try {
        const result = await loginUserService(req.body);
        res.status(result.status).json({
            message: result.message
        });
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    };
};