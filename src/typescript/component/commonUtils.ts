import { ISortOption } from "../interfaces";

export function elementBuilder(html: string) {
    const container = document.createElement("div");
    container.innerHTML = html;
    if (container.children.length !== 1) {
        throw new Error(`親要素はひとつまで 数: ${container.children.length} html: ${html}`);
    }
    const element = container.firstElementChild;
    container.removeChild(element!);
    return element as HTMLElement;
}

export function addDelegateEventListener(
    elem: Element, eventName: "click" | "mouseover",
    selector: string, cb: (event: Event, originalTarget: Element) => void) {
    elem.addEventListener(eventName, (event) => {
        let target: Element | null = event.target as Element;
        while (target && target !== event.currentTarget) {
            if (elementSelectorMatches(target, selector)) {
                cb(event, target);
                break;
            }
            target = target.parentElement;
        }

    });
}

function elementSelectorMatches(element: Element, selector: string): boolean {
    if (element.matches) {
        return element.matches(selector);
    } else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selector);
    }
    console.warn("matchesメソッドが存在しない");
    return false;
}

type IForEachCallback<T> = (item: T, index: number, key?: string) => string;
export namespace TemplateUtil {
    export function each<T>(collection: T[] | Map<string, T>, cb: IForEachCallback<T>): string {
        if (collection instanceof Array) {
            return collection.map((item, index) => cb(item, index)).join("");
        } else if (collection instanceof Map) {
            return Array.from(collection.entries()).map(([key, item], i) => {
                return cb(item, i, key);
            }).join("");
        }
        throw new Error();
    }
}

export function escape(str: string) {
    return str.replace(/[&'`"<>]/g, (match) => {
        const map = {
            "&": "&amp;",
            "'": "&#x27;",
            "`": "&#x60;",
            "\"": "&quot;",
            "<": "&lt;",
            ">": "&gt;",
        };
        return (map as any)[match];
    });
}

export function xhrRequest<T>(url: string, responseType: "json" | "") {
    const xhr = new XMLHttpRequest();
    return new Promise<T>((resolve, reject) => {
        xhr.open("GET", url, true);
        xhr.responseType = responseType;
        xhr.addEventListener("load", () => {
            resolve(<T> xhr.response);
        });
        xhr.send();
    });
}

export function numberCommaFormat(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getUuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

export function getCookies() {
    const cookies = document.cookie.split(";").map((pair) => pair.split("=") as [string, string]);
    return new Map(cookies);
}

export function getThumbnailImage(fileName: string, className?: string) {
    return `<div class="thumbail-container ${className || ""}">` +
        `<img class="character-image-thumbnail" src="/character/${fileName}" />` +
        `</div>`;
}

export function createModal(content: HTMLElement, basePositionElement: HTMLElement) {
    const rect = basePositionElement.getBoundingClientRect();
    const top = rect.top + window.pageYOffset - 100;
    const left = rect.left + window.pageXOffset - 100;
    const pageWidth = document.body.scrollWidth;
    const pageheight = document.body.scrollHeight;
    const modalElement = elementBuilder(`
    <div class="modal-overlay" style="width: ${pageWidth}px; height: ${pageheight}px">
        <div class="modal-content" style="top: ${top}px; left: ${left}px;"></div>
    </div>`
    );
    modalElement.querySelector(".modal-content")!.appendChild(content);
    modalElement.addEventListener("click", (event) => {
        if (event.target === modalElement) {
            modalElement.remove();
        }
    });
    document.body.appendChild(modalElement);
}

/** 非破壊メソッド */
export function sortMap<T>(map: Map<string, T>, sortOptions: Array<ISortOption<T>>) {
    const array = Array.from(map.entries());
    array.sort(([aKey, aVal], [bKey, bVal]) => {
        for (const sortOption of sortOptions) {
            const aValue = sortOption.getSortValue(aVal, aKey);
            const bValue = sortOption.getSortValue(bVal, bKey);
            if (aValue < bValue) { return sortOption.order * -1; }
            if (aValue > bValue) { return sortOption.order * 1; }
        }
        return 0;
    });
    return new Map(array);
}

/** 破壊メソッド */
export function sortArray<T>(array: T[], sortOptions: Array<ISortOption<T>>) {
    array.sort((a, b) => {
        for (const sortOption of sortOptions) {
            const aValue = sortOption.getSortValue(a);
            const bValue = sortOption.getSortValue(b);
            if (aValue < bValue) { return sortOption.order * -1; }
            if (aValue > bValue) { return sortOption.order * 1; }
        }
        return 0;
    });
}

/** yyyy年m月d日のみ */
export function dateFormat(date: Date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export type IconName = "icon-information" | "icon-sort";
export type IconSize = "s" | "m" | "48";

export function getSvgIcon(icon: IconName, size: IconSize = "m", className?: string): string {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg icon-${size} ${className || ""}">
            <use xlink:href="#${icon}"/>
        </svg>`;
}
