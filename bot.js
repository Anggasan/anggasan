const puppeteer = require('puppeteer');
const fs = require('fs');

const CONFIG = {
  headless: false, // Set ke true untuk background mode
  mineInterval: 5000, // 5 detik antara setiap click
  maxRetries: 3,
  timeout: 30000,
  logFile: 'mining-log.txt'
};

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(CONFIG.logFile, logMessage + '\n', { encoding: 'utf-8' });
}

class RpowMiningBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.mineCount = 0;
    this.isRunning = false;
    this.lastMineTime = null;
  }

  async init() {
    try {
      log('🚀 Initializing Puppeteer...');
      this.browser = await puppeteer.launch({
        headless: CONFIG.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled'
        ],
        defaultViewport: {
          width: 1280,
          height: 720
        }
      });

      this.page = await this.browser.newPage();
      
      // Stealth mode - hindari detection
      await this.page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });
      });

      // Set user agent realistis
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      log('✅ Puppeteer initialized');
    } catch (error) {
      log(`❌ Error initializing: ${error.message}`);
      throw error;
    }
  }

  async navigateToMining() {
    try {
      log('🌐 Navigating to rpow2.com mining page...');
      await this.page.goto('https://rpow2.com/#/mine', {
        waitUntil: 'networkidle2',
        timeout: CONFIG.timeout
      });

      await this.page.waitForTimeout(3000);
      log('✅ Mining page loaded');
    } catch (error) {
      log(`❌ Error navigating: ${error.message}`);
      throw error;
    }
  }

  async findAndClickMineButton() {
    try {
      // Cari tombol "Mine" dengan berbagai method
      
      // Method 1: XPath - paling akurat
      let buttons = await this.page.$x("//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'mine')]");
      
      if (buttons.length > 0) {
        await buttons[0].click();
        this.mineCount++;
        this.lastMineTime = new Date();
        log(`✅ Mine button clicked (Total: ${this.mineCount})`);
        return true;
      }

      // Method 2: Cari dengan class yang umum
      const classSelectors = [
        'button.mine-btn',
        'button#mine-btn',
        'button[class*="mine"]',
        'button[id*="mine"]',
        '.mining-btn',
        '#mining-btn'
      ];

      for (const selector of classSelectors) {
        try {
          const btn = await this.page.$(selector);
          if (btn) {
            const isVisible = await this.page.evaluate((el) => {
              if (!el) return false;
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden';
            }, btn);

            if (isVisible) {
              await btn.click();
              this.mineCount++;
              this.lastMineTime = new Date();
              log(`✅ Mine button clicked (Selector: ${selector}) (Total: ${this.mineCount})`);
              return true;
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Method 3: Cari semua button dan click yang pertama
      const allButtons = await this.page.$$('button');
      for (const btn of allButtons) {
        const text = await this.page.evaluate(el => el.innerText.toLowerCase(), btn);
        if (text.includes('mine')) {
          await btn.click();
          this.mineCount++;
          this.lastMineTime = new Date();
          log(`✅ Mine button clicked (By text) (Total: ${this.mineCount})`);
          return true;
        }
      }

      log('⚠️ Mine button not found - will retry');
      return false;
    } catch (error) {
      log(`❌ Error clicking mine button: ${error.message}`);
      return false;
    }
  }

  async checkPageHealth() {
    try {
      const isAlive = await this.page.evaluate(() => {
        return document.body !== null && document.body !== undefined;
      });

      if (!isAlive) {
        log('⚠️ Page seems dead, reloading...');
        await this.page.reload({ waitUntil: 'networkidle2' });
        await this.page.waitForTimeout(3000);
        return false;
      }

      return true;
    } catch (error) {
      log(`⚠️ Page health check failed: ${error.message}`);
      return false;
    }
  }

  async mine() {
    if (!this.isRunning) {
      return;
    }

    try {
      // Check page health
      const isHealthy = await this.checkPageHealth();
      if (!isHealthy) {
        log('⚠️ Waiting for page recovery...');
        await this.page.waitForTimeout(5000);
      }

      // Try to click mine button with retries
      let success = false;
      for (let retry = 0; retry < CONFIG.maxRetries; retry++) {
        success = await this.findAndClickMineButton();
        if (success) break;
        
        if (retry < CONFIG.maxRetries - 1) {
          log(`🔄 Retry ${retry + 1}/${CONFIG.maxRetries - 1}...`);
          await this.page.waitForTimeout(2000);
        }
      }

      if (!success) {
        log('❌ Failed to click after retries');
      }

    } catch (error) {
      log(`❌ Mining cycle error: ${error.message}`);
    }

    // Schedule next mining attempt
    setTimeout(() => this.mine(), CONFIG.mineInterval);
  }

  async start() {
    try {
      await this.init();
      await this.navigateToMining();
      
      this.isRunning = true;
      log('🎯 Mining bot started successfully!');
      log(`⏱️ Mining every ${CONFIG.mineInterval}ms`);
      log('Press Ctrl+C to stop');
      
      // Start mining loop
      this.mine();

      // Handle graceful shutdown
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());

    } catch (error) {
      log(`❌ Failed to start bot: ${error.message}`);
      await this.stop();
      process.exit(1);
    }
  }

  async stop() {
    log('🛑 Stopping mining bot...');
    this.isRunning = false;
    
    if (this.browser) {
      await this.browser.close();
    }
    
    log(`✅ Bot stopped. Total mines: ${this.mineCount}`);
    log('📊 Check mining-log.txt for details');
    process.exit(0);
  }
}

// Run the bot
const bot = new RpowMiningBot();
bot.start().catch(error => {
  log(`💥 Fatal error: ${error.message}`);
  process.exit(1);
});
