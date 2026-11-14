import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '~/db'
import { products } from '~/db/schema'

const getProducts = createServerFn({ method: 'GET' }).handler(() =>
  db.select().from(products),
)

export const Route = createFileRoute('/')({
  loader: () => getProducts(),
  component: Home,
})

function Home() {
  const items = Route.useLoaderData()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Point of Sale</h1>
      <p className="mt-4 text-lg">
        Sell, track inventory, and manage your shop.
      </p>
      <h2 className="mt-8 text-2xl font-semibold">Products</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-muted-foreground">No products yet.</p>
      ) : (
        <ul className="mt-2 list-disc pl-6">
          {items.map((p) => (
            <li key={p.id}>
              {p.name} — {(p.priceCents / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
