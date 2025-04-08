// Código actualizado sin rutas alias para compatibilidad en Vercel

import { useState } from "react";
import { format, subDays } from "date-fns";
import "../index.css"; // Corrige la ruta del archivo CSS

const diasDobleSala = [2, 4]; // Martes (2) y Jueves (4)

function generarTurnos(fecha) {
  const horaInicio = 8;
  const horaFin = 14;
  const turnos = [];
  const dia = new Date(fecha).getDay();
  const salas = diasDobleSala.includes(dia) ? ["Sala 1", "Sala 3"] : ["Sala 1"];

  for (let hora = horaInicio; hora < horaFin; hora++) {
    salas.forEach((sala) => {
      const horaTexto = hora.toString().padStart(2, "0") + ":00";
      turnos.push({ hora: horaTexto, sala });
    });
  }
  return turnos;
}

export default function Home() {
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [procedimiento, setProcedimiento] = useState("");
  const [sala, setSala] = useState("Sala 1");
  const [turno, setTurno] = useState("08:00");
  const [suspendido, setSuspendido] = useState(false);
  const [motivoSuspension, setMotivoSuspension] = useState("");
  const [fechaReprogramada, setFechaReprogramada] = useState("");
  const [agenda, setAgenda] = useState([]);
  const [esProvincia, setEsProvincia] = useState(false);
  const [provincia, setProvincia] = useState("");
  const [puedeQuedarse, setPuedeQuedarse] = useState(false);
  const [esHospitalizado, setEsHospitalizado] = useState(false);
  const [area, setArea] = useState("");
  const [cama, setCama] = useState("");

  const turnos = generarTurnos(fecha || new Date());

  const enviar = () => {
    const nuevoTurno = {
      nombre,
      dni,
      edad,
      telefono,
      peso,
      talla,
      sala,
      hora: turno,
      suspendido,
      motivoSuspension,
      esProvincia,
      provincia,
      puedeQuedarse,
      esHospitalizado,
      area,
      cama,
      diagnostico,
      procedimiento
    };
    setAgenda([...agenda, nuevoTurno]);
  };

  const generarOrdenPDF = () => {
    const fechaHosp = format(subDays(new Date(fecha), 1), "dd/MM/yyyy");
    const html = `
      <div style='font-family: sans-serif; padding: 20px; max-width: 700px; margin: auto;'>
        <div style='display: flex; justify-content: space-between; align-items: center;'>
          <img src='/logos/incor.png' alt='Logo INCOR' style='height: 60px;' />
          <h2 style='text-align: center; flex-grow: 1;'>ORDEN DE HOSPITALIZACIÓN</h2>
          <img src='/logos/essalud.png' alt='Logo EsSalud' style='height: 60px;' />
        </div>
        <p><strong>Servicio:</strong> Cardiología Intervencionista</p>
        <p><strong>Fecha:</strong> ${format(new Date(), "dd/MM/yyyy")}</p>
        <hr />
        <p><strong>Apellidos y Nombres:</strong> ${nombre}</p>
        <p><strong>DNI:</strong> ${dni} &nbsp;&nbsp; <strong>Edad:</strong> ${edad}</p>
        <p><strong>Peso:</strong> ${peso} &nbsp;&nbsp; <strong>Talla:</strong> ${talla}</p>
        <p><strong>Procedencia:</strong> ${esProvincia ? provincia : "Lima"} &nbsp;&nbsp; <strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Fecha de Hospitalización:</strong> ${fechaHosp} &nbsp;&nbsp; <strong>Hora:</strong> ${turno}</p>
        <p><strong>Diagnóstico:</strong> ${diagnostico}</p>
        <p><strong>Procedimiento:</strong> ${procedimiento}</p>
        <br />
        <p style='margin-top: 60px;'>_____________________________<br/>Firma y sello médico</p>
      </div>
    `;

    import("html2pdf.js").then((html2pdf) => {
      html2pdf.default().from(html).set({
        margin: 0.5,
        filename: `orden_hospitalizacion_${nombre.replace(/\s+/g, '_')}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      }).save();
    });
  };

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-3xl font-bold">Agenda de Turnos HemoINCOR</h1>

      <form className="grid gap-4">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <input placeholder="Nombre y Apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} />
        <input placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <input placeholder="Peso (opcional)" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <input placeholder="Talla (opcional)" value={talla} onChange={(e) => setTalla(e.target.value)} />
        <textarea placeholder="Diagnóstico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />
        <textarea placeholder="Procedimiento" value={procedimiento} onChange={(e) => setProcedimiento(e.target.value)} />

        <label>
          <input type="checkbox" checked={esProvincia} onChange={() => setEsProvincia(!esProvincia)} /> ¿Paciente de provincia?
        </label>
        {esProvincia && (
          <>
            <input placeholder="Provincia" value={provincia} onChange={(e) => setProvincia(e.target.value)} />
            <label>
              <input type="checkbox" checked={puedeQuedarse} onChange={() => setPuedeQuedarse(!puedeQuedarse)} /> ¿Puede quedarse en Lima?
            </label>
          </>
        )}

        <label>
          <input type="checkbox" checked={esHospitalizado} onChange={() => setEsHospitalizado(!esHospitalizado)} /> ¿Paciente hospitalizado en INCOR?
        </label>
        {esHospitalizado && (
          <>
            <input placeholder="Área de hospitalización" value={area} onChange={(e) => setArea(e.target.value)} />
            <input placeholder="Número de cama" value={cama} onChange={(e) => setCama(e.target.value)} />
          </>
        )}

        <select value={sala} onChange={(e) => setSala(e.target.value)}>
          <option value="Sala 1">Sala 1</option>
          {diasDobleSala.includes(new Date(fecha).getDay()) && <option value="Sala 3">Sala 3</option>}
        </select>

        <select value={turno} onChange={(e) => setTurno(e.target.value)}>
          {turnos.filter(t => t.sala === sala).map((t, i) => (
            <option key={i} value={t.hora}>{t.hora}</option>
          ))}
        </select>

        <label>
          <input type="checkbox" checked={suspendido} onChange={() => setSuspendido(!suspendido)} /> Suspender paciente
        </label>
        {suspendido && (
          <>
            <textarea placeholder="Motivo de suspensión" value={motivoSuspension} onChange={(e) => setMotivoSuspension(e.target.value)} />
            <input type="date" value={fechaReprogramada} onChange={(e) => setFechaReprogramada(e.target.value)} />
          </>
        )}

        <button type="button" onClick={enviar}>Agendar Paciente</button>
        {!esHospitalizado && (
          <button type="button" onClick={generarOrdenPDF}>Generar Orden de Hospitalización (PDF)</button>
        )}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Agenda del Día</h2>
        <div className="grid grid-cols-2 gap-2">
          {turnos.map((t, i) => {
            const turnoAgendado = agenda.find(a => a.hora === t.hora && a.sala === t.sala);
            const bgColor = t.sala === "Sala 1" ? "bg-blue-600" : "bg-green-600";
            const suspStyle = turnoAgendado?.suspendido ? "bg-red-600 line-through" : bgColor;

            return (
              <div
                key={i}
                className={`p-3 rounded-xl shadow text-white font-medium ${suspStyle}`}
              >
                {t.hora} - {t.sala}
                {turnoAgendado && <div className="text-sm">{turnoAgendado.nombre}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
