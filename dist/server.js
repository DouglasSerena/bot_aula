'use strict';
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
var _telegraf = require('telegraf');
var _puppeteer = require('puppeteer');
var _puppeteer2 = _interopRequireDefault(_puppeteer);
var _dotenv = require('dotenv');
var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config();

const bot = new (0, _telegraf.Telegraf)(process.env.TOKEN_BOT);

const configBrowser = { headless: true };
let browser;

bot.start(start);

async function start(ctx) {
    if (!browser) browser = await _puppeteer2.default.launch(configBrowser);

    const { first_name, last_name } = ctx.from;
    console.log(`> connect bot: ${first_name} ${last_name}.`); // debug

    ctx.reply(`Welcome ${first_name} ${last_name} !!!\n > command /status.`); // return client
}

bot.command('status', (ctx) => requestAula(ctx));

async function requestAula(
    ctx,
    serverTest = 'https://servicos.ulbra.br/login/ava'
) {
    if (!browser) browser = await _puppeteer2.default.launch(configBrowser);

    const { first_name, last_name } = ctx.from;
    console.log(`> send a commands to bot: ${first_name} ${last_name}.`); // debug

    const page = await browser.newPage();
    await page.setCacheEnabled(false);

    const start_date = new Date().getSeconds();
    try {
        let time = setTimeout(async () => {
            await page.close();
            ctx.reply(
                'Status service Aula: out\n > maximum time reached: 20s.' // return client
            );
        }, 20000);

        await page.goto(serverTest); // send page
        await page.close();

        const end_date = new Date().getSeconds() - start_date;
        clearTimeout(time);

        ctx.reply(
            'Status service Aula: ok\n > Server responded in ' + end_date + 's' // return client
        );
    } catch (err) {
        ctx.reply('Status service Aula: out\n > Server not respond.'); // return client
    }
}

bot.launch();

console.log('> start bot.'); // debug
