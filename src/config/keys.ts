import dotenv from "dotenv";
if (process.env.NODE_ENV === "development") dotenv.config();

const { discordKey, afKey } = process.env;

const keys = {
  discord: discordKey,
  alphaVantage: afKey,
};

export default keys;
