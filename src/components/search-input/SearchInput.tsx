import SearchIcon from '../../assets/icons/search-icon';
import './SearchInput.scss';

// Функции
import { useState } from 'react';

type Props = {
    inputValue: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ inputValue, handleChange }: Props) {

    return (
        <div className="search">
            <SearchIcon className='search__icon' />
            <input
                className="search__input C-input"
                type="search"
                name="searchWastes"
                placeholder="Более 10 тыс. наименований отходов"
                value={inputValue}
                onChange={e => handleChange(e)}
            />
        </div>

    )
}