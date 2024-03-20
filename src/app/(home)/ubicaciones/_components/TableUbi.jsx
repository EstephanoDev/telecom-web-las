'use client'

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { fetchUbis } from '@/lib/data'; // Asumo que tienes una función para actualizar la descripción
import { useQuery } from '@tanstack/react-query';
import TableCellMaps from './tableCellMaps';
import { Button } from '@/components/ui/button';
import { EditUbi } from '@/lib/actions';

const TableUbi = () => {
  const { data, error, isFetched, refetch } = useQuery({
    queryKey: ["ubicacion"],
    queryFn: fetchUbis
  });

  const [editingUbi, setEditingUbi] = useState(null);

  const handleEditClick = (ubi) => {
    setEditingUbi(ubi);
  };

  const handleSaveDescription = async (e) => {
    e.preventDefault();

    // Aquí puedes llamar a tu función de edición en el servidor (EditUbi)
    await EditUbi({
      id: e.target.id.value,
      descripcion: e.target.descripcion.value
    });

    // Después de guardar, actualiza los datos haciendo un refetch
    await refetch();

    // Cierra el modo de edición
    setEditingUbi(null);
  };

  const handleCancelEdit = () => {
    setEditingUbi(null);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Creado</TableCell>
            <TableCell>Latitud</TableCell>
            <TableCell>Longitud</TableCell>
            <TableCell>Descripcion</TableCell>
            <TableCell>Maps</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((ubis) => (
            <TableRow key={ubis.id}>
              <TableCell>{ubis.created ? new Date(ubis.created).toLocaleString() : ''}</TableCell>
              <TableCell>{ubis.latitud}</TableCell>
              <TableCell>{ubis.longitud}</TableCell>
              <TableCell>
                {editingUbi && editingUbi.id === ubis.id ? (
                  <form onSubmit={handleSaveDescription}>
                    <input type="hidden" value={ubis.id} name='id' />
                    <input
                      className='text-black'
                      type="text"
                      name='descripcion'
                      defaultValue={ubis.Descripcion}
                    />
                    <button type='submit' >Guardar</button>
                    <button type='button' onClick={handleCancelEdit}>Cancelar</button>
                  </form>
                ) : (
                  <>
                    {ubis.Descripcion}{' '}
                    <Button className='m-2' onClick={() => handleEditClick(ubis)}>Editar</Button>
                  </>
                )}
              </TableCell>
              <TableCellMaps latitude={ubis.latitud} longitude={ubis.longitud} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableUbi;

