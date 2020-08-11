import { User } from 'telegraf/typings/telegram-types';
import express from 'express';
import { Telegraf, Context } from 'telegraf';
import puppeteer, { Browser } from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TOKEN_BOT as string);

const configBrowser = { headless: true };
let browser: Browser;

bot.start(start);

async function start(ctx: Context) {
    if (!browser) browser = await puppeteer.launch(configBrowser);

    const { first_name, last_name } = ctx.from as User;
    console.log(`> connect bot: ${first_name} ${last_name}.`); // debug

    ctx.reply(`Welcome ${first_name} ${last_name} !!!\n > command /status.`); // return client
}

bot.command('status', (ctx) => requestAula(ctx));

async function requestAula(
    ctx: Context,
    serverTest = 'https://servicos.ulbra.br/login/ava'
) {
    if (!browser) browser = await puppeteer.launch(configBrowser);

    const { first_name, last_name } = ctx.from as User;
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

const app = express();
app.get('/', (req, res) =>
    res.status(200).json({
        message:
            'Acesse o telegram e procure por aula_status_bot e envie /status',
    })
);

app.listen(3000, () => console.log('> server start'));
