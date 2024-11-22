import React from "react";
import "./Loader.css";

interface LoaderProps {
    size?: "small" | "medium" | "large"; // 로더 크기 (기본값: "medium")
    color?: string; // 로더 색상 (기본값: "#28a745")
}

const Loader: React.FC<LoaderProps> = ({size = "medium", color = "#28a745"}) => {
    return (
        <div
            className={`loader ${size}`} // 로더 크기 클래스 적용
            style={{borderColor: `${color} transparent ${color} transparent`}}
            // 로더의 색상 설정: 상단과 하단은 선택한 색상, 좌우는 투명
        />
    );
};

export default Loader;