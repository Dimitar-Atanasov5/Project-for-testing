import { users } from '../data/users.js';
import bcrypt from 'bcrypt';
import { HttpError } from '../helpers.js'

export async function loginUserService(username, password) {
    if (!username?.trim() || !password?.trim()) {
        throw new HttpError(400, "Username and password are required");
    }

    const user = users.find(user => user.username === username);
    if (!user) {
        throw new HttpError(404, "Invalid user");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new HttpError(404, "Invalid password");
    }
    return {
        status: 200,
        message: "Login successful"
    };
};