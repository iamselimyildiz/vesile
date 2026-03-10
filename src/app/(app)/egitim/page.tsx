import Header from "@/components/layout/Header";
import Roadmap from "@/components/education/Roadmap";

export default function EgitimPage() {
  return (
    <>
      <Header title="Eğitim" />
      <main className="max-w-lg mx-auto">
        <Roadmap />
      </main>
    </>
  );
}
