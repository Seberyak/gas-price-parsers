import firebase from "../../firebase";
import {CommonResponseDto} from "../dto/common-response.dto";
import {FuelStatsEntity} from "../entity/fuel-stats.entity";
import {ParsedFuelsDataDto} from "../../luckoil/dto/parsed-fuels-data.dto";


export class FirebaseRepository {
    private db = firebase.ref("/");

    async getAll<T>(): Promise<T> {
        return this.db.get().then(r => r.val());
    }

    async create(key, data: any): Promise<CommonResponseDto<any>> {
        return this.db.set(data).then(r => {
            return {
                success: true,
                message: `New Record created at ${key} key`,
                data: r
            }
        }).catch(e => {
            return {
                success: false,
                message: `Error creating new record at ${key} key : \n ${e}`,
            }
        });
    }

    update(key, value): Promise<CommonResponseDto<any>> {
        return this.db.child(key).set(value).then(() => {
            return {
                success: true,
                message: `Record updated at ${key} key`,
                data: value
            }
        }).catch(e => {
            return {
                success: false,
                message: `Error updating record at ${key} key : \n ${e}`,
            }
        });
    }

    delete(key): Promise<any> {
        return this.db.child(key).remove();
    }

    async get(key): Promise<any> {
        return this.db.child(key).once("value").then(r => r.val());
    }

    deleteAll(): Promise<any> {
        return this.db.remove();
    }

    public static wrapParsedDataToFuelStats(arg: ParsedFuelsDataDto): FuelStatsEntity {
        const luckoilList = arg.prices;

        const dateStr = new Date().toJSON();
        return {
            tableTitle: "Luckoil",
            dateLabels: [dateStr],
            fuel: {
                pricesData: luckoilList.map(e => [e.price.toString()]),
                titles: luckoilList.map(e => e.name)
            }
        };
    }
}

