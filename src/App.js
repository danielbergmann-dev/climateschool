import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf/dist/jspdf.es.min';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const defaultTexts = [
    'Wir vermeiden Plastikmüll beim Einkauf.',
    'Wir wollen mehr Bio-Lebensmittel kaufen.',
    'Wir wollen unverarbeitete Lebensmittel nutzen.',
    'Wir wollen weniger Fleisch und tierische Lebensmittel kaufen.',
    'Wir wollen lieber pflanzliche Lebensmittel kaufen.',
    'Wir nutzen Gemüse aus dem Schulgarten.',
    'Wir kaufen Lebensmittel von hier (regional).',
    'Wir kaufen Lebensmittel, die gerade bei uns reif sind (saisonal).',
    'Wir planen unseren Einkauf gut und vermeiden Reste.',
    'Wir wollen Reste der Schulspeisung wiederverwerten.'
  ];

  const [inputs, setInputs] = useState(defaultTexts.map(text => ({ text, ja: false, nein: false })));

  // Funktion zum Aktualisieren des Inputs
  const updateInput = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  // Funktion zum Herunterladen als PDF
  const downloadPDF = () => {
    const input = document.getElementById('app-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      pdf.save('Klimaprojekt.pdf');
    });
  };

  // Daten für das Kreisdiagramm berechnen
  const jaCount = inputs.filter(input => input.ja).length;
  const neinCount = inputs.filter(input => input.nein).length;

  const chartData = {
    labels: [`Ja (${jaCount})`, `Nein (${neinCount})`],
    datasets: [
      {
        label: 'Ergebnisse',
        data: [jaCount, neinCount],
        backgroundColor: ['#4caf50', '#ff5722'],
        hoverBackgroundColor: ['#66bb6a', '#ff7043']
      }
    ]
  };

  return (
    <div className="App" id="app-content">
      <div className="header-container">
        <h1>Projekt Klimaschule - Nachhaltigkeit in der Küche</h1>
        <div className="date-container">
          <p>{new Date().toLocaleDateString()}</p>
          <button onClick={downloadPDF} className="download-button">Download als PDF</button>
        </div>
      </div>
      <div className="inputs-container">
        {inputs.map((input, index) => (
          <div key={index} className="input-box">
            <p className="input-text">{input.text}</p>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={input.ja}
                onChange={() => updateInput(index, 'ja', !input.ja)}
              /> Ja
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={input.nein}
                onChange={() => updateInput(index, 'nein', !input.nein)}
              /> Nein
            </label>
          </div>
        ))}
      </div>
      <div className="chart-container">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default App;