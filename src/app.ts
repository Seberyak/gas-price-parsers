import {luckoilMain} from "./luckoil";
require("dotenv").config();

async function main() {
    const timeOut = +(process.env.UPDATE_TIMEOUT || 60);

    setInterval(() => {
        luckoilMain().then();
    }, timeOut * 60e3);


}


main().then();