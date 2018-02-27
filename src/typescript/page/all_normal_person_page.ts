import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince, INormalPerson } from "../interfaces";
import { getThumbnailImage, sortMap } from "../component/commonUtils";

export class AllNormalPersonView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "all-normal-person";
    }
    public get title() {
        return "警護人一覧";
    }
    public getUpdatedAt() {
        return new Date(2018, 1, 28);
    }

    public render() {
        const princes = Database.getAllPrince();
        const persons = Database.getAllNormalPerson();
        const belongs = Database.getAllbelong();
        const listView = new ListView<INormalPerson>({
            data: sortMap(persons, [{
                getSortValue: (row) => {
                    // const belong = belongs.get(row.belongId);
                    return row.belongId ? parseInt(row.belongId, 10) : Infinity;
                },
                order: 1,
            }, {
                getSortValue: (row) => {
                    return row.observerPrinceId ?  parseInt(row.observerPrinceId, 10) : Infinity;
                },
                order: 1,
            }
            ]),
            cellOptions: [
                {
                    label: "画像", parse: (person) => {
                        return getThumbnailImage(person.thumbnailImage, person.isDead ? "dead-image-cover" : "")
                    }
                },
                { label: "名前", width: 80, parse: (person) => person.name },
                {
                    label: "所属", width: 90, parse: (person) => {
                        const belong = belongs.get(person.belongId);
                        return belong ? belong.name : "不明";
                    }
                },
                {
                    label: "警護先", width: 180, parse: (person) => {
                        const prince = princes.get(person.observerPrinceId)!;
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(prince.thumbnailImage) + prince.name
                            + `</div>`;
                    }
                },
                { label: "監視役", width: 50, parse: (person) => person.isObserver ? "監視役" : "" },
                { label: "念使用", width: 50, parse: (person) => person.useNen ? "使える" : "" },
                { label: "念講習会", width: 50, parse: (person) => person.isAttendedTraining ? "出席" : "" },
                { label: "備考", width: 350, parse: (person) => person.note ? person.note : "" },
            ],
        });
        this._element = listView.element;
    }
}
