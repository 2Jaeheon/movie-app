export interface Movie {
    id: number; // 영화 고유 ID
    title: string; // 영화 제목
    overview: string; // 영화의 간단한 개요
    poster_path: string; // 영화 포스터 이미지 경로
    backdrop_path?: string; // 영화 배경 이미지 경로 (선택적)
    release_date: string; // 영화 개봉일
    vote_average: number; // 영화 평점 (1~10)
    genre_ids?: number[]; // 영화 장르 ID 목록 (선택적)
}