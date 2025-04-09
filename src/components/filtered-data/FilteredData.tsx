// Стили
import './FilteredData.scss';

import ArrowIcon from '@/assets/icons/arrow-icon';
import DataList from "../data-list/DataList";
import SearchInput from "../search-input/SearchInput";
import dataJson from '/public/data/data.json';

//Функции
import { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { debounce } from '../../utils/debounce';

// Типы
import type { IData } from '../../types/types';
import clsx from 'clsx';

export default function FilteredData() {
    const data = dataJson as Array<IData>;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [filteredData, setFilteredData] = useState<Array<IData>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const filterData = (query: string) => {
        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        return data.filter(item => {
            const searchableText = `${item.name} ${item.code} ${item.type} ${item.danger}`.toLowerCase();
            return queryWords.every(word => searchableText.includes(word));
        })
    }

    const scrollToInput = () => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    const scrollToTop = () => {
        window.scroll(0, 0);
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

    const handleArrowClick = () => {
        setIsExpanded(false);
        scrollToTop();
    }

    useEffect(() => {
        scrollToInput();
    }, [filteredData])

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY; // Или window.pageYOffset для старых браузеров

            if (scrollPosition > 100 && !scrolled) {
                console.log('Прокрутка больше 100px!');
                setScrolled(true);

            } else if (scrollPosition <= 100 && scrolled) {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled])

    return (
        <div className="filtered-data">
            {(isExpanded || scrolled) && <ArrowIcon className={clsx('input-up')} onClick={handleArrowClick} />}
            <SearchInput ref={inputRef} inputValue={inputValue} handleChange={handleInputChange} />
            {filteredData.length > 0 && (
                <DataList filteredData={filteredData} />
            )}
        </div>
    )
}