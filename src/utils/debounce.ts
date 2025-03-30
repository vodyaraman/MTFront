export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number
) => {
    let timeout: NodeJS.Timeout | undefined;
    return function (...args: Parameters<F>): void {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), delay);
    };
};