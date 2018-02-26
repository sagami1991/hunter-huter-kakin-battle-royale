export interface IPerson {
    name: string;
    image: string;
    thumbnailImage: string;
    useNen?: boolean;
    isDead?: boolean;
}
export interface IPrince extends IPerson {
    motherId: string;
    // mother: undefined | IQueen; // DB上は定義していない
}

export interface IQueen extends IPerson {
    // children: undefined | IPrince[]; // DB上は定義していない
    childrenId: string[];
}

export interface INormalPerson extends IPerson {
    belong: string;
    belongId: string;
    observerPrinceId: string;
    note: string;
    isObserver: boolean;

}

export interface IPage {
    path: string;
    title: string;
    updatedAt: Date;
}