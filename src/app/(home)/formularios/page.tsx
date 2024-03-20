import { DialogForm } from '@/components/form/modals/dialog'
import FormTable from '@/components/form/tableForm';
import { columns } from '@/components/form/tableForm/columns';
import { fetchForms, fetchUsers } from '@/lib/data';
import db from '@/lib/db';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import React from 'react'

async function FormPage({
  searchParams
}: {
  searchParams?: {
    search?: string
    filter?: string
    grupo?: string
  }
}) {
  const cookieStore = cookies();
  const user = await db.getUser(cookieStore);
  const queryClient = new QueryClient()
  const users = await fetchUsers()
  const ubi = searchParams?.search
  const filter = searchParams?.filter

  await queryClient.prefetchQuery({
    queryKey: ['Forms'],
    queryFn: () => fetchForms(ubi, filter),
  })
  return (
    <div>
      <h1>Formularios</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FormTable columns={columns} user={user?.id} users={users} ubi={ubi} filter={filter} />
      </HydrationBoundary>
    </div>
  )
}

export default FormPage
