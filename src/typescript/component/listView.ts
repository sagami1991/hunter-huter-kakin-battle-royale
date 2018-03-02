import { elementBuilder, TemplateUtil, getUuid, getSvgIcon, sortArray, sortMap } from "./commonUtils";
import { ISortOption } from "../interfaces";
import { ComponentScanner } from "./scanner";
import { Button } from "./button";
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
    private tableDataRows!: T[] | Map<string, T>;
    constructor(option: IListOption<T>) {
        this.uuid = getUuid();
        this.cellOptions = option.cellOptions;
        this.element = elementBuilder(this.template());
        this.tBodyContainer = this.element.querySelector("tbody")!;
        ComponentScanner.scan(this.element.querySelector("thead")!);
        if (option.data) {
            this.refreshData(option.data);
        }
        this.element.querySelector("style")!.innerHTML = this.styleTemplate(this.cellOptions);
    }

    public refreshData(data: T[] | Map<string, T>) {
        this.tBodyContainer.innerHTML = this.bodyTemplate(data);
        ComponentScanner.scan(this.tBodyContainer);
        this.tableDataRows = data;

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
                        ${ cell.sort ? new Button({
                            icon: "icon-sort",
                            className: "sort-button",
                            style: "icon-only",
                            onClick: (button) => {
                                this.sort(cell.sort!, button);
                            }
                        }).html() : ""}
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

    private sort(sortOption: Array<ISortOption<T>>, button: Button) {
        if (this.tableDataRows instanceof Array) {
            sortArray(this.tableDataRows, sortOption);
        } else {
            this.tableDataRows = sortMap(this.tableDataRows, sortOption);
        }
        this.refreshData(this.tableDataRows);
        const activedSortButton = this.element.querySelector(".list-view-thead-tr .sort-active");
        if (activedSortButton !== null) {
            activedSortButton.classList.remove("sort-active");
        }
        button.element!.classList.add("sort-active");
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
