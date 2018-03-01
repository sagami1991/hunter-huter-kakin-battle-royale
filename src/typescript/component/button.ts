import { getSvgIcon, IconName, IconSize } from "./commonUtils";
import { BaseComponent, IComponentOption, IComponentGenerics } from "./baseComponent";
export interface IButtonOption extends IComponentOption {
    readonly label?: string;
    readonly icon: IconName;
    readonly iconSize?: IconSize;
    readonly style?: "icon-only" | "normal";
    readonly onClick: (_this: Button) => void;
    readonly subLabel?: string;
}

interface IButtonGenerics extends IComponentGenerics {
    option: IButtonOption;
    element: HTMLInputElement;
}

export class Button extends BaseComponent<IButtonGenerics> {
    /** @override */
    public html() {
        return `
		<button
			class="my-button-component my-button-${this.option!.style || "normal"} ${this.getClassNames()}"
			${this.htmlAttr()}
		>
			${getSvgIcon(this.option!.icon, this.option!.iconSize)}
			<div class="my-button-labels">
				<div class="my-button-label-main">
					${this.option!.label || ""}
				</div>
				<div class="my-button-label-sub">
					${this.option!.subLabel || ""}
				</div>
			</div>
		</button>
		`;
    }

    /** @override */
    public initElem(elem: HTMLElement, option: IButtonOption) {
        elem.addEventListener("click", () => option.onClick(this));
    }

    public toggleActive(toggel: boolean) {
        this.element!.classList.toggle("active", toggel);
    }
}
