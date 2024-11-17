export const authService = {
    signIn: async (email: string, password: string): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
            (u: { email: string; password: string }) => u.email === email && u.password === password
        );
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            return true;
        }
        return false;
    },
};