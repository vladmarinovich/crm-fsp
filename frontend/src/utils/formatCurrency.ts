export const formatCurrency = (value: number | string) => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;

    let formattedNumber;

    if (Math.abs(amount) >= 1000000) {
        formattedNumber = new Intl.NumberFormat('es-CO', {
            style: 'decimal',
            notation: 'compact',
            compactDisplay: 'short',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } else {
        formattedNumber = new Intl.NumberFormat('es-CO', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    return `$ ${formattedNumber} COP`;
};
