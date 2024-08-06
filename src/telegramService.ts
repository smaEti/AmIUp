import axios from "axios";

export default async function (
  failedWebSites: {
    host: string;
    status: string;
  }[],
  time: string
) {
  try {
    const response = await axios.post(`http://localhost:${process.env.TELEGRAM_SERVER_PORT}/send-alert`, { date: time, sites: failedWebSites });
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}
