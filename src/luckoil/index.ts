import {FuelStatsRepository} from "../common/services/fuel-stats-repository";
import {LuckoilParser} from "./services/luckoil.parser";


async function main() {
    const repo = new FuelStatsRepository("lukoil");
    const parser = new LuckoilParser();

    const data = await parser.getLuckoilData();
    const res = await repo.update(data);

    console.log(res);
}

export {
    main as luckoilMain
}