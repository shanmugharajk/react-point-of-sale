import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { NameForm } from '~/components/name-form'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FieldError } from '~/components/ui/field'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { errorMessage } from '~/lib/utils'
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
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
                No product types yet.
              </TableCell>
            </TableRow>
          ) : (
            productTypes.map((productType) => (
              <ProductTypeRow key={productType.id} productType={productType} />
            ))
          )}
        </TableBody>
      </Table>
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
      <TableRow>
        <TableCell colSpan={3}>
          <NameForm
            initialName={productType.name}
            submitLabel="Save"
            onSave={handleRename}
            onCancel={stopRenaming}
          />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>
        {productType.name}
        {actionError && <FieldError>{actionError}</FieldError>}
      </TableCell>
      <TableCell>
        <Badge variant={productType.isActive ? 'secondary' : 'outline'}>
          {productType.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="space-x-2 text-right">
        <Button variant="ghost" size="sm" onClick={startRenaming}>
          Rename
        </Button>
        <Button variant="outline" size="sm" onClick={toggleActive}>
          {productType.isActive ? 'Mark inactive' : 'Mark active'}
        </Button>
      </TableCell>
    </TableRow>
  )
}
