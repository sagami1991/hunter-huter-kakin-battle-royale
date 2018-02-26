import { ListView } from "./component/listView";
import { Database } from "./database";
import { IPrince, INormalPerson } from "./interfaces";

(() => {
    const contentElement = document.querySelector("#content-area") as HTMLElement;
    const paths = location.pathname.slice(1).split("/");
    if (paths[0] === "" || paths[0] === "all-prince") {
        const princes = Database.getAllPrince();
        const queens = Database.getAllQueen();
        const listView = new ListView<IPrince>({
            data: princes,
            cellOptions: [
                { label: "画像", parse: (prince) => getThumbnailImage(prince.thumbnailImage) },
                { label: "名前", parse: (prince) => prince.name },
                { label: "母親画像", parse: (prince) => getThumbnailImage(queens.get(prince.motherId)!.thumbnailImage) },
                { label: "母親", parse: (prince) => queens.get(prince.motherId)!.name },
            ],
        });
        contentElement.appendChild(listView.element);
    } else if (paths[0] === "all-normal-person") {
        const princes = Database.getAllPrince();
        const persons = Database.getAllNormalPerson();
        const belongs = Database.getAllbelong();
        const listView = new ListView<INormalPerson>({
            data: sortMap(persons, [{
                key: "belongId",
                order: 1,
                isNumericSort: true
            }, {
                key: "observerPrinceId",
                order: 1,
                isNumericSort: true
            }]),
            cellOptions: [
                {
                    label: "画像", parse: (person) => {
                        return getThumbnailImage(person.thumbnailImage, person.isDead ? "dead-image-cover" : "")
                    }
                },
                { label: "名前", parse: (person) => person.name },
                {
                    label: "所属", width: 120 ,parse: (person) => {
                        const belong = belongs.get(person.belongId);
                        return belong ? belong.name : "不明";
                    }
                },
                {
                    label: "護衛先", parse: (person) => {
                        const prince = princes.get(person.observerPrinceId)!;
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(prince.thumbnailImage) + prince.name
                            + `</div>`;
                    }
                },
                { label: "監視者", parse: (person) => person.isObserver ? "〇" : "" },
                { label: "念使用", parse: (person) => person.useNen ? "〇" : "" },
                { label: "備考", parse: (person) => person.note ? person.note : "" },
            ],
        });
        contentElement.appendChild(listView.element);
    }
})();

function getThumbnailImage(fileName: string, className?: string) {
    return `<div class="thumbail-container ${className || ""}">` +
        `<img class="character-image-thumbnail" src="/character/${fileName}" />` +
        `</div>`;
}

interface ISortOption<T> {
    key: keyof T;
    /** 1昇順　-1降順 */
    order: 1 | -1;
    isNumericSort?: boolean;
}

function sortMap<T>(map: Map<string, T>, sortOptions: Array<ISortOption<T>>) {
    const array = [...map];
    array.sort(([aKey, aVal], [bKey, bVal]) => {
        for (const sortOption of sortOptions) {
            const aValue = sortOption.isNumericSort ? parseInt(aVal[sortOption.key] as any, 10) : aVal[sortOption.key];
            const bValue = sortOption.isNumericSort ? parseInt(bVal[sortOption.key] as any, 10) : bVal[sortOption.key];
            if (aValue === undefined || aValue === null || (typeof aValue === "number" && isNaN(aValue)) ) {
                return sortOption.order * 1;
            }
            if (aValue < bValue) { return sortOption.order * -1; }
            if (aValue > bValue) { return sortOption.order * 1; }
        }
        return 0;
    });
    return new Map(array);
}
