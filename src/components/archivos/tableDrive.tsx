'use client';

import { deleteFile } from '@/lib/actions';
import { useState } from 'react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';

export const TableDrive = ({ files, carpetas }: any) => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const renderIcon = (file: any) => {
    if (file.type.startsWith('image/')) {
      return <img src={`url_de_tu_api/${file.File}`} alt="Preview" style={{ width: '50px', height: 'auto' }} />;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return <FaFileExcel />;
    } else if (file.type === 'application/pdf') {
      return <FaFilePdf />;
    } else {
      return null;
    }
  };


  const handleFolderClick = (folderName: any) => {
    setSelectedFolder(selectedFolder === folderName ? null : folderName);
  };

  return (
    <div className="drive-container">
      {carpetas.map((carpeta: any) => (
        <div key={carpeta.id} className={`folder ${selectedFolder === carpeta.name ? 'active' : ''}`}>
          <h2 onClick={() => handleFolderClick(carpeta.name)}>{carpeta.name}</h2>
          {selectedFolder === carpeta.name && (
            <table className="min-w-full bg-transparent border border-gray-700">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Vista Previa</th>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Fecha de Creación</th>
                  <th className="py-2 px-4 border-b">Última Actualización</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {files.items
                  .filter((file: any) => file.carpeta === carpeta.name)
                  .map((file: any) => (
                    <tr key={file.id} className="hover:bg-gray-700">
                      <td className="py-2 px-4 border-b">{renderIcon(file)}</td>
                      <td className="py-2 px-4 border-b">{file.name}</td>
                      <td className="py-2 px-4 border-b">{formatDate(file.created)}</td>
                      <td className="py-2 px-4 border-b">{formatDate(file.updated)}</td>
                      <td className="py-2 px-4 border-b">
                        <a
                          href={`https://pym-database.pockethost.io/api/files/Archivos/${file.id}/${file.File}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Ver
                        </a>
                        <form action={(e) => deleteFile(file.id)}>
                          <button type='submit'>Eliminar</button>
                        </form>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

