// Стили
import './FilteredData.scss';

import DataList from "../data-list/DataList";
import SearchInput from "../search-input/SearchInput";
import dataJson from '../../../public/data/data.json';

//Функции
import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../../utils/debounce';

// Типы
import type { IData } from '../../types/types';

export default function FilteredData() {
    const data = dataJson as Array<IData>;
    const [filteredData, setFilteredData] = useState<Array<IData>>([]);
    const [inputValue, setInputValue] = useState('');

    const filterData = (query: string) => {
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        return data.filter(item => {
            const searchableText = `${item.name} ${item.code} ${item.type} ${item.danger}`.toLowerCase();
            return queryWords.every(word => searchableText.includes(word));
        })
    }

    const handleSearch = useCallback(
        (value: string) => {
            console.log('Функция handleSearch')

            const filtered = value === ""
                ? []
                : filterData(value);
            setFilteredData(filtered);
        },
        [data]
    );

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedHandleSearch(value);
    };

    return (
        <div className="filtered-data">
            <SearchInput inputValue={inputValue} handleChange={handleInputChange} />
            {filteredData.length > 0 && <DataList filteredData={filteredData} />}
        </div>
    )
}