export const VERIFY_EMAIL_REDIRECT_ERRORS: readonly string[] = [
    "The selected User does not exist",
    "User does not exist",
    "Email verification failed",
];

export const shouldRedirectVerifyEmailError = (message: string): boolean =>
    VERIFY_EMAIL_REDIRECT_ERRORS.some ((pattern: string) => message.includes (pattern));
