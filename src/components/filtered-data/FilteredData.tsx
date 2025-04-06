// Стили
import './FilteredData.scss';

import ArrowIcon from '@/assets/icons/arrow-icon';
import DataList from "../data-list/DataList";
import SearchInput from "../search-input/SearchInput";
import dataJson from '/public/data/data.json';

//Функции
import { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { debounce } from '../../utils/debounce';
import { getLenis } from '@/layouts/LenisInit';

// Типы
import type { IData } from '../../types/types';

export default function FilteredData() {
    const data = dataJson as Array<IData>;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const lenis = getLenis();

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

    const handleSearch = useCallback((value: string) => {
        if (value === "") {
            setFilteredData([]); // Синхронное обновление
            setIsExpanded(true);
            return;
        }
        const filtered = filterData(value);
        setFilteredData(filtered);
        setIsExpanded(true);
    }, [data]);

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedHandleSearch(value);
    };

    const handleScrollToTop = () => {
        setIsExpanded(false)
    };

    useEffect(() => {
        const inputRec = inputRef.current.getBoundingClientRect();
        const offset = inputRec.top + window.scrollY - 145;
        lenis.scrollTo(offset, { duration: 1.2 });
    }, [inputValue]);

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