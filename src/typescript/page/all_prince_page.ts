import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince } from "../interfaces";
import { getThumbnailImage } from "../component/commonUtils";

export class AllPrinceView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "all-prince";
    }
    public get title() {
        return "王子・王妃一覧";
    }
    public getUpdatedAt() {
        return new Date(2018, 1, 28);
    }

    public render() {
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
        this._element = listView.element;
    }
}
