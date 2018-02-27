import { AllPrinceView } from "./page/all_prince_page";
import { BasePageView } from "./page/page";
import { AllNormalPersonView } from "./page/all_normal_person_page";

interface IPage {
    path: string[];
    view: new () => BasePageView;
}

class MainView {
    public init() {
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
            }
        ];

        const contentElement = document.querySelector("#content-area") as HTMLElement;
        const tabContainer = document.querySelector(".main-tab-container") as HTMLElement;
        const nowPathNames = location.pathname.slice(1).split("/");
        for (const page of pages) {
            if (page.path.includes(nowPathNames[0])) {
                const view = new page.view();
                const tabElement =
                    tabContainer.querySelector(`.main-tab[attr-page-name="${view.pageName}"]`) as HTMLElement;
                this.setTitle(view.title);
                tabElement.classList.add("main-tab-active");
                view.render();
                contentElement.appendChild(view.element!);
                return;
            }
        }
        this.setTitle("ページが見つかりません")
    }

    private setTitle(title: string) {
        const contentTitle = document.querySelector(".content-h1") as HTMLElement;
        document.title = `${title} - ハンターハンター 王位継承戦データベース`;
        contentTitle.innerText = title;
    }
}

new MainView().init();