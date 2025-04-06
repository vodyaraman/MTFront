// Стили
import './FilteredData.scss';

import ArrowIcon from '@/assets/icons/arrow-icon';
import DataList from "../data-list/DataList";
import SearchInput from "../search-input/SearchInput";
import dataJson from '/public/data/data.json';

//Функции
import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from '../../utils/debounce';
import { getLenis } from '@/layouts/LenisInit';

// Типы
import type { IData } from '../../types/types';

export default function FilteredData() {
    const data = dataJson as Array<IData>;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [filteredData, setFilteredData] = useState<Array<IData>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const filterData = (query: string) => {
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        return data.filter(item => {
            const searchableText = `${item.name} ${item.code} ${item.type} ${item.danger}`.toLowerCase();
            return queryWords.every(word => searchableText.includes(word));
        })
    }

    const handleSearch = useCallback(
        (value: string) => {
            const filtered = value === ""
                ? []
                : filterData(value);
            setFilteredData(filtered);
            setIsExpanded(true);
        },
        [data]
    );

    useEffect(() => {
        if (!isExpanded) return;
        scrollDown();
    }, [isExpanded]);
    
    

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedHandleSearch(value);
    };

    const handleScrollToTop = () => {
        setIsExpanded(false)
    };

    const scrollDown = () => {
        const lenis = getLenis();
        const input = inputRef.current;

        if (input && lenis) {
            console.log(parent)
            const offset = input.getBoundingClientRect().top + window.scrollY;
            lenis.scrollTo(offset, { duration: 1.5 });

        }
    }

    return (
        <div className="filtered-data">
            {isExpanded && <ArrowIcon onClick={handleScrollToTop} />}
            <SearchInput ref={inputRef} inputValue={inputValue} handleChange={handleInputChange} />
            {filteredData.length > 0 && (
                <DataList filteredData={filteredData} />
            )}

        </div>
    )
}