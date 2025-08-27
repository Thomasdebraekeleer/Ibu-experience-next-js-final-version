import { Metadata } from "next";
import HomeOnePage from "./(homes)/home-1/page";

export const metadata: Metadata = {
  title: "IBÙ Experience - Expériences uniques et immersives",
};

export default function Home() {
  return (
    <>
      <HomeOnePage />
    </>
  );
}
