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
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: (value: any) => "$" + value,
              },
            },
          ],
        },
      },
    };
    await chartToPng(width, height, configuration, pathToImage);

    //  Embed
    const embed = new Discord.MessageEmbed()
      .setColor("#03b5fc")
      .setTitle(`${ticker} as of ${dataset["Meta Data"]["3. Last Refreshed"]}`)
      .addFields(
        { name: "Last Open", value: `${datasetArr[0]["1. open"]}$` },
        { name: "Last Close", value: `${datasetArr[0]["4. close"]}$` },
        { name: "Last Change", value: `${dailyChange}%` }
      )
      .setURL(`https://finance.yahoo.com/${ticker}`)
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
