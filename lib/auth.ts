// app/lib/auth.ts
export const validateCredentials = (username: string, password: string) => {
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_USERNAME;

    return username === adminUsername && password === adminPassword;
};