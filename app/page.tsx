"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";
import {
  ChatSession,
  Message,
  getSessions,
  saveSessions,
  createNewSession
} from "./utils/storage";

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    const loaded = getSessions();
    setSessions(loaded);
    if (loaded.length > 0) {
      setActiveSessionId(loaded[0].id);
    } else {
      handleCreateSession();
    }
  }, []);

  // Save whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const handleCreateSession = () => {
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false); // Close mobile sidebar on selection
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    saveSessions(newSessions); // Force save immediately for deletion

    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    updateSessionMessages(activeSessionId, userMsg);
    setIsBotTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply,
        timestamp: Date.now(),
      };

      updateSessionMessages(activeSessionId, botMsg);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to the AI right now. Please try again later.",
        timestamp: Date.now(),
      };
      updateSessionMessages(activeSessionId, errorMsg);
    } finally {
      setIsBotTyping(false);
    }
  };

  const updateSessionMessages = (sessionId: string, newMessage: Message) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        // Auto-rename chat based on first message if generic name
        let name = session.name;
        if (session.messages.length === 0) {
          name = newMessage.text.slice(0, 20) + (newMessage.text.length > 20 ? "..." : "");
        }
        return {
          ...session,
          name,
          messages: [...session.messages, newMessage]
        };
      }
      return session;
    }));
  };

  return (
    <main className="main-layout">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setIsSidebarOpen(false);
        }}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="content-area">
        <div className="top-bar">
          <h2 className="mobile-title">MinuBot</h2>
          <ThemeToggle />
        </div>

        {activeSession ? (
          <ChatInterface
            messages={activeSession.messages}
            onSendMessage={handleSendMessage}
            isBotTyping={isBotTyping}
          />
        ) : (
          <div className="empty-selection">
            <p>Select a chat or create a new one.</p>
            <button onClick={handleCreateSession} className="primary-btn">Create New Chat</button>
          </div>
        )}
      </div>
    </main>
  );
}
