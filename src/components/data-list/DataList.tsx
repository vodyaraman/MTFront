// Стили
import type { IData } from '../../types/types';
import './DataList.scss';

type Props = {
    filteredData: Array<IData>
}

type RowProps = {
    item: IData,
}

export default function DataList({ filteredData }: Props) {
    return (
        <div className="data-list">
            <ul className="data-list__list">
                <p className='data-list__header-text'>Наименование вида отхода</p>
                <p className='data-list__header-text'>Код отхода по федеральному классификационному каталогу отходов</p>
                <p className='data-list__header-text'>Класс опасности для окружающей среды</p>
                <p className='data-list__header-text'>Виды работ, выполняемые в составе лицензируемого вида деятельности</p>
                {
                    filteredData.map(item => (
                        <TableRow key={item.name + item.code + item.type} item={item} />
                    ))
                }
            </ul>
        </div>
    )
}

function TableRow({ item }: RowProps) {
    return (
        <>
            <li className='data-list__list-item'>{item.name}</li>
            <li className='data-list__list-item'>{item.code}</li>
            <li className='data-list__list-item'>{item.danger}</li>
            <li className='data-list__list-item'>{item.type}</li>
        </>
    );
}