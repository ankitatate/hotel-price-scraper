import puppeteer from 'puppeteer';

(async () => {
  console.log("🚀 Launching browser...");

  const browser = await puppeteer.launch({
    headless: false,         // Set to true to run in headless mode
    slowMo: 50               // Adds delay between actions for visibility
  });

  const page = await browser.newPage();
  const url = 'https://automationintesting.online/#/booking';

  console.log(`🌐 Navigating to: ${url}`);
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log("⏳ Waiting for room elements to load...");

  try {
    // Correct selector for room cards
    await page.waitForSelector('.room', { timeout: 60000 });

    // Optional: Small delay to ensure all content is fully loaded
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("🔍 Scraping hotel data...");

    const hotelData = await page.$$eval('.room', rooms => {
      return rooms.map(room => {
        const name = room.querySelector('h3')?.textContent?.trim() || 'N/A';
        const price = room.querySelector('.price')?.textContent?.trim() || 'N/A';
        return { name, price };
      });
    });

    console.log("✅ Rooms Found:");
    console.table(hotelData.slice(0, 5)); // Show top 5 results
  } catch (error) {
    console.error("❌ Error during scraping:", error);
  } finally {
    await browser.close();
    console.log("🛑 Browser closed.");
  }
})();
