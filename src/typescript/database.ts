import { IPrince, IQueen, IPerson, INormalPerson, IBelong } from "./interfaces";

export class Database {
    public static getAllPrince() {
        const princes = require("../database/prince.json") as { [key: string]: IPrince };
        const princeMap = objectToMap(princes);
        // const queenMap = this.getAllQueen();
        // princeMap.forEach((prince) => {
        //     prince.mother = queenMap.get(prince.motherId)!;
        // });
        return princeMap;
    }

    public static getAllQueen() {
        const queens = require("../database/queen.json") as { [key: string]: IQueen };
        const queenMap = objectToMap(queens);
        // const princeMap = this.getAllPrince();
        // queenMap.forEach((queen) => {
        //     prince.mother = queenMap.get(prince.motherId)!;
        // });
        return queenMap;
    }

    public static getAllNormalPerson() {
        const normalPersons = require("../database/normal_person.json") as { [key: string]: INormalPerson };
        const normalPersonMap = objectToMap(normalPersons);
        // const princeMap = this.getAllPrince();
        // queenMap.forEach((queen) => {
        //     prince.mother = queenMap.get(prince.motherId)!;
        // });
        return normalPersonMap;
    }

    public static getAllbelong() {
        const belongs = require("../database/belong.json") as { [key: string]: IBelong };
        const belongMap = objectToMap(belongs);
        return belongMap;
    }
}

function objectToMap<T>(obj: { [key: string]: T }): Map<string, T> {
    return new Map(Object.entries(obj));
}