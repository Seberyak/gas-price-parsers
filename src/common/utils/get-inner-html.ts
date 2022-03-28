import {load} from "cheerio";

export function getInnerHtml(html: string, path: string): string {
    const $ = load(html);
    return $(path).text().trim()
}