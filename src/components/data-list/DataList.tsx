// Стили
import type { IData } from '../../types/types';
import './DataList.scss';

type Props = {
    filteredData: Array<IData>,
    onLinkClick: (wasteStr: string) => void;
}

type RowProps = {
    item: IData,
    onLinkClick: (wasteStr: string) => void;
}

export default function DataList({ filteredData, onLinkClick }: Props) {
    return (
        <ul className="data-list">
            <div className="data-list__header">
                <p className='data-list__header-text'>Наименование вида отхода</p>
                <p className='data-list__header-text'>Код отхода по федеральному классификационному каталогу отходов</p>
                <p className='data-list__header-text'>Класс опасности для окружающей среды</p>
                <p className='data-list__header-text'>Виды работ, выполняемые в составе лицензируемого вида деятельности</p>
            </div>
            <div className="data-list__main">
                {
                    filteredData.map(item => (
                        <TableRow key={item.name + item.code + item.type} item={item} onLinkClick={onLinkClick} />
                    ))
                }
            </div>
        </ul>
    )
}

function TableRow({ item, onLinkClick }: RowProps) {
    return (
        <a className='data-list__waste-link' href='/contacts' onClick={() => onLinkClick(item.name)}>
            <li className='data-list__row'>
                <span className='data-list__row-item'>{item.name}</span>
                <span className='data-list__row-item'>{item.code}</span>
                <span className='data-list__row-item'>{item.danger}</span>
                <span className='data-list__row-item'>{item.type}</span>
            </li>
        </a>
    );
}