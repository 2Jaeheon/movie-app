export const authService = {
    // 로그인 처리 함수
    signIn: async (email: string, password: string): Promise<boolean> => {
        // 로컬 스토리지에서 저장된 사용자 목록을 가져옵니다.
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // 이메일과 비밀번호가 일치하는 사용자를 찾습니다.
        const user = users.find(
            (u: { email: string; password: string }) => u.email === email && u.password === password
        );

        // 사용자가 존재하면 로그인 처리
        if (user) {
            localStorage.setItem("isLoggedIn", "true"); // 로그인 상태 저장
            localStorage.setItem("currentUserEmail", email); // 현재 로그인된 사용자의 이메일 저장
            return true; // 로그인 성공
        }
        return false; // 로그인 실패
    },

    // 회원가입 처리 함수
    signUp: async (email: string, password: string): Promise<boolean> => {
        // 로컬 스토리지에서 저장된 사용자 목록을 가져옵니다.
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // 이미 등록된 이메일인지 확인
        const existingUser = users.find((u: { email: string }) => u.email === email);

        // 이미 등록된 이메일이면 실패
        if (existingUser) {
            return false; // 회원가입 실패
        }

        // 새로운 사용자 정보 추가
        const updatedUsers = [...users, {email, password}];

        // 로컬 스토리지에 업데이트된 사용자 목록 저장
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return true; // 회원가입 성공
    },

    // 현재 로그인된 사용자의 API 키 반환
    getCurrentUserApiKey: (): string | null => {
        // 로컬 스토리지에서 저장된 사용자 목록을 가져옵니다.
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUserEmail = localStorage.getItem("currentUserEmail"); // 현재 로그인된 사용자 이메일

        // 현재 사용자 이메일에 해당하는 사용자 찾기
        const currentUser = users.find((u: { email: string }) => u.email === currentUserEmail);

        // 해당 사용자가 있으면 API 키(= 비밀번호) 반환, 없으면 null 반환
        return currentUser ? currentUser.password : null;
    },
};