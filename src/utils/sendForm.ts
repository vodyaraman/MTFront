import type { ResultFormValue } from "@/types/types";

export async function sendForm(formData: ResultFormValue) {
    '❗️👤🪪📩📋'
    const botToken = import.meta.env.PUBLIC_VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.PUBLIC_VITE_TELEGRAM_CHAT_ID;
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log(botToken, chatId)

    const msgQuery = Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n');

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: msgQuery,
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