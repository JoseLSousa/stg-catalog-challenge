import Header from "./components/Header";
import Carousel from "./components/Carousel";
import { Categories } from "./components/Categories";

export default async function Home() {
  return (
      <main>
        <Header />
        <Carousel />
        <Categories />
      </main>
  );
}
