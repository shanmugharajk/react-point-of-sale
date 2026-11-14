import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { NameForm } from '~/components/name-form'
import { Button } from '~/components/ui/button'
import { cn, errorMessage } from '~/lib/utils'
import {
  createProductType,
  listProductTypes,
  updateProductType,
} from '~/server/functions/product-types'

export const Route = createFileRoute('/_protected/admin/product-types')({
  loader: () => listProductTypes(),
  component: ProductTypesPage,
})

type ProductType = Awaited<ReturnType<typeof listProductTypes>>[number]

type ProductTypeRowProps = { productType: ProductType }

function ProductTypesPage() {
  const productTypes = Route.useLoaderData()
  const router = useRouter()

  async function handleCreate(name: string) {
    await createProductType({ data: { name } })
    await router.invalidate()
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Product types</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every product belongs to one type. Types group products in reports.
      </p>
      <div className="mt-6">
        <NameForm
          initialName=""
          submitLabel="Add"
          placeholder="New product type, e.g. Stationery"
          onSave={handleCreate}
        />
      </div>
      {productTypes.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No product types yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y rounded-lg border">
          {productTypes.map((productType) => (
            <ProductTypeRow key={productType.id} productType={productType} />
          ))}
        </ul>
      )}
    </div>
  )
}

function ProductTypeRow({ productType }: ProductTypeRowProps) {
  const router = useRouter()
  const [isRenaming, setIsRenaming] = useState(false)
  const [actionError, setActionError] = useState('')

  function startRenaming() {
    setIsRenaming(true)
  }

  function stopRenaming() {
    setIsRenaming(false)
  }

  async function handleRename(name: string) {
    await updateProductType({ data: { id: productType.id, name } })
    setIsRenaming(false)
    await router.invalidate()
  }

  async function toggleActive() {
    setActionError('')
    try {
      await updateProductType({
        data: { id: productType.id, isActive: !productType.isActive },
      })
      await router.invalidate()
    } catch (error) {
      setActionError(errorMessage(error))
    }
  }

  if (isRenaming) {
    return (
      <li className="p-3">
        <NameForm
          initialName={productType.name}
          submitLabel="Save"
          onSave={handleRename}
          onCancel={stopRenaming}
        />
      </li>
    )
  }

  return (
    <li className="p-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex-1',
            !productType.isActive && 'text-muted-foreground',
          )}
        >
          {productType.name}
        </span>
        {!productType.isActive && (
          <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            Inactive
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={startRenaming}>
          Rename
        </Button>
        <Button variant="outline" size="sm" onClick={toggleActive}>
          {productType.isActive ? 'Mark inactive' : 'Mark active'}
        </Button>
      </div>
      {actionError && (
        <p className="mt-1 text-sm text-destructive">{actionError}</p>
      )}
    </li>
  )
}
