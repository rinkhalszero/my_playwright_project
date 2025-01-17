const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');

test.describe('My Test Suite', () => {
    test('My Test Case', async({page}) => {
        //test.setTimeout(120_000);
        const browser = await chromium.launch();
        //const page = await browser.newPage();
        //await page.goto('https://bitheap.tech');
        //await page.screenshot({ path: 'screenshot.png'});
    
        await authenticate(page);

        await prepareOrder(page);

        await placeOrder(page);
    
        //await browser.close();
    });
});


async function authenticate(page) {
    await page.goto('https://bitheap.tech');
    await page.click('#menu-item-2330');
    await page.locator("[name='xoo-el-username']").fill(process.env.BITHEAP_USERNAME);
    await page.locator("[name='xoo-el-password']").fill(process.env.PASS);
    //await page.locator('xpath=/html/body/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div[2]/div/form/button').click();
    await page.locator('xpath=/html/body/div[6]/div[2]/div/div/div[2]/div/div/div[2]/div/form/button').click();
    const text = await page.locator('css=#menu-item-2333 > a').textContent();
    if(text != "Hello, Playwright")
        console.error("The authentication was not successful!")
    //await page.screenshot({path: 'screenshot2.png'});
}

async function prepareOrder(page) {
    await page.click('#menu-item-1310');
    await page.locator('//*[@id="main"]/nav/ul/li[2]/a').click();      
    //await page.locator('#main > ul > li.product.type-product.post-211.status-publish.instock.product_cat-uncategorized.purchasable.product-type-simple').click();
    await page.locator('#main > ul > li.product.type-product.post-211.status-publish.instock.product_cat-uncategorized.purchasable.product-type-simple > a.button.product_type_simple.add_to_cart_button.ajax_add_to_cart').click();
    await page.locator('xpath=/html/body/nav/div[1]/div[3]/div/a').click();
    //await page.goto('https://bitheap.tech/cart/');
//    /html/body/nav/div[1]/div[3]/div/a
    await page.getByText(' Proceed to checkout').click();
    await page.getByPlaceholder('House number and street name').fill("testing");
    //await page.screenshot({path: 'screenshot3.png'});
}

async function placeOrder(page) {    
    await page.locator('body > div.cky-consent-container.cky-box-bottom-left > div > div > div > div.cky-notice-btn-wrapper > button.cky-btn.cky-btn-accept').click();
    //await page.locator('body > div.fc-consent-root > div.fc-dialog-container > div.fc-dialog.fc-choice-dialog > div.fc-footer-buttons-container > div.fc-footer-buttons > button.fc-button.fc-cta-consent.fc-primary-button > p').click();
    await page.locator('xpath=//*[@id="billing_postcode"]').fill("1234");
    await page.locator('css=#billing_city').fill("Zurich");
    //await page.screenshot({path: 'screenshot4.png'});
    //await expect(page.getByText('Place order')).toBeVisible();
    //await page.click("#place_order");
    await page.locator('//*[@id="place_order"]').click();    
    await expect(page.getByText('Order received')).toBeVisible({ timeout: 10000 });
    //await page.screenshot({path: 'screenshot5.png'});
    expect(await page.getByText('Order received').count()).toBe(1);
}
