import { useState, useEffect } from "react"
import clsx from 'clsx';
// Стили
import './CallbackForm.scss';

// Типы
import type { IndividualDataType, LegalDataType, MessageBot, ResultFormValue, ValidationErrors, SelectedContactMethod } from '../../types/types';
import { validateForm } from "../../utils/validateInput";
import { sendForm } from "@/utils/sendForm";
import CrossIcon from "@/assets/icons/cross-icon";

export default function CallbackForm() {
    const [wasteItem, setWasteItem] = useState('');
    const [formType, setFormType] = useState<'individual' | 'legal'>('individual')
    const [errorFields, setErrorFields] = useState<Array<string>>([]);
    const [messageInfo, setMessageInfo] = useState<MessageBot>({
        isSending: false,
        sendMessageStatus: false,
    })

    const [selectedContactMethod, setSelectedContactMethod] = useState<SelectedContactMethod>(null);
    const [contactValue, setContactValue] = useState('');

    const getContactMethodPlaceholder = (selectedMethod: SelectedContactMethod) => {
        switch (selectedMethod) {
            case 'phone':
                return 'Телефон';
            case 'email':
                return 'Почта';
            case 'telegram':
                return '@Telegram ID';
        }
    }

    const initialLegalData = {
        inn: { value: '', name: 'inn' },
        position: { value: '', name: 'position' },
        name: { value: '', name: 'name' },
        surname: { value: '', name: 'surname' },
    }
    const initialIndividualData = {
        name: { value: '', name: 'name' },
        surname: { value: '', name: 'surname' },
    }

    const [legalFormData, setLegalFormData] = useState<LegalDataType>(initialLegalData);
    const [individualFormData, setIndividualFormData] = useState<IndividualDataType>(initialIndividualData)

    const handleFormTypeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement;
        const targetType = target.dataset.type as 'individual' | 'legal';
        if (targetType) {
            setFormType(targetType);
            setErrorFields([]);
            setSelectedContactMethod(null);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (formType === 'individual') {
            setIndividualFormData(prev => {
                const typedName = name as keyof IndividualDataType
                return {
                    ...individualFormData,
                    [name]: {
                        ...prev[typedName],
                        value,
                    },
                }
            })
            setErrorFields(errorFields.filter(field => field !== name))
        } else {
            setLegalFormData(prev => {
                const typedName = name as keyof LegalDataType;
                return {
                    ...legalFormData,
                    [name]: {
                        ...prev[typedName],
                        value,
                    },
                }
            })
            setErrorFields(errorFields.filter(field => field !== name))
        }
    }

    const handleContactMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMethod = e.target.value as SelectedContactMethod;
        setSelectedContactMethod(selectedMethod);
        setErrorFields([]);
        setContactValue('');
    }

    const clearWaste = () => {
        sessionStorage.removeItem('waste');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>, formValues: IndividualDataType | LegalDataType) => {
        e.preventDefault();

        let validationResults: ValidationErrors;

        if (!selectedContactMethod) {
            setErrorFields([...errorFields, 'select']);
            return;
        }

        const updatedFormValues: ResultFormValue = {
            ...(formValues as any),
            ...(wasteItem ? { waste: { value: wasteItem, name: 'waste' } } : {}),
            [selectedContactMethod]: {
                value: contactValue,
                name: selectedContactMethod,
            },
        } as ResultFormValue;

        validationResults = validateForm(updatedFormValues);

        if (!validationResults.isValidate) {
            setErrorFields(validationResults.errorFields);
            return;
        }

        setMessageInfo({
            ...messageInfo,
            isSending: true,
        })
        const res = await sendForm(updatedFormValues);
        if (res.status) {
            console.log(res)
            setLegalFormData(initialLegalData);
            setIndividualFormData(initialIndividualData);
            clearWaste();
            setWasteItem('');
            return alert('Ваша заявка отправлена! Ожидайте обратной связи!');
        } else {
            console.log(res)
            return alert('Ошибка отправки формы');
        }
    }

    useEffect(() => {
        const findedWaste = sessionStorage.getItem('waste');
        if (findedWaste) {
            setWasteItem(findedWaste);
        }
    }, [wasteItem])

    const handleClearWaste = () => {
        sessionStorage.removeItem('waste');
        setWasteItem('');
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
                        <input
                            className="C-input callback-form__contacts-input"
                            name={legalFormData.inn.name}
                            placeholder="ИНН (необязательно)"
                            value={legalFormData.inn.value}
                            onChange={e => handleInputChange(e)}
                        />
                        <input
                            className={clsx("C-input callback-form__contacts-input", errorFields.includes(legalFormData.position.name) && 'error-input')}
                            name={legalFormData.position.name}
                            placeholder="Должность"
                            value={legalFormData.position.value}
                            onChange={e => handleInputChange(e)}
                        />
                    </>
                )
            }
            <input
                className={clsx("C-input callback-form__contacts-input", formType === 'individual' ? errorFields.includes(individualFormData.name.name) && 'error-input' : errorFields.includes(legalFormData.name.name) && 'error-input')}
                name={formType === 'individual' ? individualFormData.name.name : legalFormData.name.name}
                placeholder="Имя"
                value={formType === 'individual' ? individualFormData.name.value : legalFormData.name.value}
                onChange={e => handleInputChange(e)}
            />
            <input
                className={clsx("callback-form__contacts-input C-input", formType === 'individual' ? errorFields.includes(individualFormData.surname.name) && 'error-input' : errorFields.includes(legalFormData.surname.name) && 'error-input')}
                name={formType === 'individual' ? individualFormData.surname.name : legalFormData.surname.name}
                placeholder="Фамилия"
                value={formType === 'individual' ? individualFormData.surname.value : legalFormData.surname.value}
                onChange={e => handleInputChange(e)}
            />

            <div className="callback-form__contact-method">
                <select
                    className={clsx("methods-list C-input", errorFields.includes('select') && 'error-select')}
                    onChange={e => handleContactMethodChange(e)}
                    value={selectedContactMethod || 'Выберите способ связи'}
                >
                    <option className="methods-list__item" disabled>Выберите способ связи</option>
                    <option className="methods-list__item" value='phone'>Телефон</option>
                    <option className="methods-list__item" value='email'>Email</option>
                    <option className="methods-list__item" value='telegram'>Telegram ID</option>
                </select>
            </div>

            {
                selectedContactMethod && (
                    <input
                        className={clsx("callback-form__contacts-input C-input", errorFields.includes(selectedContactMethod) && 'error-input')}
                        name={selectedContactMethod}
                        placeholder={getContactMethodPlaceholder(selectedContactMethod)}
                        value={contactValue}
                        onChange={e => {
                            setContactValue(e.target.value);
                            setErrorFields(prev => prev.filter(field => field !== selectedContactMethod));
                        }}
                    />
                )
            }

            {
                wasteItem && (
                    <div className="callback-form__waste-container">
                        <input className="callback-form__waste-input C-input" name="wasteName" value={wasteItem} disabled />
                        <span className="waste-clear-icon"><CrossIcon className="cross-icon" onClick={handleClearWaste} /></span>
                    </div>
                )
            }


            <div className="form-button-container">
                <button
                    type="submit"
                    className="callback-form__submit C-button"
                    onClick={e => {
                        formType === 'individual'
                            ? handleSubmit(e, individualFormData)
                            : handleSubmit(e, legalFormData)
                    }}
                >
                    Отправить
                </button>
            </div>
        </form>
    )
}