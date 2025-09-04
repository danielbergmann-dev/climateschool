import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf/dist/jspdf.es.min";

import jaImage from "./ja_talkerfarbe.jpg";
import neinImage from "./nein.jpg";

// Vorlagen-Icons (links in jeder Karte)
import icon1 from "./icons/Bild1.png";
import icon2 from "./icons/Bild2.png";
import icon3 from "./icons/Bild3.png";
import icon4 from "./icons/Bild4.png";
import icon5 from "./icons/Bild5.png";
import icon6 from "./icons/Bild6.png";
import icon7 from "./icons/Bild7.png";
import icon8 from "./icons/Bild8.png";
import icon9 from "./icons/Bild9.png";
import icon10 from "./icons/Bild10.png";

import "./App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const defaultTexts = [
    "Wir vermeiden Plastikmüll beim Einkauf.",
    "Wir wollen mehr Bio-Lebensmittel kaufen.",
    "Wir wollen unverarbeitete Lebensmittel nutzen.",
    "Wir wollen weniger Fleisch und tierische Lebensmittel kaufen.",
    "Wir wollen lieber pflanzliche Lebensmittel kaufen.",
    "Wir nutzen Gemüse aus dem Schulgarten.",
    "Wir kaufen Lebensmittel von hier (regional).",
    "Wir kaufen Lebensmittel, die gerade bei uns reif sind (saisonal).",
    "Wir planen unseren Einkauf gut und vermeiden Reste.",
    "Wir wollen Reste der Schulspeisung wiederverwerten.",
  ];

  const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10];

  const [inputs, setInputs] = useState(
    defaultTexts.map((text) => ({ text, ja: false, nein: false }))
  );

  const updateInput = (index, field, value) => {
    const newInputs = [...inputs];
    if (field === "ja") {
      newInputs[index] = { ...newInputs[index], ja: value, nein: value ? false : newInputs[index].nein };
    } else if (field === "nein") {
      newInputs[index] = { ...newInputs[index], nein: value, ja: value ? false : newInputs[index].ja };
    }
    setInputs(newInputs);
  };

  const downloadPDF = () => {
    const input = document.getElementById("app-content");
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      const fileName = `${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
      pdf.save(fileName);
    });
  };

  const jaCount = inputs.filter((i) => i.ja).length;
  const neinCount = inputs.filter((i) => i.nein).length;

  const chartData = {
    labels: [`Ja (${jaCount})`, `Nein (${neinCount})`],
    datasets: [
      {
        label: "Ergebnisse",
        data: [jaCount, neinCount],
        backgroundColor: ["#00f949", "#ff2600"],
        hoverBackgroundColor: ["#00f949", "#ff2600"],
      },
    ],
  };

  const Card = ({ input, idx }) => (
    <div className="input-box two-col">
      {/* Linkes Icon */}
      <img src={icons[idx]} alt="" className="left-icon" />

      <p className="input-text">{input.text}</p>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={input.ja}
          onChange={() => updateInput(idx, "ja", !input.ja)}
        />
        <img src={jaImage} alt="Ja" className="radio-image" />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={input.nein}
          onChange={() => updateInput(idx, "nein", !input.nein)}
        />
        <img src={neinImage} alt="Nein" className="radio-image" />
      </label>
    </div>
  );

  return (
    <div className="App" id="app-content">
      <header className="header-container">
        <h1>Projekt Klimaschule - Nachhaltigkeit in der Küche</h1>
        <div className="date-row">
          <span>{new Date().toLocaleDateString()}</span>
          <button onClick={downloadPDF} className="download-button">Download als PDF</button>
        </div>
      </header>

      {/* Genau 5 links, 5 rechts */}
      <main className="inputs-container">
        <div className="inputs-columns">
          <div className="inputs-column">
            {inputs.slice(0, 5).map((input, index) => (
              <Card key={index} input={input} idx={index} />
            ))}
          </div>
          <div className="inputs-column">
            {inputs.slice(5).map((input, index) => (
              <Card key={index + 5} input={input} idx={index + 5} />
            ))}
          </div>
        </div>
      </main>

      <section className="chart-section">
        <div className="chart-container">
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </section>
    </div>
  );
}

export default App;