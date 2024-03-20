'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { LOCAL_URL, UBIS_API, pb } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Coordinates } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { z, ZodError } from 'zod';
const GeoButton = () => {
  const [location, setLocation] = useState({ longitud: 0, latitud: 0 });
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Zod schema for descripcion field
  const descripcionSchema = z.string().min(2, 'La descripción no puede estar vacía').max(255, 'La descripción debe tener menos de 255 caracteres');

  const handleEnviarUbicacion = () => {
    // Validate descripcion using Zod
    try {
      descripcionSchema.parse(descripcion);
    } catch (error) {
      if (error instanceof ZodError) {
        setError(error.errors[0].message);
        return;
      }
    }

    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setLocation({ longitud: longitude, latitud: latitude });

          const descripcionFinal = descripcion.trim() === '' ? 'Ubicación sin descripción' : descripcion.trim();
          const userId = pb.authStore.model?.id;

          axios.post(`${LOCAL_URL}/${UBIS_API}`, {
            longitud: longitude,
            latitud: latitude,
            Descripcion: descripcionFinal,
            user: userId,
          })
            .then(response => {
              alert('Ubicacion Enviada con exito')
              router.refresh()

            })
            .catch(error => {
              console.error('Error al enviar la ubicación:', error);
            });
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error.message);
        }
      );
    } else {
      alert('Tu navegador no tiene acceso a la Geolocalización');
    }
  };

  return (
    <div className='m-4 pb-2 '>
      <Input
        className='mb-2 text-black'
        placeholder='Descripcion'
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <Button color="primary" onClick={handleEnviarUbicacion}>
        Enviar Ubicación
      </Button>
    </div>
  );
}

export default GeoButton;
