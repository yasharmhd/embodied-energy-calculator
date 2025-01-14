import dynamic from 'next/dynamic'

const EmbodiedEnergyCalculator = dynamic(
  () => import('@/components/EmbodiedEnergyCalculator'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="p-8">
      <EmbodiedEnergyCalculator />
    </main>
  );
}