export interface IPerson {
    name: string;
    image: string;
    thumbnailImage: string;
    useNen?: boolean;
    isDead?: boolean;
    isAttendedTraining?: boolean;
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

export interface IBelong {
    bossPersonId: string;
    name: string;
}

export interface ISortOption<T> {
    getSortValue: (row: T) => string | number;
    /** 1昇順　-1降順 */
    order: 1 | -1;
}
