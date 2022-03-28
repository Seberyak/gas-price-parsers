import {FuelData, ParsedFuelsDataDto} from "../dto/parsed-fuels-data.dto";
import axios from "axios";
import {getInnerHtml} from "../../common/utils/get-inner-html";
import {clearResultText} from "../../common/utils/clear-result-text";

export class LuckoilParser {

    private async getLuckoilPriceList(): Promise<FuelData[]> {
        const {data} = await axios.get('http://www.lukoil.ge');

        const innerHtml = getInnerHtml(data, ".card-container");

        const res = clearResultText(innerHtml);
        return this.normalizeData(res);
    }

    async getLuckoilData(): Promise<ParsedFuelsDataDto> {
        const prices = await this.getLuckoilPriceList();
        const date = new Date().toJSON().split('T')[0];

        return {date, prices};
    }

    private normalizeData(data: string[]): FuelData[] {
        const res: FuelData[] = [];
        data.forEach((e, index) => {
            if (index % 2 === 1) {
                res.push({
                    name: data[index - 1],
                    price: +e
                })
            }
        });
        return res;
    }
}