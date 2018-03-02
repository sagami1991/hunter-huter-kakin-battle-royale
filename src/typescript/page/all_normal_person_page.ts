import { BasePageView } from "./page";
import { Database } from "../database";
import { ListView } from "../component/listView";
import { IPrince, INormalPerson, IQueen, ISortOption } from "../interfaces";
import { getThumbnailImage, sortMap, elementBuilder, createModal, getSvgIcon } from "../component/commonUtils";
import { Button } from "../component/button";

export class AllNormalPersonView extends BasePageView {

    protected _element?: HTMLElement;
    public get pageName() {
        return "all-normal-person";
    }
    public get title() {
        return "警護人一覧";
    }
    public getUpdatedAt() {
        return new Date(2018, 2, 2);
    }

    private princes!: Map<string, IPrince>;
    private queens!: Map<string, IQueen>;

    public render() {
        this._element = elementBuilder(`
        <div class="all-person-view">
            <h2 class="content-h2">警護人一覧</h2>
            <ul>
                <li>私設兵：上位5人の私設兵は王子に対する士気も忠誠心も高い。</li>
                <li>王妃所属兵：各王子の私設兵ほどには王子に対する帰属意識は強くないが王妃に対する忠誠は強い。</li>
                <li>従事者：兵士と兼任する者も、非戦闘員もいる。</li>
                <li>ハンター（クラピカ経由）：クラピカから雇われている。目的はクラピカと第4王子ツェリードニヒの接触を手助けすること。</li>
                <li>ハンター（協専）：ビヨンド（パリストン？）から雇われている。目的は暗黒大陸での任務を遂行すること。</li>
                <li>ハンター（準協会員）：渡航中期間限定のハンター協会員。チードルが人材を募るために作った制度。念については教わっていない。警護を身内で固めるため、私設兵を準協会員にさせる王子が多い。</li>
                <li>監視役：王妃所属兵または第一王子私設兵は、下位王妃の王子警護資格をもつ。下位王子を警護している人間は監視の役目。</li>
                <li>念講習会：クラピカが主催する念講習会。平等に情報を与える事で王子同士のこう着状態を図るのが目的。</li>
            </ul>
            <div class="person-list-container list-view-container"></div>
        </div>
        `);
        this.princes = Database.getAllPrince();
        this.queens = Database.getAllQueen();
        const persons = Database.getAllNormalPerson();
        const belongs = Database.getAllbelong();
        const belongSort: Array<ISortOption<INormalPerson>> = [{
            getSortValue: (row: INormalPerson) => {
                const belong = belongs.get(row.belongId);
                if (belong === undefined) {
                    return Infinity;
                }
                if (!belong.bossPersonId) {
                    return 99999;
                }
                return parseInt(belong.bossPersonId, 10);
            },
            order: 1,
        }, {
            getSortValue: (row: INormalPerson) => {
                return parseInt(row.belongId, 10);
            },
            order: 1,
        }];
        const observerSort: ISortOption<INormalPerson> = {
            getSortValue: (row: INormalPerson) => {
                return row.observerPrinceId ? parseInt(row.observerPrinceId, 10) : Infinity;
            },
            order: 1,
        };
        const listView = new ListView<INormalPerson>({
            data: sortMap(persons, [...belongSort, observerSort]),
            cellOptions: [
                {
                    label: "画像", parse: (person) => {
                        return getThumbnailImage(person.thumbnailImage, person.isDead ? "dead-image-cover" : "");
                    }
                },
                { label: "名前", width: 80, parse: (person) => person.name },
                {
                    label: "所属",
                    width: 190,
                    sort: [...belongSort, observerSort],
                    parse: (person) => {
                        const belong = belongs.get(person.belongId);
                        if (belong === undefined) {
                            return "不明";
                        }
                        if (belong.bossPersonId) {
                            let boss: IPrince | IQueen;
                            let bossType: "PRINCE" | "QUEEN";
                            const prince = this.princes.get(belong.bossPersonId);
                            if (prince === undefined) {
                                boss = this.queens.get(belong.bossPersonId)!;
                                bossType = "QUEEN";
                            } else {
                                boss = prince;
                                bossType = "PRINCE";
                            }
                            const button = this.createPopupBossButton(belong.bossPersonId, bossType);
                            return `<div class="td-image-and-text">`
                                + getThumbnailImage(boss.thumbnailImage) + belong.name
                                + button.html()
                                + `</div>`;
                        }

                        if (belong.thumbnailImage) {
                            return `<div class="td-image-and-text">`
                                + getThumbnailImage(belong.thumbnailImage) + belong.name
                                + `</div>`;
                        }
                        return belong.name;
                    }
                },
                {
                    label: "警護先",
                    width: 210,
                    sort: [observerSort, ...belongSort],
                    parse: (person) => {
                        const prince = this.princes.get(person.observerPrinceId);
                        if (prince === undefined) {
                            return "不明";
                        }
                        const button = this.createPopupBossButton(person.observerPrinceId, "PRINCE");
                        return `<div class="td-image-and-text">`
                            + getThumbnailImage(prince.thumbnailImage) + prince.name
                            + button.html()
                            + `</div>`;
                    }
                },
                {
                    label: "監視役",
                    width: 70,
                    isCenter: true,
                    sort: [
                        { getSortValue: (row) => row.isObserver ? 0 : 1, order: 1 },
                        observerSort, ...belongSort
                    ],
                    parse: (person) => person.isObserver ? `<span class="icon-common icon-spy"></span>` : ""
                },
                {
                    label: "念使用",
                    width: 70,
                    isCenter: true,
                    sort: [
                        { getSortValue: (row) => row.useNen ? 0 : 1, order: 1 },
                        ...belongSort, observerSort
                    ],
                    parse: (person) => person.useNen ? `<span class="icon-common icon-nen"></span>` : ""
                },
                {
                    label: "念講習会",
                    width: 70,
                    isCenter: true,
                    sort: [
                        { getSortValue: (row) => row.isAttendedTraining ? 0 : 1, order: 1 },
                        ...belongSort, observerSort
                    ],
                    parse: (person) => person.isAttendedTraining ? "出席" : ""
                },
                { label: "備考", width: 350, parse: (person) => person.note ? person.note : "" },
            ],
        });
        this._element.querySelector(".person-list-container")!.appendChild(listView.element);
    }


    private createPopupBossButton(bossId: string, bossType: "PRINCE" | "QUEEN") {
        return new Button({
            icon: "icon-information",
            style: "icon-only",
            className: "person-popup-button",
            onClick: () => {
                const element = this.createPopupBossElement(bossId, bossType);
                createModal(element);
            }
        });
    }
    private createPopupBossElement(bossId: string, bossType: "PRINCE" | "QUEEN"): HTMLElement {
        if (bossType === "PRINCE") {
            const prince = this.princes.get(bossId)!;
            const mother = this.queens.get(prince.motherId)!;
            const element = elementBuilder(`
                <div>
                <div class="popup-person-line" style="margin-bottom:20px">
                    ${getThumbnailImage(prince.thumbnailImage)}${prince.name}
                </div>
                <div class="popup-person-line">
                    母親:　${getThumbnailImage(mother.thumbnailImage)}
                    ${mother.name}
                </div>
                <div>${mother.childrenId.map((childId) => {
                    if (childId === bossId) {
                        return "";
                    }
                    const brother = this.princes.get(childId)!;
                    return `<div class="popup-person-line">
                            兄弟:　${getThumbnailImage(brother.thumbnailImage)}
                            ${brother.name}
                        </div>`;
                }).join("")}</div>
                </div>
            `);
            return element;
        } else if (bossType === "QUEEN") {
            const queen = this.queens.get(bossId)!;
            const children = queen.childrenId.map((childId) => this.princes.get(childId)!);
            const element = elementBuilder(`<div>
                <div class="popup-person-line" style="margin-bottom:20px">
                    ${getThumbnailImage(queen.thumbnailImage)}${queen.name}
                </div>
                <div>${children.map((child) => {
                    return `<div class="popup-person-line">
                            子供:　${getThumbnailImage(child.thumbnailImage)}
                            ${child.name}
                        </div>`;
                }).join("")}</div>
            </div>`);
            return element;
        }
        throw new Error();
    }


}
