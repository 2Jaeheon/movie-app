import React from "react";
import Modal from "../common/Modal";
import {Movie} from "../../models/Movie";
import "./MovieModal.css";

interface MovieModalProps {
    isOpen: boolean; // 모달 열림 상태
    movie: Movie | null; // 선택된 영화 데이터
    movieDetails: any; // 영화 상세 정보
    videoUrl: string | null; // 영화 예고편 URL
    onClose: () => void; // 모달 닫기 함수
    onWishlistToggle: () => void; // 위시리스트 토글 함수
    isInWishlist: boolean; // 영화가 위시리스트에 있는지 여부
}

const MovieModal: React.FC<MovieModalProps> = ({
                                                   isOpen,
                                                   movie,
                                                   movieDetails,
                                                   videoUrl,
                                                   onClose,
                                                   onWishlistToggle,
                                                   isInWishlist,
                                               }) => {
    // 영화가 없으면 모달을 렌더링하지 않음
    if (!movie) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={movie.title}>
            <div className="movie-modal-content">
                {/* 예고편이 있을 경우 iframe으로 표시 */}
                {videoUrl && (
                    <div className="video-wrapper">
                        <iframe
                            src={videoUrl} // 유튜브 영상 URL
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                {/* 영화 상세 정보가 있을 경우 표시 */}
                {movieDetails && (
                    <div className="movie-details">
                        <p>
                            <strong>Overview:</strong> {movieDetails.overview} {/* 영화 개요 */}
                        </p>
                        <p>
                            <strong>Release Date:</strong>{" "}
                            {movieDetails.release_date} {/* 개봉일 */}
                        </p>
                        <p>
                            <strong>Rating:</strong> ⭐ {movieDetails.vote_average} {/* 평점 */}
                        </p>
                        <p>
                            <strong>Director:</strong>{" "}
                            {movieDetails.credits?.crew?.find(
                                (crew: any) => crew.job === "Director"
                            )?.name} {/* 감독 이름 */}
                        </p>
                        <p>
                            <strong>Cast:</strong>{" "}
                            {movieDetails.credits?.cast
                                ?.slice(0, 5) // 상위 5명의 배우
                                .map((actor: any) => actor.name)
                                .join(", ")} {/* 출연진 */}
                        </p>
                        <p>
                            <strong>Genres:</strong>{" "}
                            {movieDetails.genres
                                ?.map((genre: any) => genre.name)
                                .join(", ")} {/* 영화 장르 */}
                        </p>
                        <div className="modal-actions">
                            {/* 모달 닫기 버튼 */}
                            <button
                                className="modal-button close"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            {/* 위시리스트에 추가/삭제 버튼 */}
                            <button
                                className={`modal-button action ${
                                    isInWishlist ? "remove-button" : "add-button"
                                }`}
                                onClick={onWishlistToggle}
                            >
                                {isInWishlist
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MovieModal;