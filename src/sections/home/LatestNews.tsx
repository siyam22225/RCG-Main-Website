import { getLatestNews } from "@/lib/news";
import LatestNewsClient from "./LatestNewsClient";

export default async function LatestNews() {
  try {
    const newsItems = await getLatestNews();
    return <LatestNewsClient items={newsItems} />;
  } catch (error) {
    console.error("LATEST_NEWS_SECTION_ERROR", error);
    return <LatestNewsClient items={[]} />;
  }
}