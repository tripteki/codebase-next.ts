function escapeCsvCell (value: string): string
{
    if (/[",\n\r]/.test (value))
    {
        return `"${value.replace (/"/g, "\"\"")}"`;
    }

    return value;
}

export function downloadCsvFile (filename: string, rows: string[][]): void
{
    const content = rows
        .map ((row) => row.map (escapeCsvCell).join (","))
        .join ("\n");
    const blob = new Blob ([content], { type: "text/csv;charset=utf-8;", });
    const url = URL.createObjectURL (blob);
    const link = document.createElement ("a");

    link.href = url;
    link.download = filename;
    link.click ();
    URL.revokeObjectURL (url);
}
