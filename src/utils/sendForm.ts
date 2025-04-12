import type { ResultFormValue } from "@/types/types";

export async function sendForm(formData: ResultFormValue) {
    const botToken = import.meta.env.PUBLIC_VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.PUBLIC_VITE_TELEGRAM_CHAT_ID;
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    let messageText = '';

    function generateContactMethod() {
        if ('phone' in formData && formData.phone.value) {
            return `📞 Телефон: ${formData.phone.value}\n`;
        } else if ('email' in formData && formData.email.value) {
            return `📩 Почта: ${formData.email.value}\n`;
        } else if ('telegram' in formData && formData.telegram.value) {
            return `📱 Telegram: ${formData.telegram.value}\n`;
        }
        return '';
    }

    if ('inn' in formData) {
        messageText = `Ⓜ️ Новая заявка ♻️\n\n🪪 ИНН: ${formData.inn.value}\n📋 Должность: ${formData.position.value}\n👤 Имя: ${formData.name.value}\n👥 Фамилия: ${formData.surname.value}\n${generateContactMethod()}${'waste' in formData && `📎 Выбранный отход: ${formData.waste}\n`}`
    } else {
        messageText = `Ⓜ️ Новая заявка ♻️\n\n👤 Имя: ${formData.name.value}\n👥 Фамилия: ${formData.surname.value}\n${generateContactMethod()}${'waste' in formData && `📎 Выбранный отход: ${formData.waste?.value}\n`}`
    }

    try {
        console.log(messageText)
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
            }),
        })

        const data = await response.json();

        if (data.ok) {
            return { resp: data, status: true };
        } else {
            return { resp: 'Ошибка при отправке данных', status: false }
        }


    } catch (error) {
        return { resp: 'Ошибка при отправке запроса', status: false }
    }
}