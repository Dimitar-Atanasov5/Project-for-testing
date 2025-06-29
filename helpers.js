export class HttpError extends Error {
    constructor(status, messageOrErrors) {
        if (Array.isArray(messageOrErrors)) {
            super("Validation errors occurred");
            this.errors = messageOrErrors;
        } else {
            super(messageOrErrors);
            this.errors = null;
        }
        this.status = status;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        };
    };
};
