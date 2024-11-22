import React, {useState} from "react";
import "./SearchBar.css";

interface SearchBarProps {
    onSearch: (query: string) => void; // 검색 함수 (입력값을 전달)
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const [inputValue, setInputValue] = useState<string>(""); // 입력값 상태 관리

    // 입력값이 변경될 때마다 호출되는 함수
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // 입력값 상태 업데이트
        onSearch(e.target.value); // 검색 함수 호출
    };

    return (
        <div className="search-bar">
            {/* 검색창 입력 필드 */}
            <input
                type="text"
                placeholder="영화 제목을 입력하세요..." // 플레이스홀더
                value={inputValue} // 입력값 상태로 초기화
                onChange={handleInputChange} // 입력값 변경 시 handleInputChange 함수 호출
            />
        </div>
    );
};

export default SearchBar;