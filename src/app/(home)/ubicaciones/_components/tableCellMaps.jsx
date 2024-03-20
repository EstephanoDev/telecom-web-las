import { TableCell } from "@/components/ui/table"

const TableCellMaps = ({ latitude, longitude }) => {
  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };
  return (
    <TableCell className="hover:bg-slate-600 cursor-pointer text-slate-400" onClick={handleOpenMaps} >Maps</TableCell>
  )
}
export default TableCellMaps
