'use client';

import { createfile } from '@/lib/actions';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export const FormFile = ({ roles }: any) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const fileInput = event.target.querySelector('input[type="file"]');
    const files = fileInput.files;

    // Iterar sobre cada archivo y llamar a createfile
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Crear un objeto FormData para enviar el archivo
      const formData = new FormData();
      formData.append('File', file);

      // Agregar más propiedades según tus necesidades
      formData.append('name', file.name);
      formData.append('type', file.type);
      formData.append('size', file.size);

      // Agregar el ID del rol seleccionado
      formData.append('carpeta', selectedRole);

      // Llamar a createfile con el objeto FormData
      createfile(formData);

      // Puedes también mostrar la información en la consola si lo deseas
      console.log(`Archivo ${i + 1}:`, formData);
    }

    // Limpiar el formulario si es necesario
    event.target.reset();
    setSelectedRole('');  // Limpiar el rol seleccionado
  };

  return (
    <div>
      <form className="mb-4" onSubmit={handleSubmit}>
        <Input type='file' name='File' className='border border-gray-700' multiple />

        <Label className="block text-gray-700 text-sm font-bold mb-2 mt-4">Selecciona un Rol:</Label>
        <select
          className='border border-gray-700'
          name="role"
          onChange={handleRoleChange}
          value={selectedRole}
        >
          <option value="" disabled>Selecciona un rol</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>

        <Button className='border border-gray-700 mt-4' type="submit">
          Crear Archivo
        </Button>
      </form>
    </div>
  );
};

