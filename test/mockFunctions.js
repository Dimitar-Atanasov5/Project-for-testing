import { jest } from '@jest/globals';

export function mockRequest() {
    return {
        body: {},
    };
};

export function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
};
export const mockBcrypt = {
    hash: jest.fn(async (password, saltRounds) => `hashed-${password}`),
    compare: jest.fn(async (plain, hashed) => hashed === `hashed-${plain}`),
};