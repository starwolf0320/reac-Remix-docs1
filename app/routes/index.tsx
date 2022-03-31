import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Home",
  };
};

export default function Index() {
  return (
    <main>
      <h2>Home page</h2>
    </main>
  );
}
