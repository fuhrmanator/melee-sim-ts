// https://stackoverflow.com/a/43523944/1168342
declare global {
    var sorttable: {
        init: () => void,
        makeSortable: (t: HTMLTableElement) => void,
        guessType: (t: HTMLElement, col: number) => void,
        getInnerText: (node: HTMLElement) => void,
        reverse: (tbody: HTMLElement) => void,
        sort_numeric: (a: string, b: string) => void,
        sort_alpha: (a: string, b: string) => void,
        sort_ddm: (a: string, b: string) => void,
        sort_mmdd: (a: string, b: string) => void,
        shaker_sort: (a: string, b: string) => void,
        innerSortFunction: (e: HTMLTableCellElement) => void
    }
}
export { sorttable };
