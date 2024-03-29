export const VALIDATION_RETURN_CODES = Object.freeze({
    OK: 0,
    PASSWORD_MISMATCH: 1,
    PASSWORD_MIN_LENGTH_ERROR: 2,
    USERNAME_MIN_LENGTH_ERROR: 3,
    USERNAME_EXISTS: 4,
    EMAIL_EXISTS: 5,
    INVALID_EMAIL: 6,
    UNKNOWN: -1
});

export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;