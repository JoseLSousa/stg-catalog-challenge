import Header from "./components/Header";
import Carousel from "./components/Carousel";
import { Categories } from "./components/Categories";
import { ConfirmToast } from "./components/ConfirmToast";

export default async function Home({ searchParams }: { searchParams: Promise<{ code?: string; username?: string }> }) {
  const params = await searchParams;
  const { code, username } = params;
  return (
    <>
      {code && <ConfirmToast />}
      <main>
        <Header username={username} />
        <Carousel />
        <Categories />
      </main>
    </>
  );
}
