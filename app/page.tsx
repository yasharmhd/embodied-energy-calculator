'use client'
import dynamic from 'next/dynamic'

const EmbodiedEnergyCalculator = dynamic(
  () => import('../components/EmbodiedEnergyCalculator'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <EmbodiedEnergyCalculator />
    </main>
  );
'use client'
import dynamic from 'next/dynamic'

const EmbodiedEnergyCalculator = dynamic(
  () => import('../components/EmbodiedEnergyCalculator'),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <EmbodiedEnergyCalculator />
    </main>
  );
}