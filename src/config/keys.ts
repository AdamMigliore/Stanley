import dotenv from "dotenv";
dotenv.config();

const { discordKey, afKey } = process.env;

const keys = {
  discord: discordKey,
  alphaVantage: afKey,
};

export default keys;
