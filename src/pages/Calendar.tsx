// src/pages/Calendar.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext'; 
import { v4 as uuidv4 } from "uuid"; // npm install uuid

interface CalendarEvent {
  id?: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  conferenceData?: any;
}

const Calendar: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ summary: "", start: "", end: "" });

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/calendar", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data.items || []);
        setLoading(false);
      });
  }, [token]);

  const formatDateWithOffset = (datetimeLocal: string) => {
    const date = new Date(datetimeLocal);
    if (isNaN(date.getTime())) return "";

    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:00${sign}${hours}:${minutes}`;
  };

  const handleCreate = async () => {
    if (!newEvent.summary || !newEvent.start || !newEvent.end) {
      alert("Preencha todos os campos antes de criar o evento.");
      return;
    }

    const body = {
      summary: newEvent.summary,
      start: {
        dateTime: formatDateWithOffset(newEvent.start),
        timeZone: "America/Sao_Paulo"
      },
      end: {
        dateTime: formatDateWithOffset(newEvent.end),
        timeZone: "America/Sao_Paulo"
      },
      conferenceData: {
        createRequest: {
          conferenceSolutionKey: { type: "hangoutsMeet" },
          requestId: uuidv4()
        }
      }
    };

    const res = await fetch("http://localhost:5000/api/calendar?conferenceDataVersion=1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.id) {
      setEvents([...events, data]);
      setNewEvent({ summary: "", start: "", end: "" });
    } else {
      alert("Erro ao criar evento: " + JSON.stringify(data));
    }
  };

  const handleUpdate = async (id: string) => {
    const newTitle = prompt("Novo título do evento:");
    if (!newTitle) return;
    const body = { summary: newTitle };
    await fetch(`http://localhost:5000/api/calendar/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setEvents(events.map(e => (e.id === id ? { ...e, summary: newTitle } : e)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/calendar/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(events.filter(e => e.id !== id));
  };

  if (loading) return <p>Carregando eventos...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🗓️ Meus Eventos</h1>

      <div className="bg-white shadow p-4 rounded mb-4">
        <h2 className="text-lg mb-2">➕ Criar Novo Evento com Google Meet</h2>
        <input
          className="border p-2 mr-2"
          placeholder="Título"
          value={newEvent.summary}
          onChange={e => setNewEvent({ ...newEvent, summary: e.target.value })}
        />
        <input
          type="datetime-local"
          className="border p-2 mr-2"
          value={newEvent.start}
          onChange={e => setNewEvent({ ...newEvent, start: e.target.value })}
        />
        <input
          type="datetime-local"
          className="border p-2 mr-2"
          value={newEvent.end}
          onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleCreate}
        >
          Criar com Meet
        </button>
      </div>

      <ul className="space-y-2">
        {events.map(ev => (
          <li
            key={ev.id}
            className="bg-gray-100 p-3 rounded flex justify-between"
          >
            <div>
              <strong>{ev.summary}</strong>
              <br />
              {ev.start?.dateTime} → {ev.end?.dateTime}
              {ev.conferenceData?.entryPoints && (
                <div>
                  <a
                    href={ev.conferenceData.entryPoints[0].uri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Link do Google Meet 🎥
                  </a>
                </div>
              )}
            </div>
            <div className="space-x-2">
              <button
                className="bg-yellow-500 px-2 py-1 rounded text-white"
                onClick={() => handleUpdate(ev.id!)}
              >
                ✏️
              </button>
              <button
                className="bg-red-500 px-2 py-1 rounded text-white"
                onClick={() => handleDelete(ev.id!)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
