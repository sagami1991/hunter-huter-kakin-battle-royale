import { addDelegateEventListener, elementBuilder, TemplateUtil, getUuid } from "./commonUtils";
export interface ICellOption<T> {
    readonly label: string;
    readonly width?: number;
    readonly parse: (row: T) => string;
    readonly hover?: (row: T) => HTMLElement;
    readonly isCenter?: boolean;
}
export interface IListOption<T> {
    readonly data?: T[] | Map<string, T>;
    readonly cellOptions: Array<ICellOption<T>>;
}

export class ListView<T> {
    public readonly element: HTMLElement;
    private readonly cellOptions: Array<ICellOption<T>>;
    private readonly tBodyContainer: HTMLElement;
    private readonly uuid: string;
    private tableDataRows: T[] = [];
    constructor(option: IListOption<T>) {
        this.uuid = getUuid();
        this.cellOptions = option.cellOptions;
        this.element = elementBuilder(this.template());
        this.tBodyContainer = this.element.querySelector("tbody")!;
        // addDelegateEventListener(this.element, "click", ".tbody-tr", (_event, tr) => {
        //     tr.classList.toggle("highlight-row", true);
        //     this.element.querySelectorAll("tr").forEach((trElem) => {
        //         if (trElem !== tr) {
        //             trElem.classList.remove("highlight-row");
        //         }
        //     });
        // });
        // addDelegateEventListener(this.element, "mouseover", ".list-view-table-td", (_event, td) => {
        //     const columnIndex = td.getAttribute("column-index")!;
        //     const hoverCallback = this.cellOptions[+columnIndex].hover;
        //     if (hoverCallback) {
        //         const rowIndex = td.getAttribute("row-index")!;
        //         hoverCallback(this.tableDataRows[+rowIndex]);
        //     }
        // });
        if (option.data) {
            this.refreshData(option.data);
        }
        this.element.querySelector("style")!.innerHTML = this.styleTemplate(this.cellOptions);
    }

    public refreshData(data: T[] | Map<string, T>) {
        this.tBodyContainer.innerHTML = this.bodyTemplate(data);
        if (data instanceof Array) {
            this.tableDataRows = data;
        } else {
            this.tableDataRows = Array.from(data.values());
        }
    }
    private template() {
        return `
        <table class="list-view-table list-view-table-${this.uuid}">
            <thead>
                <tr>
                    ${TemplateUtil.each(this.cellOptions, (cell) => "" +
                `<th class="list-view-table-th">${cell.label}</th>`
            )}
                </tr>
            </thead>
            <tbody>
            </tbody>
            <style></style>
        </table>
        `;
    }

    private bodyTemplate(data: T[] | Map<string, T>) {
        return TemplateUtil.each(data, (row, i) => `
            <tr class="tbody-tr" data-index="${i}">
            ${TemplateUtil.each(this.cellOptions, (cell, j) => {
                return `<td class="list-view-table-td ${cell.isCenter ? "td-center" : ""}" ` +
                    ` row-index="${i}" column-index="${j}">` +
                    `${cell.parse(row)}</td>`;
            })}
            </tr>
        `);
    }

    private styleTemplate(cellOptions: Array<ICellOption<T>>) {
        return `
        ${TemplateUtil.each(cellOptions, (cell, i) => `
            .list-view-table-${this.uuid} .list-view-table-th:nth-child(${i + 1}),
            .list-view-table-${this.uuid} .list-view-table-td:nth-child(${i + 1}) {
                ${cell.width ? `width: ${cell.width}px; min-width: ${cell.width}px;` : ``}
            }
            `)
            }
		`;
    }
}
