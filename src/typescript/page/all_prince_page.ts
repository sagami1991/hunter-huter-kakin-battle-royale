import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince, IQueen, ISortOption, INormalPerson } from "../interfaces";
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
        return new Date(2018, 2, 8);
    }

    public render() {
        this._element = elementBuilder(`
        <div class="all-prince-view">
            <h2 class="content-h2">王子一覧</h2>
            <ul>
                <li>操作系・強制型：対象者の心身共に自由を奪い操る</li>
                <li>操作系・半強制型：身体の自由を奪い操る</li>
                <li>操作系・要請型：対象者に選択の自由を与えて、自発的に能力者のために動いてもらう。強制型や半強制型に比べて消費エネルギーが少なく、多数の人間を操作できる。</li>
            </ul>
            <div class="prince-list-container list-view-container"></div>
            <h2 class="content-h2">王妃一覧</h2>
            <div class="queen-list-container list-view-container"></div>
        </div>
        `);
        const princes = Database.getAllPrince();
        const queens = Database.getAllQueen();
        const princeSort: ISortOption<IPrince> = {
            getSortValue: (_prince, key) => parseInt(key!, 10),
            order: 1
        };
        const princeListView = new ListView<IPrince>({
            data: princes,
            cellOptions: [
                {
                    label: "王子",
                    width: 190,
                    sort: [princeSort],
                    parse: (prince) => {
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(prince.thumbnailImage, prince.isDead ? "dead-image-cover" : "")
                            + prince.name
                            + `</div>`;
                    }
                },
                {
                    label: "母親",
                    width: 190,
                    sort: [{ getSortValue: (prince) => parseInt(prince.motherId, 10), order: 1 }, princeSort],
                    parse: (prince) => {
                        const queen = queens.get(prince.motherId)!;
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(queen.thumbnailImage) + queen.name
                            + `</div>`;
                    }
                },
                { label: "霊獣能力", width: 350, parse: (prince) => prince.nenBeastNote },
                { label: "固有念能力", width: 350, parse: (prince) => prince.nenNote || "" },
                { label: "備考", width: 350, parse: (prince) => prince.note || "" },
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
                {
                    label: "子供", parse: (queen) => {
                        return queen.childrenId.map((childId) => {
                            const prince = princes.get(childId)!;
                            return `<div class="td-image-and-text">`
                                + getThumbnailImage(prince.thumbnailImage) + prince.name
                                + `</div>`;
                        }).join("");
                    }
                },
            ],
        });
        this._element.querySelector(".prince-list-container")!.appendChild(princeListView.element);
        this._element.querySelector(".queen-list-container")!.appendChild(queenListView.element);
    }
}
