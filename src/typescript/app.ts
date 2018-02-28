import { AllPrinceView } from "./page/all_prince_page";
import { BasePageView } from "./page/page";
import { AllNormalPersonView } from "./page/all_normal_person_page";
import { dateFormat } from "./component/commonUtils";
import { TimeTableView } from "./page/time_table_page";
interface IPage {
    path: string[];
    view: new () => BasePageView;
}

class MainView {
    public init() {
        this.appendInlineSvg();
        const pages: IPage[] = [
            {
                path: ["", "all-prince"],
                view: AllPrinceView
            }, {
                path: ["all-normal-person"],
                view: AllNormalPersonView
            }, {
                path: ["person"],
                view: AllPrinceView
            }, {
                path: ["time-table"],
                view: TimeTableView
            }
        ];
        const nowPathNames = location.pathname.slice(1).split("/");
        for (const page of pages) {
            if (page.path.some((path) => path === nowPathNames[0])) {
                this.renderContent(page.view);
                return;
            }
        }
        this.setTitle("ページが見つかりません")
    }

    private appendInlineSvg() {
        const svgText = require("./resource/iconset.svg") as string;
        const svgContainer = document.querySelector(".svg-container")!;
        svgContainer.innerHTML = svgText;
    }

    private renderContent(View: new () => BasePageView) {
        const contentElement = document.querySelector("#content-area") as HTMLElement;
        const tabContainer = document.querySelector(".main-tab-container") as HTMLElement;
        const view = new View();
        const tabElement =
            tabContainer.querySelector(`.main-tab[attr-page-name="${view.pageName}"]`) as HTMLElement;
        this.setTitle(view.title);
        this.setMetadata(view.getUpdatedAt(), view.getPV())
        tabElement.classList.add("main-tab-active");
        view.render();
        contentElement.appendChild(view.element!);
        return;
    }

    private setMetadata(updatedAt: Date, pv: number) {
        const metadataElement = document.querySelector(".content-meta-data") as HTMLElement;
        const updatedAtElement = metadataElement.querySelector(".updated-value") as HTMLElement;
        // const pvElement = metadataElement.querySelector(".page-views-value") as HTMLElement;
        updatedAtElement.innerText = dateFormat(updatedAt);
        // pvElement.innerText = "" + pv;
    }

    private setTitle(title: string) {
        const contentTitle = document.querySelector(".content-h1") as HTMLElement;
        document.title = `${title} - ハンターハンター 王位継承戦データベース`;
        contentTitle.innerText = title;
    }
}

new MainView().init();
