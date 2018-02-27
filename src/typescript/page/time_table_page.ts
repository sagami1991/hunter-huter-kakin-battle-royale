import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince } from "../interfaces";
import { getThumbnailImage, elementBuilder } from "../component/commonUtils";

export class TimeTableView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "time-table";
    }
    public get title() {
        return "タイムテーブル";
    }
    public getUpdatedAt() {
        return new Date(2018, 1, 27);
    }

    public render() {
        this._element = elementBuilder(`
            <div>
            （仮ページ）
            <li>1日目12時15-30分: 第14王子の部屋でウッディーがサイレントマジョリティにより殺害</li>
            <li>出航後2時間: 第14王子の部屋でサイールドが色々殺して警護2人に</li>
            <li>出航後6時間: クラピカ絶対時間開始</li>
            <li>出航後9時間: クラピカ絶対時間の疲れで睡眠</li>
            <li>出航後18時間: クラピカ目覚める</li>
            <li>2日目9時: 第14王子の部屋で念講習会開始</li>
            <li>2日目10時: 第14王子の部屋でサイレントマジョリティによる被害者が出るが続行</li>
            <li>出航後37.5時間: クラピカとヴォルゲーが電話で会話</li>
            </div>
        `);
    }
}
