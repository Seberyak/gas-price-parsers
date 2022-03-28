import {FirebaseRepository} from "./firebase-repository";
import {CommonResponseDto} from "../dto/common-response.dto";
import {FuelStatsEntity} from "../entity/fuel-stats.entity";
import {ParsedFuelsDataDto} from "../../luckoil/dto/parsed-fuels-data.dto";

export class FuelStatsRepository extends FirebaseRepository {
    private readonly key: string;

    constructor(key: string) {
        super();
        this.key = key;
    }

    async get(): Promise<FuelStatsEntity> {
        return super.get(this.key);
    }

    async create(fuelStats: FuelStatsEntity): Promise<CommonResponseDto<FuelStatsEntity>> {
        return super.create(this.key, fuelStats);
    }


    async update(newData: ParsedFuelsDataDto): Promise<CommonResponseDto<FuelStatsEntity>> {
        const currentFuelStats = await this.get();

        const lastRecordIdx = currentFuelStats.dateLabels?.length - 1 ?? -1;
        if (lastRecordIdx === -1) {
            return this.create(FirebaseRepository.wrapParsedDataToFuelStats(newData));
        }

        const sameDate = currentFuelStats.dateLabels[lastRecordIdx] === newData.date;
        if (sameDate) {
            return this.updateLastStats(currentFuelStats, newData);
        }
        return this.pushNewStats(currentFuelStats, newData);
    }

    private async updateLastStats(
        currentFuelStats: FuelStatsEntity,
        newData: ParsedFuelsDataDto
    ): Promise<CommonResponseDto<FuelStatsEntity>> {
        const lastRecordIdx = currentFuelStats.dateLabels.length - 1
        const pricesData = currentFuelStats.fuel.pricesData;

        const titles = currentFuelStats.fuel.titles;

        newData.prices.forEach(e => {
            const titleIndex = titles.indexOf(e.name);
            if (titleIndex === -1) {
                console.log(`title ${e.name} not found`);
                return;
            }
            if (pricesData[titleIndex] === undefined) {
                pricesData[titleIndex] = [];
            }
            pricesData[titleIndex][lastRecordIdx] = e.price.toString();

        })

        return super.update(this.key, currentFuelStats);
    }

    private async pushNewStats(
        currentFuelStats: FuelStatsEntity,
        newData: ParsedFuelsDataDto,
    ): Promise<CommonResponseDto<FuelStatsEntity>> {
        const pricesData = currentFuelStats.fuel.pricesData;
        const titles = currentFuelStats.fuel.titles;
        const dateLabels = currentFuelStats.dateLabels;

        newData.prices.forEach(e => {
            const titleIndex = titles.indexOf(e.name);
            if (titleIndex === -1) {
                console.log(`title ${e.name} not found`);
                return;
            }
            if (pricesData[titleIndex] === undefined) {
                pricesData[titleIndex] = [];
            }
            pricesData[titleIndex].push(e.price.toString());

        })
        dateLabels.push(newData.date);

        return super.update(this.key, currentFuelStats);

    }


}