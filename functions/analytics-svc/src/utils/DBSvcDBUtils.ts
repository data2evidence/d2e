export const convertColumnsToPg = (columns: string[]): string[] => {
    return columns.map((column) => {
        return column.toLowerCase().replace(".", "_");
    });
};

export const convertNameToPg = (name: string): string => {
    return name.toLowerCase().replace(".", "_");
};
