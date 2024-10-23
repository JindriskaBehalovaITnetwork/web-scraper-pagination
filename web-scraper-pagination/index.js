import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
});
const page = await browser.newPage();
await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded"
});
const allQuotes = [];
let morePages = true;
while (morePages) {
    await getQuotesFromPage();
    if (await page.$(".pager > .next > a")) {
        await page.click(".pager > .next > a");
    } else {
        morePages = false;
    }
};

console.log(allQuotes, allQuotes.length);

await browser.close();

async function getQuotesFromPage () {
    const quotesFromPage = await page.evaluate(() => {
        const quotesList = Array.from(document.querySelectorAll(".quote")).map(quote => {
            const text = quote.querySelector(".text").innerText
            const author = quote.querySelector(".author").innerText;

            return {text, author}
        })

        return quotesList
    })

    quotesFromPage.forEach(quote => allQuotes.push(quote))
}