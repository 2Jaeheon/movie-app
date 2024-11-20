import React from "react";
import "./Loader.css";

interface LoaderProps {
    size?: "small" | "medium" | "large"; // 로더 크기
    color?: string; // 로더 색상
}

const Loader: React.FC<LoaderProps> = ({size = "medium", color = "#28a745"}) => {
    return (
        <div
            className={`loader ${size}`}
            style={{borderColor: `${color} transparent ${color} transparent`}}
        />
    );
};

export default Loader;