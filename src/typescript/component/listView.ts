import { addDelegateEventListener, elementBuilder, TemplateUtil, getUuid, getSvgIcon, sortArray } from "./commonUtils";
import { ISortOption } from "../interfaces";
import { ComponentScanner } from "./scanner";
export interface ICellOption<T> {
    readonly label: string;
    readonly width?: number;
    readonly parse: (row: T) => string;
    readonly hover?: (row: T) => HTMLElement;
    readonly isCenter?: boolean;
    readonly sort?: Array<ISortOption<T>>;
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
    private tableDataRows!: T[];
    constructor(option: IListOption<T>) {
        this.uuid = getUuid();
        this.cellOptions = option.cellOptions;
        this.element = elementBuilder(this.template());
        this.tBodyContainer = this.element.querySelector("tbody")!;
        addDelegateEventListener(this.element, "click", ".list-view-table-th", (_event, th) => {
            const columnIndex = +(th.getAttribute("attr-column-index")!);
            const sortOption = this.cellOptions[columnIndex].sort;
            if (sortOption === undefined) {
                return;
            }
            sortArray(this.tableDataRows, sortOption);
            this.refreshData(this.tableDataRows);
            const activedSort = this.element.querySelector(".list-view-thead-tr .icon-sort.sort-active");
            if (activedSort !== null) {
                activedSort.classList.remove("sort-active");
            }
            th.querySelector(".icon-sort")!.classList.add("sort-active");
        });

        if (option.data) {
            this.refreshData(option.data);
        }
        this.element.querySelector("style")!.innerHTML = this.styleTemplate(this.cellOptions);
    }

    public refreshData(data: T[] | Map<string, T>) {
        this.tBodyContainer.innerHTML = this.bodyTemplate(data);
        ComponentScanner.scan(this.tBodyContainer);
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
                <tr class="list-view-thead-tr">
                    ${TemplateUtil.each(this.cellOptions, (cell, i) => "" +
                `<th class="list-view-table-th" attr-column-index="${i}">
                    <div class="list-view-th-label-container">
                        ${cell.label}
                        ${ cell.sort ? getSvgIcon("icon-sort", "s", "icon-sort") : ""}
                    </div>
                </th>`
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
