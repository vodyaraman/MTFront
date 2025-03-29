import { useState } from "react"
import clsx from 'clsx';
// Стили
import './CallbackForm.scss';

//Название компании, ИНН, ФИО, Должность, номер телефона, почта

export default function CallbackForm() {

    const [formType, setFormType] = useState<'individual' | 'legal'>('individual')

    const handleFormTypeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        const targetType = target.dataset.type as 'individual' | 'legal';
        if (targetType) {
            setFormType(targetType);
        }
    }

    return (
        <form className="callback-form">
            <div className="callback-form__types">
                <button
                    type="button"
                    data-type="individual"
                    className={clsx("callback-form__individual callback-type-button", formType === 'individual' && 'active-type')}
                    onClick={e => handleFormTypeChange(e)}
                >
                    Физ. лицо
                </button>
                <button
                    type="button"
                    data-type="legal"
                    className={clsx("callback-form__legal callback-type-button", formType === 'legal' && 'active-type')}
                    onClick={e => handleFormTypeChange(e)}
                >
                    Юр. лицо
                </button>
            </div>
            {
                formType === 'legal' && (
                    <>
                        <input className="C-input callback-form__contacts-input" name="INN" placeholder="ИНН" />
                        <input className="C-input callback-form__contacts-input" name="position" placeholder="Должность" />
                    </>
                )
            }
            <input className="C-input callback-form__contacts-input" name="name" placeholder="Имя" />
            <input className="C-input callback-form__contacts-input" name="surname" placeholder="Фамилия" />
            <input className="C-input callback-form__contacts-input" name="phone" placeholder="Номер телефона" />
            <input className="C-input callback-form__contacts-input" type="email" name="email" placeholder="Почта" />
            <div className="form-button-container">
                <button type="submit" className="callback-form__submit C-button">Отправить</button>
            </div>
        </form>
    )
}