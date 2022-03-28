export class FuelStatsEntity {
    tableTitle: string;
    dateLabels?: string[];
    fuel?: Fuel;
    gas?: Fuel;
}

export interface Fuel {
    titles: string[];
    pricesData: Array<string[]>;
}