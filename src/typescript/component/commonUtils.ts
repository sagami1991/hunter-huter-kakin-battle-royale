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
    elem: Element, eventName: "click" | "mouseover", selector: string, cb: (event: Event, originalTarget: Element) => void) {
    elem.addEventListener(eventName, (event) => {
        let target = event.target as Element;
        while (target && target !== event.currentTarget) {
            if (target.matches(selector)) {
                cb(event, target);
                break;
            }
            target = target.parentElement!;
        }

    });
}

type IForEachCallback<T> = (item: T, index: number , key?: string) => string;
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

export function sortMap<T>(map: Map<string, T>, sortOptions: Array<ISortOption<T>>) {
    const array = [...map];
    array.sort(([aKey, aVal], [bKey, bVal]) => {
        for (const sortOption of sortOptions) {
            const aValue = sortOption.getSortValue(aVal);
            const bValue = sortOption.getSortValue(bVal);
            if (aValue < bValue) { return sortOption.order * -1; }
            if (aValue > bValue) { return sortOption.order * 1; }
        }
        return 0;
    });
    return new Map(array);
}
