export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string; // 영화 포스터 이미지
    backdrop_path?: string; // 배경 이미지 (옵션: 일부 데이터에서 누락될 수 있음)
    release_date: string;
    vote_average: number;
    genre_ids?: number[]; // 장르 정보 (선택적)
}