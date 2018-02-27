import { getCookies } from "../component/commonUtils";

interface IPVList {
    [page: string]: boolean;
}

export abstract class BasePageView {
    public abstract get title(): string;
    protected abstract _element?: HTMLElement;
    public get element() {
        return this._element;
    }
    public abstract get pageName(): string;
    public abstract getUpdatedAt(): Date;
    public abstract render(): void;
    public getPV() {
        return 44;
    }

    public addPV() {
        const cookies = getCookies();
        console.log(cookies);
    }
}
