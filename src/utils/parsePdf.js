import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

export async function parsePdf(pdfUrl) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        let data = [];

        for (let i = 1; i <= 1; i++) {
            // параметры отбора
            const targetTextHeight = 9;
            const codeWidth = 60.68699999999984;
            const typesArray = ['Транспортирование', 'Утилизация', 'Сбор', 'Обезвреживание'];
            const dangerClassArray = ['I', 'II', 'III', 'IV', 'V'];
            //

            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items;

            // Assume columns are relatively consistent in X positions
            // Find the approximate X positions for each column
            const columnPositions = findColumnPositions(items);

            // Group the text items into rows based on their Y positions
            const rows = groupTextItemsIntoRows(items);

            for (const row of rows) {
                const rowData = {
                    name: '',
                    code: '',
                    type: ''
                };

                for (const item of row) {
                    const column = determineColumn(item.transform[4], columnPositions); // X position is transform[4]
                    console.log(column)
                    switch (column) {
                        case 0: // Name
                            rowData.name += item.str + ' ';
                            break;
                        case 1: // Code
                            rowData.code += item.str; // Do NOT add space; codes are often split
                            break;
                        case 2: // Type
                            rowData.type += item.str + ' ';
                            break;
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

// Helper function to find approximate column positions
function findColumnPositions(items) {
    const positions = new Set();
    for (const item of items) {
        positions.add(item.transform[4]); // X position
    }
    return Array.from(positions).sort((a, b) => a - b); // Sorted X positions
}

// Helper function to group text items into rows based on Y position
function groupTextItemsIntoRows(items, tolerance = 2) {
    const rows = [];
    let currentRow = [];
    let lastY = null;

    for (const item of items) {
        const currentY = item.transform[5]; // Y position

        if (lastY === null || Math.abs(currentY - lastY) < tolerance) {
            currentRow.push(item);
        } else {
            rows.push(currentRow);
            currentRow = [item];
        }
        lastY = currentY;
    }

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }
    return rows;
}

// Helper function to determine which column an item belongs to
function determineColumn(xPosition, columnPositions, tolerance = 3) {
    for (let i = 0; i < columnPositions.length; i++) {
        if (Math.abs(xPosition - columnPositions[i]) < tolerance) {
            return i; // Column index
        }
    }
    return -1; // Unknown column
}