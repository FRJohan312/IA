"use client";

import React, { useState } from "react";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // mensaje del usuario
    setMessages((prev) => [...prev, { from: "Tú", text: input }]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: input }),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      const data = await res.json();

      // respuesta del agente
      setMessages((prev) => [...prev, { from: "Agente", text: data.respuesta }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "Agente", text: "❌ Error al conectar con el servidor" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="p-4 bg-blue-500 text-white font-bold text-lg rounded-t-lg">
        💬 Agente Conversacional
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === "Tú" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow 
              ${
                m.from === "Tú"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full px-4 py-2 text-sm 
                     bg-gray-100 text-gray-900 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-full 
                     hover:bg-blue-600 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chat;
