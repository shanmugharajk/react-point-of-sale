import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-8">
      <p className="text-lg">Sell, track inventory, and manage your shop.</p>
    </div>
  )
}
