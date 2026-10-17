export function paginationRange (current: number, last: number): Array<number | "...">
{
    if (last <= 7)
    {
        return Array.from ({ length: last, }, (_, index) => index + 1);
    }

    const pages = new Set<number> ([1, last, current - 1, current, current + 1].filter ((page) => page >= 1 && page <= last));
    const sorted = [...pages].sort ((left, right) => left - right);
    const range: Array<number | "..."> = [];

    sorted.forEach ((page, index) =>
    {
        const previous = sorted[index - 1];

        if (previous && page - previous > 1)
        {
            range.push ("...");
        }

        range.push (page);
    });

    return range;
}
