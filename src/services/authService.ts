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

    signUp: async (email: string, password: string): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existingUser = users.find((u: { email: string }) => u.email === email);

        if (existingUser) {
            return false; // 이메일 중복
        }

        // 새 사용자 저장
        const updatedUsers = [...users, {email, password}];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return true;
    },
};