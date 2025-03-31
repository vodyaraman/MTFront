export interface IData {
    code: string,
    danger: string,
    name: string,
    type: string,
}

// Определяем типы для полей физ. лица и юр. лица
interface IFormValue {
    value: string,
    name: string,
}

export interface IndividualDataType {
    name: IFormValue;
    surname: IFormValue;
}

export interface LegalDataType {
    inn: IFormValue;
    position: IFormValue;
    name: IFormValue;
    surname: IFormValue;
}

export interface PhoneContactMethod {
    phone: IFormValue,
}

export interface MailContactMethod {
    email?: IFormValue,
}

type BaseFormValue = IndividualDataType | LegalDataType;
type ContactInfo = PhoneContactMethod | MailContactMethod;

export type ResultFormValue = | (BaseFormValue & PhoneContactMethod)
    | (BaseFormValue & MailContactMethod);

export interface ValidationErrors {
    errorFields: Array<string>,
    isValidate: boolean,
}

export interface MessageBot {
    isSending: boolean,
    sendMessageStatus: boolean,
}