import { BaseComponent, IComponentOption, IComponentGenerics } from "./baseComponent";
import { createModal, elementBuilder } from "./commonUtils";
export interface IThumbnailOption extends IComponentOption {
    readonly thumbnailImage: string;
    readonly mediumImage: string;
}

interface IButtonGenerics extends IComponentGenerics {
    option: IThumbnailOption;
    element: HTMLInputElement;
}

export class ThumbnailComponent extends BaseComponent<IButtonGenerics> {
    /** @override */
    public html() {
        return `
        <div class="thumbnail-component thumbnail-zoomable thumbail-container `
            +  `${this.getClassNames()}" ${this.htmlAttr()}>
            <img class="character-image-thumbnail"  src="${this.option!.thumbnailImage}" />
        </div>`;
    }

    /** @override */
    public initElem(elem: HTMLElement, option: IThumbnailOption) {
        elem.addEventListener("click", () => {
            const mediumImage = `<div class="medium-image-container">
                <img src="${option.mediumImage}" />
            </div>`;
            createModal(elementBuilder(mediumImage), elem);
        });
    }
}
