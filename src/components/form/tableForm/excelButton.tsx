import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';

const ExcelDownloadButton = ({ forms }: { forms: any[] }) => {
  const downloadExcel = () => {
    const headers = ["ID", "Fecha", "nombre", "Grupo", "RD", "RA", "DP", "BANDEJAS", "INSTALACIONES", "ACTIVACIONES", "BACKBONE(SOPLADO)", "BACKBONE(FUSIONES)", "AVERIAS", "OTROS", "Ubicacion"];

    const data = forms.map(form => {
      const trabajoRealizadoValue = {
        RD: 1,
        RA: 2,
        DP: 3,
        BANDEJAS: 4,
        INSTALACIONES: 5,
        ACTIVACIONES: 6,
        "BACKBONE(SOPLADO)": 7,
        "BACKBONE(FUSIONES)": 8,
        AVERIAS: 9,
        OTROS: 10,
      };

      return [
        form.id,
        form.Fecha,
        form.Trabajador,
        form.Grupo,
        form.TipoTrabajo === 'RD' ? trabajoRealizadoValue.RD : '',
        form.TipoTrabajo === 'RA' ? trabajoRealizadoValue.RA : '',
        form.TipoTrabajo === 'DP' ? trabajoRealizadoValue.DP : '',
        form.TipoTrabajo === 'BANDEJAS' ? trabajoRealizadoValue.BANDEJAS : '',
        form.TipoTrabajo === 'INSTALACIONES' ? trabajoRealizadoValue.INSTALACIONES : '',
        form.TipoTrabajo === 'ACTIVACIONES' ? trabajoRealizadoValue.ACTIVACIONES : '',
        form.TipoTrabajo === 'BACKBONE(SOPLADO)' ? trabajoRealizadoValue['BACKBONE(SOPLADO)'] : '',
        form.TipoTrabajo === 'BACKBONE(FUSIONES)' ? trabajoRealizadoValue['BACKBONE(FUSIONES)'] : '',
        form.TipoTrabajo === 'AVERIAS' ? trabajoRealizadoValue.AVERIAS : '',
        form.TipoTrabajo === 'OTROS' ? trabajoRealizadoValue.OTROS : '',
        form.Ubicacion
        /* ...map other form fields accordingly */
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Add styling to headers
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } }, // White bold font
      fill: { fgColor: { rgb: '2E86C1' } }, // Blue background
    };

    // Apply style to each cell in the first row (headers)
    headers.forEach((header, index) => {
      const cellRef = XLSX.utils.encode_cell({ c: index, r: 0 }); // Get cell reference
      worksheet[cellRef].s = headerStyle; // Apply style
    });

    // Add styling to data cells
    const dataStyle = {
      fill: { fgColor: { rgb: 'F2F2F2' } }, // Light gray background
    };

    data.forEach((rowData, rowIndex) => {
      rowData.forEach((cellData, cellIndex) => {
        if (rowIndex > 0) {
          const cellRef = XLSX.utils.encode_cell({ c: cellIndex, r: rowIndex }); // Get cell reference
          worksheet[cellRef].s = dataStyle; // Apply style
        }
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Forms');

    XLSX.writeFile(wb, 'forms_data.xlsx');
  };

  return (
    <Button className="m-2 text-lg" onClick={downloadExcel}>
      Descargar Excel
    </Button>
  );
};

export default ExcelDownloadButton;

