export function validatePasswordConfirmation (
    password: string,
    passwordConfirmation: string,
    message: string
): Record<string, string> | null
{
    if (password !== passwordConfirmation)
    {
        return { password_confirmation: message, };
    }

    return null;
}

export function remapPasswordConfirmationErrors (
    errors: Record<string, string>
): Record<string, string>
{
    if (errors.password && ! errors.password_confirmation)
    {
        return {
            ... errors,
            password_confirmation: errors.password,
        };
    }

    return errors;
}
