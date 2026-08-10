import Intro from "@/components/homepage/intro";
import LinkButtons from "@/components/homepage/link-buttons";


export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-start justify-center px-4 py-12 bg-background text-foreground">
      <Intro />
      <LinkButtons />
    </main>
  );
}
