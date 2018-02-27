import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince, INormalPerson, IPerson, IQueen } from "../interfaces";
import { getThumbnailImage, sortMap, elementBuilder } from "../component/commonUtils";

export class AllNormalPersonView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "all-normal-person";
    }
    public get title() {
        return "警護人一覧";
    }
    public getUpdatedAt() {
        return new Date(2018, 1, 27);
    }

    public render() {
        this._element = elementBuilder(`
        <div class="all-person-view">
            <h2 class="content-h2">警護人一覧</h2>
            <ul>
                <li>私設兵：上位5人の私設兵は王子に対する士気も忠誠心も高い。</li>
                <li>王妃所属兵：各王子の私設兵ほどには王子に対する帰属意識は強くないが王妃に対する忠誠は強い。</li>
                <li>ハンター（クラピカ経由）：クラピカから雇われている。目的はクラピカと第4王子ツェリードニヒの接触を手助けすること。</li>
                <li>ハンター（協専）：ビヨンド（パリストン？）から雇われている。目的は暗黒大陸での任務を遂行すること。</li>
                <li>ハンター（準協会員）：渡航中期間限定のハンター協会員。チードルが人材を募るために作った制度。念については教わっていない。警護を身内で固めるため、私設兵を準協会員にさせる王子が多い。</li>
                <li>監視役：王妃所属兵または第一王子私設兵は、下位王妃の王子警護資格をもつ。下位王子を警護している人間は監視の役目。</li>
            </ul>
            <div class="person-list-container"></div>
        </div>
        `);
        const princes = Database.getAllPrince();
        const queens = Database.getAllQueen();
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
                    return row.observerPrinceId ? parseInt(row.observerPrinceId, 10) : Infinity;
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
                    label: "所属",
                    width: 170,
                    parse: (person) => {
                        const belong = belongs.get(person.belongId);
                        if (belong === undefined) {
                            return "不明";
                        }
                        if (belong.bossPersonId) {
                            let boss: IPrince | IQueen;
                            const prince = princes.get(belong.bossPersonId);
                            if (prince === undefined) {
                                boss = queens.get(belong.bossPersonId)!;
                            } else {
                                boss = prince;
                            }
                            return `<div class="td-image-and-text">`
                                + getThumbnailImage(boss.thumbnailImage) + belong.name
                                + `<span class="icon-common icon-information"></span>`
                                + `</div>`;
                        }
                        return belong ? belong.name : "不明";
                    }
                },
                {
                    label: "警護先", width: 180, parse: (person) => {
                        const prince = princes.get(person.observerPrinceId)!;
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(prince.thumbnailImage) + prince.name
                            + `<span class="icon-common icon-information"></span>`
                            + `</div>`;
                    }
                },
                {
                    label: "監視役",
                    width: 50,
                    isCenter: true,
                    parse: (person) => person.isObserver ? `<span class="icon-common icon-spy"></span>` : ""
                },
                {
                    label: "念使用",
                    width: 50,
                    isCenter: true,
                    parse: (person) => person.useNen ? `<span class="icon-common icon-nen"></span>` : ""
                },
                {
                    label: "念講習会",
                    width: 50,
                    isCenter: true,
                    parse: (person) => person.isAttendedTraining ? "出席" : ""
                },
                { label: "備考", width: 350, parse: (person) => person.note ? person.note : "" },
            ],
        });
        this._element.querySelector(".person-list-container")!.appendChild(listView.element);
    }
}
