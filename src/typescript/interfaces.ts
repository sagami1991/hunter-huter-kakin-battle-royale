export interface IPerson {
    name: string;
    image: string;
    thumbnailImage: string;
    useNen?: boolean;
    isDead?: boolean;
    isArrested?: boolean;
    isAttendedTraining?: boolean;
    note?: string;
}
export interface IPrince extends IPerson {
    motherId: string;
    nenBeastNote: string;
    nenNote?: string;
}

export interface IQueen extends IPerson {
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
    thumbnailImage?: string;
}

export interface ISortOption<T> {
    getSortValue: (row: T, key?: string) => string | number;
    /** 1昇順　-1降順 */
    order: 1 | -1;
}
