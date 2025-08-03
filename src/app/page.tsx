import Image from "next/image";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import { Categories } from "./components/Categories";
import { ConfirmToast } from "./components/ConfirmToast";

export default function Home({ searchParams }: { searchParams: { code?: string; username?: string } }) {
  const { code, username } = searchParams;
  return (
    <>
      {code && <ConfirmToast code={code} />}
      <main>
        <Header username={username} />
        <Carousel />
        <Categories />
      </main>
    </>
  );
}
