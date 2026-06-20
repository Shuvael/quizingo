import BingoBoard from "@/components/BingoBoard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Quizingo</h1>
      <BingoBoard />
    </main>
  );
}