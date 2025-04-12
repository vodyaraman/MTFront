// Типы
import type { ResultFormValue, ValidationErrors } from '../types/types';

export const validateForm = (formValue: ResultFormValue) => {
    const phoneRegex = /^(?:\+?7|8)\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}$|^(\+?\d{11})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telegramRegex = /^@[a-zA-Z](?!.*__)(?!.*_$)[\w]{3,30}$/;

    let validateResults: ValidationErrors = {
        errorFields: [],
        isValidate: true,
    }

    for (const key in formValue) {
        if (key === 'inn') {
            continue;
        }

        const typedKey = key as keyof ResultFormValue;
        const { value, name } = formValue[typedKey]

        let isValidate;

        if (name === 'email') {
            isValidate = validateInput(value, emailRegex);
        } else if (name === 'phone') {
            isValidate = validateInput(value, phoneRegex);
        } else if (name === 'telegram') {
            isValidate = validateInput(value, telegramRegex);
        } else if (name) {
            isValidate = validateInput(value);
        }

        if (!isValidate) {
            validateResults.errorFields.push(name);
            validateResults.isValidate = false;
        }
    }

    return validateResults;
}

const validateInput = (value: string, regExp?: RegExp) => {
    if (!value) {
        return false;
    }
    if (regExp && !regExp.test(value)) {
        return false
    }
    return true;
}