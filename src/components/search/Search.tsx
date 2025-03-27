import SearchIcon from '../../assets/icons/search-icon';
import './Search.scss';

// Функции
import { useEffect } from 'react';
import { parsePdf } from '../../utils/parsePdf';

export default function Search() {

    useEffect(() => {
        async function fetchData() {
            const data = await parsePdf('/docs/license.pdf');
        }
        fetchData();
    }, [])

    return (
        <div className="search">
            <SearchIcon />
            <input
                className="search__input C-input"
                type="search"
                name="searchWastes"
                placeholder="Более 10 тыс. наименований отходов"
            />
        </div>

    )
}