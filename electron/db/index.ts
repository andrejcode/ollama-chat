import { IpcChannels } from '@electron/types';
import type { Message } from '@shared/types';
import { generateUniqueId } from '@shared/utils';
import type Database from 'better-sqlite3';
import { app, ipcMain } from 'electron';
import path from 'path';

let db: Database.Database;

export async function initDb() {
  try {
    // Dynamic import to handle ES module compatibility
    const DatabaseConstructor = (await import('better-sqlite3')).default;

    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'chats.sqlite');

    db = new DatabaseConstructor(dbPath);

    db.pragma('foreign_keys = ON');

    db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id          TEXT PRIMARY KEY,
        title       TEXT,
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id          TEXT PRIMARY KEY,
        chat_id     TEXT NOT NULL,
        role        TEXT NOT NULL,
        content     TEXT NOT NULL,
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL,
        FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE
      );
    `);

    console.log(`SQLite DB initialized at: ${dbPath}`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export function createChat(title?: string) {
  const chatId = generateUniqueId();
  const now = Date.now();

  const stmt = db.prepare(
    `INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)`,
  );
  stmt.run(chatId, title ?? null, now, now);

  return chatId;
}

export function addMessageToChat(chatId: string, message: Message) {
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO messages (id, chat_id, role, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(message.id, chatId, message.role, message.content, now, now);
}

export function getMessagesForChat(chatId: string): Message[] {
  const stmt = db.prepare(`
    SELECT id, role, content
    FROM messages
    WHERE chat_id = ?
    ORDER BY created_at ASC
  `);

  const rows = stmt.all(chatId) as Array<{
    id: string;
    role: string;
    content: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    content: row.content,
  }));
}

export function updateMessage(messageId: string, content: string) {
  const now = Date.now();

  const stmt = db.prepare(`
    UPDATE messages
    SET content = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(content, now, messageId);
}

export function getAllChats(): Array<{
  id: string;
  title: string | null;
  created_at: number;
  updated_at: number;
}> {
  const stmt = db.prepare(`
    SELECT id, title, created_at, updated_at
    FROM chats
    ORDER BY created_at DESC
  `);

  return stmt.all() as Array<{
    id: string;
    title: string | null;
    created_at: number;
    updated_at: number;
  }>;
}

export function updateChatTitle(chatId: string, title: string) {
  const now = Date.now();

  const stmt = db.prepare(`
    UPDATE chats
    SET title = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(title, now, chatId);
}

export function registerDbHandlers() {
  ipcMain.handle(IpcChannels.DB_CREATE_CHAT, (_event, title?: string) => {
    return createChat(title);
  });

  ipcMain.handle(
    IpcChannels.DB_ADD_MESSAGE,
    (_event, chatId: string, message: Message) => {
      return addMessageToChat(chatId, message);
    },
  );

  ipcMain.handle(IpcChannels.DB_GET_MESSAGES, (_event, chatId: string) => {
    return getMessagesForChat(chatId);
  });

  ipcMain.handle(
    IpcChannels.DB_UPDATE_MESSAGE,
    (_event, messageId: string, content: string) => {
      return updateMessage(messageId, content);
    },
  );

  ipcMain.handle(IpcChannels.DB_GET_ALL_CHATS, () => {
    return getAllChats();
  });

  ipcMain.handle(
    IpcChannels.DB_UPDATE_CHAT_TITLE,
    (_event, chatId: string, title: string) => {
      return updateChatTitle(chatId, title);
    },
  );
}
