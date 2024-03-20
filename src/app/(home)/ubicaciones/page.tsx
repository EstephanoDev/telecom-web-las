import { fetchUbis } from "@/lib/data"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { GeoButton } from "./_components/Geo"
import TableUbi from "./_components/TableUbi"
import dynamic from "next/dynamic"
const Map = dynamic(() => import("./_components/Map/MapView"), { ssr: false });

async function UbiPage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["ubicacion"],
    queryFn: fetchUbis
  })

  return (
    <div>
      <GeoButton />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Map />
        <TableUbi />
      </HydrationBoundary>
    </div>)
}

export default UbiPage
