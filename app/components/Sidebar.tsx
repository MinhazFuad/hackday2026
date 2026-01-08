"use client";

import { ChatSession } from "../utils/storage";

interface SidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onCreateSession: () => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
    isOpen: boolean;
    onCloseMobile: () => void;
}

export default function Sidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onCreateSession,
    onDeleteSession,
    isOpen,
    onCloseMobile
}: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onCloseMobile}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>MinuBot</h2>
                    <button onClick={onCreateSession} className="new-chat-btn">
                        + New Chat
                    </button>
                </div>

                <div className="session-list">
                    {sessions.length === 0 && (
                        <div className="no-sessions">No previous chats. Start a new one!</div>
                    )}
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => onSelectSession(session.id)}
                            className={`session-item ${activeSessionId === session.id ? "active" : ""}`}
                        >
                            <span className="session-name">{session.name}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => onDeleteSession(session.id, e)}
                                title="Delete Chat"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}
