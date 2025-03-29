import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

export async function parsePdf(pdfUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        let data = [];

        for (let i = 1; i <= numPages; i++) {
            // параметры отбора
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items;
            const rows = groupRows(items);

            for (const row of rows) {
                const rowData = {
                    name: '',
                    code: '',
                    type: '',
                    danger: '',
                };

                for (const item of row) {
                    const x = item.transform[4];
                    const k = item.transform[0];
                    if (x >= 85 && x < 300) {
                        if (item.str.length > 1) {
                            rowData.name += item.str + ' ';
                        } else {
                            rowData.name += item.str;
                        }
                    }
                    else if (x >= 300 && x <= 359 && k != 12) {
                        rowData.code += item.str + ' '
                    }
                    else if (x > 359 && x < 440) {
                        rowData.danger = item.str;
                    }
                    else if (x >= 440 && x <= 550) {
                        rowData.type += item.str
                    }

                    for (const key in rowData) {
                        rowData[key] = rowData[key].trim();
                    }
                }
                if (rowData.type) {
                    data.push(rowData);
                }

            }

        }
        console.log(JSON.stringify(data))
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

// Функция для определения колонок на основе X координат
function getColumnPositions(items) {
    const positions = new Set();
    for (const item of items) {
        // console.log(item);
        // console.log(item.transform[4]);
        if (item.transform[4] >= 101.06 && item.str !== ' ' && item.str !== '' && item.transform[3] !== 11.04 && item.transform[3] !== 9.96) {
            positions.add(item.transform[4]); // X-координата
        }
    }
    return Array.from(positions).sort((a, b) => a - b);
}

// Функция для группировки элементов в строки на основе Y координат
function groupRows(items, tolerance = 21) {
    const rows = [];
    let currentRow = [];
    let lastY = null;

    for (const item of items) {
        if (item.transform[4] >= 90 && item.str !== ' ' && item.str !== '' && item.transform[3] !== 11.04 && item.transform[3] !== 9.96) {
            const y = item.transform[5]; // Y-координата
            if (lastY === null || Math.abs(y - lastY) <= tolerance) {
                currentRow.push(item);
            } else {
                rows.push(currentRow);
                currentRow = [item];
            }
            lastY = y;
        }
    }

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }
    return rows;
}