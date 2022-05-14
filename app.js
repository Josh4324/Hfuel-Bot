const { Telegraf } = require("telegraf");
const axios = require("axios");
const { BigNumber, ethers } = require("ethers");
const hfuel = require("./abi");
require("dotenv").config();
const cron = require("node-cron");

const bot = new Telegraf(process.env.api);

const provider = new ethers.providers.JsonRpcProvider(
  "https://speedy-nodes-nyc.moralis.io/40a88f8745bc01d3bb660792/bsc/mainnet"
);

const signer = provider.getSigner("0x1443498Ef86df975D8A2b0B6a315fB9f49978998");

const hfuelContract = new ethers.Contract(
  "0xc8A79838D91f0136672b94ec843978B6Fa6DF07D",
  hfuel.abi,
  signer
);

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    "hello there! Welcome to my new telegram bot.",
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
    "https://api.pancakeswap.info/api/v2/tokens/0x157Ba4bBbb2bd7D59024143C2C9E08f6060717a6"
  );
  const sk = await axios.get(
    "https://api.pancakeswap.info/api/v2/tokens/0x5755e18d86c8a6d7a6e25296782cb84661e6c106"
  );
  const hnw = await axios.get(
    "https://api.pancakeswap.info/api/v2/tokens/0x8173CcC721111b5a93CE7fa6fEc0fc077B58B1B7"
  );

  const price = Number(detail.data.data.price).toFixed(4);
  const skPrice = Number(sk.data.data.price).toFixed(4);
  const hnwPrice = Number(hnw.data.data.price).toFixed(4);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `🔥HFUEL PRICE🔥 - 💰${price} \n🦸‍♂️SK PRICE -        💰${skPrice} \n👨‍💼HNW PRICE  -    💰${hnwPrice} \n\n👤 Refinery  -${users} \n🔥Deposited - ${deposited}\n🔥Txns - ${txt}`,
    `.`,
    {}
  );
});

bot.command("start", async (ctx) => {
  console.log(ctx.from);

  cron.schedule("*/5 * * * *", async () => {
    console.log("running a task every 5 minute");

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
      "https://api.pancakeswap.info/api/v2/tokens/0x157Ba4bBbb2bd7D59024143C2C9E08f6060717a6"
    );
    const sk = await axios.get(
      "https://api.pancakeswap.info/api/v2/tokens/0x5755e18d86c8a6d7a6e25296782cb84661e6c106"
    );
    const hnw = await axios.get(
      "https://api.pancakeswap.info/api/v2/tokens/0x8173CcC721111b5a93CE7fa6fEc0fc077B58B1B7"
    );

    const dt = new Date();
    const day = dt.toLocaleDateString();
    const time = dt.toLocaleTimeString();

    const price = Number(detail.data.data.price).toFixed(4);
    const skPrice = Number(sk.data.data.price).toFixed(4);
    const hnwPrice = Number(hnw.data.data.price).toFixed(4);
    bot.telegram.sendMessage(
      ctx.chat.id,
      `Updated: ${day} ${time}\n\n🔥HFUEL PRICE🔥 - 💰${price} \n🦸‍♂️SK PRICE -        💰${skPrice} \n👨‍💼HNW PRICE  -    💰${hnwPrice} \n\n👤 Refinery  -${users} \n🔥Deposited - ${deposited}\n🔥Txns - ${txt}`,
      `.`,
      {}
    );
  });
});

bot.launch();
console.log("running");
