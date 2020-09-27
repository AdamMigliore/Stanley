import axios, { AxiosRequestConfig } from "axios";
import TimeSeriesDaily from "../interfaces/TimeSeriesDaily";

const alphaVantage = async (
  apikey: string,
  func: string,
  symbol: string,
  outputSize?: string,
  dataType?: string
) => {
  const ticker = symbol.trim().toUpperCase();
  //  Axios
  const options: AxiosRequestConfig = {
    method: "GET",
    params: {
      apikey,
      function: func,
      symbol: ticker,
      outputSize,
      dataType,
    },
    url: "https://www.alphavantage.co/query",
  };
  const response = await axios(options);
  const data: TimeSeriesDaily = response.data;
  return data;
};

export default alphaVantage;
