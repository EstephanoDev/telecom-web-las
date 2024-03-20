'use client'

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ExpandableBarChart = ({ week }: any) => {
  const [showChart, setShowChart] = useState(false); // Estado para controlar la visibilidad del gráfico

  const toggleChart = () => {
    setShowChart(!showChart); // Cambiar el estado al hacer clic en el nombre del tipo de trabajo
  }

  const tipoTrabajo = week[0].TipoTrabajo; // Tomar el tipo de trabajo de cualquier elemento en la semana

  // Renderizar el componente del gráfico de barras si showChart es true
  const renderChart = () => {
    if (showChart) {
      // Obtener los datos de las semanas y la suma del trabajo
      const labels = week.map((item: { Semana: string }) => item.Semana);
      const dataValues = week.map((item: { SumaDelTrabajo: number }) => item.SumaDelTrabajo);

      // Generar un color aleatorio para el gráfico
      const backgroundColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.2)`;

      // Definir los datos del gráfico
      const data = {
        labels: labels,
        datasets: [{
          label: tipoTrabajo, // Mostrar el tipo de trabajo en la leyenda
          data: dataValues,
          backgroundColor: backgroundColor,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };

      return (
        <Bar data={data} />
      );
    }
    return null;
  }

  return (
    <div className='mt-2'>
      {/* Mostrar el nombre del tipo de trabajo y hacer clic para expandir/retraer */}
      <h2 className="cursor-pointer text-lg font-semibold mb-2 mx-2 hover:text-blue-600 border p-2 rounded" onClick={toggleChart}>Gráfico de Barras - {tipoTrabajo}</h2>
      {/* Renderizar el gráfico si showChart es true */}
      {renderChart()}
    </div>
  );
}

export default ExpandableBarChart;
