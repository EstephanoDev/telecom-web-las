import { FilesTable } from "@/components/archivos/FilesTable"
import { getFiles } from "@/lib/data"

async function FilesPage() {
  const files = await getFiles()
  return <h1><FilesTable files={files} /></h1>
}
export default FilesPage 
