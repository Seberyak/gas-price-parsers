export class FuelData {
    name: string;
    price: number
}

export class ParsedFuelsDataDto {
    prices: FuelData[];
    date: string;
}