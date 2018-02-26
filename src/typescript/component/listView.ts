import { addDelegateEventListener, elementBuilder, TemplateUtil, getUuid } from "./commonUtils";
export interface ICellOption<T> {
    readonly label: string;
    readonly width?: number;
    readonly parse: (row: T) => string;
}
export interface IListOption<T> {
    readonly data?: T[] | Map<string, T>;
    readonly cellOptions: Array<ICellOption<T>>;
}

export class ListView<T> {
    public readonly element: HTMLElement;
    private readonly cellOptions: Array<ICellOption<T>>;
    private readonly tBodyContainer: HTMLElement;
    // tslint:disable-next-line:variable-name
    private readonly _id: string;
    constructor(option: IListOption<T>) {
        this._id = getUuid();
        this.cellOptions = option.cellOptions;
        this.element = elementBuilder(this.template());
        this.tBodyContainer = this.element.querySelector("tbody")!;
        // tslint:disable-next-line:variable-name
        addDelegateEventListener(this.element, "click", ".tbody-tr", (_event, tr) => {
            tr.classList.toggle("highlight-row", true);
            this.element.querySelectorAll("tr").forEach((trElem) => {
                if (trElem !== tr) {
                    trElem.classList.remove("highlight-row");
                }
            });
        });
        if (option.data) {
            this.refreshData(option.data);
        }
        this.element.querySelector("style")!.innerHTML = this.styleTemplate(this.cellOptions);
    }

    public refreshData(data: T[] | Map<string, T>) {
        this.tBodyContainer.innerHTML = this.bodyTemplate(data);
    }
    private template() {
        return `
        <table class="list-view-table list-view-table-${this._id}">
            <thead>
                <tr>
                    ${TemplateUtil.each(this.cellOptions, (cell) => "" +
                `<th class="list-view-table-th">
                            ${cell.label}
                        </th>`
            )}
                </tr>
            </thead>
            <tbody>
            </tbody>
            <style>
            </style>
        </table>
        `;
    }

    private bodyTemplate(data: T[] | Map<string, T>) {
        return TemplateUtil.each(data, (row, i) => `
            <tr class="tbody-tr" data-index="${i}">
            ${TemplateUtil.each(this.cellOptions, (cell) => `
                <td class="list-view-table-td">${cell.parse(row)}</td>`
            )}
            </tr>
        `);
    }

    private styleTemplate(cellOptions: Array<ICellOption<T>>) {
        // let totalWidth = 0;
        // cellOptions.forEach(cell => totalWidth += (cell.width || 0));
        // .my-list-component-${this._id} .my-list-header,
        // .my-list-component-${this._id} .my-list-body,
        // .my-list-component-${this._id} .my-list-tr {
        // 	${totalWidth ? `min-width: ${totalWidth}px;` : ""}
        // }
        return `
        ${TemplateUtil.each(cellOptions, (cell, i) => `
            .list-view-table-${this._id} .list-view-table-th:nth-child(${i + 1}),
            .list-view-table-${this._id} .list-view-table-td:nth-child(${i + 1}) {
                ${cell.width ? `width: ${cell.width}px; min-width: ${cell.width}px;` : ``}
            }
            `)
            }
		`;
    }
}
