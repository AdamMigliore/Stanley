import Discord from "discord.js";
import Command from "../interfaces/Command";
import keys from "../config/keys";
import { round } from "../utils/math";
import path from "path";
import { chartToPng } from "../functions/chartToPng";
import { height, width } from "../config/canvas";
import alphaVantage from "../functions/alphaVantage";
import fs from "fs";

const stock: Command = {
  name: "stock",
  description: "Finds the stock information of the args ticker.",
  async execute(message: Discord.Message, args: string[]) {
    const ticker = args[0].trim().toUpperCase();

    const dataset = await alphaVantage(
      keys.alphaVantage || "demo",
      "TIME_SERIES_DAILY",
      ticker
    );

    //  Filter data
    const datasetArr = [];
    for (let key in dataset["Time Series (Daily)"]) {
      let value = dataset["Time Series (Daily)"][key];
      datasetArr.push({
        date: key,
        ...value,
      });
    }

    //  Data for close
    const data = datasetArr.reduce(
      (acc: number[], curr) => [...acc, curr["4. close"]],
      []
    );

    //  Data of each closing date
    const labels = datasetArr.reduce(
      (acc: string[], curr) => [...acc, curr.date],
      []
    );

    //  Math
    const dailyChange = round(
      ((datasetArr[0]["4. close"] - datasetArr[0]["1. open"]) /
        datasetArr[0]["4. close"]) *
        100,
      4
    );

    //  Chart
    const pathToImage = path.join(
      __dirname,
      "..",
      "..",
      "charts",
      `${ticker}.png`
    );
    const configuration = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${ticker} over the last 100 days`,
            data,
            borderColor: "#34eb98",
            backgroundColor: "#34eb98",
            fill: false,
            lineTension: 0,
            pointRadius: 0,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `${ticker} as of ${dataset["Meta Data"]["3. Last Refreshed"]}`,
        },
        scales: {
          xAxes: [{ display: false }],
          yAxes: [
            {
              ticks: {
                fontColor: "#ffff",
                // Include a dollar sign in the ticks
                callback: function (value: any) {
                  return "$" + value;
                },
              },
            },
          ],
        },
      },
    };
    await chartToPng(width, height, configuration, pathToImage);

    //  Embed
    const embed = new Discord.MessageEmbed()
      .setColor("#34eb98")
      .setTitle(`${ticker} as of ${dataset["Meta Data"]["3. Last Refreshed"]}`)
      .addFields(
        { name: "Last Open", value: `${datasetArr[0]["1. open"]}$` },
        { name: "Last Close", value: `${datasetArr[0]["4. close"]}$` },
        { name: "Last Change", value: `${dailyChange}%` }
      )
      .setURL(`https://finance.yahoo.com/quote/${ticker}`)
      .attachFiles([pathToImage])
      .setImage(`attachment://${ticker}.png`);
    await message.channel.send(embed);

    //  Clear charts
    try {
      fs.unlinkSync(pathToImage);
    } catch (err) {
      console.log(err);
    }
  },
};

export default stock;
