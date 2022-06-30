const { Telegraf } = require("telegraf");
const axios = require("axios");
const { BigNumber, ethers } = require("ethers");
const hfuel = require("./abi");
const hfuelPrice = require("./hfuel");
const hnwPrice = require("./hnw");
const skPrice = require("./hnw");

require("dotenv").config();
const cron = require("node-cron");

const bot = new Telegraf(process.env.api);

const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const signer = provider.getSigner("0x1443498Ef86df975D8A2b0B6a315fB9f49978998");

const hfuelContract = new ethers.Contract(
  "0xc8A79838D91f0136672b94ec843978B6Fa6DF07D",
  hfuel.abi,
  signer
);

const hfuelPriceContract = new ethers.Contract(
  "0x8196fd25e639fd57a6678d2143e86b7f023875be",
  hfuelPrice.abi,
  signer
);
const hnwPriceContract = new ethers.Contract(
  "0x4436d1789f16deb0322e9800844061911218f7c1",
  hnwPrice.abi,
  signer
);
const skPriceContract = new ethers.Contract(
  "0xdf16b952cf4dd07d3649ab2a64930e3c41aac82f",
  skPrice.abi,
  signer
);

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "hello there! Welcome to HFUEL PRICE BOT.",
    {}
  );
});

bot.command("price", async (ctx) => {
  console.log(ctx.from);
  const info = await hfuelContract.contractInfo();
  const users = Number(info._total_users)
    .toFixed(1)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const deposited = (Number(info._total_deposited) / 10 ** 18)
    .toFixed(4)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const txt = Number(info._total_txs)
    .toFixed(1)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const detail = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
  );

  const bnb = detail.data.binancecoin.usd;

  const hfuelPriceDetail = await hfuelPriceContract.getReserves();

  const hfuelR0 = Number(hfuelPriceDetail._reserve0);
  const hfuelR1 = Number(hfuelPriceDetail._reserve1);
  const hfuelP = Number(hfuelR1 / hfuelR0).toFixed(4);

  const hnwPriceDetail = await hnwPriceContract.getReserves();
  const hnwR0 = Number(hnwPriceDetail._reserve0);
  const hnwR1 = Number(hnwPriceDetail._reserve1);
  const hnwP = Number(hnwR1 / hnwR0).toFixed(4);

  const skPriceDetail = await skPriceContract.getReserves();
  const skR0 = Number(skPriceDetail._reserve0);
  const skR1 = Number(skPriceDetail._reserve1);
  const skP = Number((skR1 / skR0) * bnb).toFixed(4);

  bot.telegram.sendMessage(
    ctx.chat.id,
    `🔥HFUEL PRICE🔥 - 💰${hfuelP} \n🦸‍♂️SK PRICE -        💰${skP} \n👨‍💼HNW PRICE  -    💰${hnwP} \n\n👤 Refinery  -${users} \n🔥Deposited - ${deposited}\n🔥Txns - ${txt}`,
    `.`,
    {}
  );
});

bot.command("cron", async (ctx) => {
  console.log(ctx.from);

  cron.schedule("*/5 * * * *", async () => {
    console.log("running a task every 5 minute");

    console.log(ctx.from);
    const info = await hfuelContract.contractInfo();
    const users = Number(info._total_users)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    const deposited = (Number(info._total_deposited) / 10 ** 18)
      .toFixed(4)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    const txt = Number(info._total_txs)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    const detail = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
    );

    const bnb = detail.data.binancecoin.usd;

    const hfuelPriceDetail = await hfuelPriceContract.getReserves();

    const hfuelR0 = Number(hfuelPriceDetail._reserve0);
    const hfuelR1 = Number(hfuelPriceDetail._reserve1);
    const hfuelP = Number(hfuelR1 / hfuelR0).toFixed(4);

    const hnwPriceDetail = await hnwPriceContract.getReserves();
    const hnwR0 = Number(hnwPriceDetail._reserve0);
    const hnwR1 = Number(hnwPriceDetail._reserve1);
    const hnwP = Number(hnwR1 / hnwR0).toFixed(4);

    const skPriceDetail = await skPriceContract.getReserves();
    const skR0 = Number(skPriceDetail._reserve0);
    const skR1 = Number(skPriceDetail._reserve1);
    const skP = Number((skR1 / skR0) * bnb).toFixed(4);

    bot.telegram.sendMessage(
      ctx.chat.id,
      `🔥HFUEL PRICE🔥 - 💰${hfuelP} \n🦸‍♂️SK PRICE -        💰${skP} \n👨‍💼HNW PRICE  -    💰${hnwP} \n\n👤 Refinery  -${users} \n🔥Deposited - ${deposited}\n🔥Txns - ${txt}`,
      `.`,
      {}
    );
  });
});

bot.launch();
console.log("running");
