export const authService = {
    signIn: async (email: string, password: string): Promise<boolean> => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(
            (u: { email: string; password: string }) => u.email === email && u.password === password
        );

        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUserEmail", email); // 현재 사용자 저장
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

        const updatedUsers = [...users, {email, password}];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return true;
    },

    getCurrentUserApiKey: (): string | null => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUserEmail = localStorage.getItem("currentUserEmail");
        const currentUser = users.find((u: { email: string }) => u.email === currentUserEmail);
        return currentUser ? currentUser.password : null;
    },
};