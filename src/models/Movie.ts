export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path?: string;
    release_date: string;
    vote_average: number;
    genre_ids?: number[]; // 장르 정보 (선택적)
}