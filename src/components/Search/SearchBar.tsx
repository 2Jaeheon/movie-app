import React, {useState} from "react";
import "./SearchBar.css";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="영화 제목을 입력하세요..."
                value={inputValue}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default SearchBar;