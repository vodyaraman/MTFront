import SearchIcon from '../../assets/icons/search-icon';
import './SearchInput.scss';

// Функции
import { useState, forwardRef } from 'react';
import type { ForwardedRef } from 'react';

type Props = {
    inputValue: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = forwardRef(({ inputValue, handleChange }: Props, ref: ForwardedRef<HTMLInputElement>) => {

    return (
        <div className="search">
            <SearchIcon className='search__icon' />
            <input
                ref={ref}
                className="search__input C-input"
                type="search"
                name="searchWastes"
                placeholder="Более 10 тыс. наименований отходов"
                value={inputValue}
                onChange={e => handleChange(e)}
            />
        </div>

    )
})

export default SearchInput;