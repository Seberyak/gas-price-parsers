export const clearResultText = (innerText) => {
    return innerText
        .split("\n")
        .map((item) => item.trim().replace(/<[^>]*>?/gm, ""))
        .filter((it) => it !== "");
};