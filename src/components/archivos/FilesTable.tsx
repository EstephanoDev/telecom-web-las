import { FilesTableProps } from '@/lib/types';
import { TableDrive } from './tableDrive';
import { FormFile } from './FormFile';
import { getRol } from '@/lib/data';

export const FilesTable: React.FC<FilesTableProps> = async ({ files }) => {
  const roles = await getRol()

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Archivos</h2>

      {/* Formulario para crear un nuevo archivo */}
      <FormFile roles={roles} />

      <TableDrive files={files} carpetas={roles} />

    </div>
  );
};


