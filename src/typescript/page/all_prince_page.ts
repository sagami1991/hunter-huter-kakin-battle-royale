import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince, IQueen } from "../interfaces";
import { getThumbnailImage, elementBuilder } from "../component/commonUtils";

export class AllPrinceView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "all-prince";
    }
    public get title() {
        return "王子・王妃一覧";
    }
    public getUpdatedAt() {
        return new Date(2018, 1, 27);
    }

    public render() {
        this._element = elementBuilder(`
        <div class="all-prince-view">
            <h2 class="content-h2">王子一覧</h2>
            <div class="prince-list-container list-view-container"></div>
            <h2 class="content-h2">王妃一覧</h2>
            <div class="queen-list-container list-view-container"></div>
        </div>
        `);
        const princes = Database.getAllPrince();
        const queens = Database.getAllQueen();
        const princeListView = new ListView<IPrince>({
            data: princes,
            cellOptions: [
                {
                    label: "画像",
                    parse: (prince) => {
                        return getThumbnailImage(prince.thumbnailImage, prince.isDead ? "dead-image-cover" : "")
                    }
                },
                { label: "名前", parse: (prince) => prince.name },
                { label: "母親画像", parse: (prince) => getThumbnailImage(queens.get(prince.motherId)!.thumbnailImage) },
                { label: "母親", parse: (prince) => queens.get(prince.motherId)!.name },
            ],
        });

        const queenListView = new ListView<IQueen>({
            data: queens,
            cellOptions: [
                {
                    label: "画像",
                    parse: (queen) => {
                        return getThumbnailImage(queen.thumbnailImage, queen.isDead ? "dead-image-cover" : "")
                    }
                },
                { label: "名前", parse: (queen) => queen.name },
                { label: "子供", parse: (queen) => {
                    return queen.childrenId.map((childId) => {
                        const prince = princes.get(childId)!;
                        return `<div class="td-image-and-text">`
                                + getThumbnailImage(prince.thumbnailImage) + prince.name
                                + `</div>`;
                    }).join("");
                } },
            ],
        });
        this._element.querySelector(".prince-list-container")!.appendChild(princeListView.element);
        this._element.querySelector(".queen-list-container")!.appendChild(queenListView.element);
    }
}
