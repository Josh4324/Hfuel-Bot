const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();

const bot = new Telegraf(process.env.api);

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
    `🔥HFUEL PRICE🔥 - 💲${price} \n🔥SK PRICE🔥 -        💲${skPrice} \n🔥HNW PRICE🔥 -    💲${hnwPrice}`,
    `.`,
    {}
  );
});

bot.launch();
console.log("running");
