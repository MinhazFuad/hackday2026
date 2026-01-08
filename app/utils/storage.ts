
export const STORAGE_KEY = 'minubot_sessions';

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: number;
}

export interface ChatSession {
    id: string;
    name: string;
    messages: Message[];
    createdAt: number;
}

export const getSessions = (): ChatSession[] => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

export const saveSessions = (sessions: ChatSession[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const createNewSession = (): ChatSession => {
    return {
        id: Date.now().toString(),
        name: `Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        messages: [],
        createdAt: Date.now(),
    };
};

export const clearAllSessions = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
