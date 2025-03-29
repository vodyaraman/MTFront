// Стили
import './FilteredData.scss';

import DataList from "../data-list/DataList";
import SearchInput from "../search-input/SearchInput";
import dataJson from '../../../public/data/data.json';
import { useState, useCallback } from 'react';

// Типы
import type { IData } from '../../types/types';

export default function FilteredData() {
    const data = dataJson as Array<IData>;
    const [filteredData, setFilteredData] = useState<Array<IData>>([]);
    const [inputValue, setInputValue] = useState('');

    // Debounce функция
    const debounce = <F extends (...args: any[]) => any>(
        func: F,
        delay: number
    ) => {
        let timeout: NodeJS.Timeout | undefined;
        return function (...args: Parameters<F>): void {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = useCallback(
        (value: string) => {
            const filtered = value === ""
                ? [] // Если value пустая строка, возвращаем пустой массив
                : data.filter(item => { // Иначе фильтруем
                    return (
                        item.name.toLowerCase().includes(value) ||
                        item.code.toLowerCase().includes(value) ||
                        item.danger.toLowerCase().includes(value) ||
                        item.type.toLowerCase().includes(value)
                    );
                });
            setFilteredData(filtered);
        },
        [data]
    );

    const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [handleSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedHandleSearch(value);
    };
    console.log(filteredData)
    // ДОДЕЛАТЬ СРАБАТЫВАНИЕ DEBOUNCE НА СТИРАНИЕ СИМВОЛОВ
    return (
        <div className="filtered-data">
            <SearchInput inputValue={inputValue} handleChange={handleInputChange} />
            {filteredData.length && <DataList filteredData={filteredData} />}
        </div>
    )
}