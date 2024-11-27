import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf/dist/jspdf.es.min";
import jaImage from "./ja_talkerfarbe.jpg";
import neinImage from "./nein.jpg";
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

  const [inputs, setInputs] = useState(
    defaultTexts.map((text) => ({ text, ja: false, nein: false }))
  );

  // Funktion zum Aktualisieren des Inputs
  const updateInput = (index, field, value) => {
    const newInputs = [...inputs];
    if (field === "ja") {
      newInputs[index] = {
        ...newInputs[index],
        ja: value,
        nein: value ? false : newInputs[index].nein,
      };
    } else if (field === "nein") {
      newInputs[index] = {
        ...newInputs[index],
        nein: value,
        ja: value ? false : newInputs[index].ja,
      };
    }
    setInputs(newInputs);
  };

  // Funktion zum Herunterladen als PDF
  const downloadPDF = () => {
    const input = document.getElementById("app-content");
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      const fileName = `${new Date()
        .toLocaleDateString()
        .replace(/\//g, "-")}.pdf`;
      pdf.save(fileName);
    });
  };

  // Daten für das Kreisdiagramm berechnen
  const jaCount = inputs.filter((input) => input.ja).length;
  const neinCount = inputs.filter((input) => input.nein).length;

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

  return (
    <div
      className="App"
      id="app-content"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        maxWidth: "1200px",
        margin: "auto",
        textAlign: "center",
        color: "#333",
      }}
    >
      <div
        className="header-container"
        style={{
          backgroundColor: "rgba(39, 157, 9, 0.9)", 
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          color: "#ffffff",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
          }}
        >
          Projekt Klimaschule - Nachhaltigkeit in der Küche
        </h1>
        <div
          className="date-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>{new Date().toLocaleDateString()}</p>
          <button
            onClick={downloadPDF}
            className="download-button"
            style={{
              backgroundColor: "#ff9800",
              color: "#ffffff",
              padding: "15px 25px",
              borderRadius: "25px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              fontWeight: "bold",
              fontSize: "18px",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
          >
            Download als PDF
          </button>
        </div>
      </div>
      <div className="inputs-container">
        <div className="inputs-columns">
          <div className="inputs-column">
            {inputs.slice(0, 5).map((input, index) => (
              <div
                key={index}
                className="input-box"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "450px",
                  maxWidth: "100%",
                  transition: "transform 0.3s",
                  marginBottom: "20px",
                }}
              >
                <p
                  className="input-text"
                  style={{ fontSize: "16px", color: "#333" }}
                >
                  {input.text}
                </p>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={input.ja}
                    onChange={() => updateInput(index, "ja", !input.ja)}
                  />
                  <img
                    src={jaImage}
                    alt="Ja"
                    className="radio-image"
                    style={{ width: "50px", height: "50px" }}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={input.nein}
                    onChange={() => updateInput(index, "nein", !input.nein)}
                  />
                  <img
                    src={neinImage}
                    alt="Nein"
                    className="radio-image"
                    style={{ width: "50px", height: "50px" }}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="inputs-column">
            {inputs.slice(5).map((input, index) => (
              <div
                key={index + 5}
                className="input-box"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "450px",
                  maxWidth: "100%",
                  transition: "transform 0.3s",
                  marginBottom: "20px",
                }}
              >
                <p
                  className="input-text"
                  style={{ fontSize: "16px", color: "#333" }}
                >
                  {input.text}
                </p>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={input.ja}
                    onChange={() => updateInput(index + 5, "ja", !input.ja)}
                  />
                  <img
                    src={jaImage}
                    alt="Ja"
                    className="radio-image"
                    style={{ width: "50px", height: "50px" }}
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={input.nein}
                    onChange={() => updateInput(index + 5, "nein", !input.nein)}
                  />
                  <img
                    src={neinImage}
                    alt="Nein"
                    className="radio-image"
                    style={{ width: "50px", height: "50px" }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="chart-container"
        style={{
          width: "600px",
          height: "600px",
          margin: "30px auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

export default App;
