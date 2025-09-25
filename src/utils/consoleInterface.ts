import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { ChatMessage } from '../types';

const CHAT_HISTORY_FILE = path.join(__dirname, '../../../data/chat_history.json');

export class ConsoleInterface {
  private rl: readline.Interface;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.loadChatHistory();
  }

  /**
   * Load chat history from file
   */
  private loadChatHistory(): void {
    try {
      if (fs.existsSync(CHAT_HISTORY_FILE)) {
        const data = fs.readFileSync(CHAT_HISTORY_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        // Convert timestamp strings back to Date objects
        this.chatHistory = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.chatHistory = [];
    }
  }

  /**
   * Save chat history to file
   */
  private saveChatHistory(): void {
    try {
      const data = this.chatHistory.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      fs.writeFileSync(CHAT_HISTORY_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  /**
   * Get user input from console
   */
  async getUserInput(prompt: string = '> '): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Display a message to the console
   */
  displayMessage(message: string): void {
    console.log(message);
  }

  /**
   * Add a message to chat history
   */
  addToHistory(message: ChatMessage): void {
    this.chatHistory.push(message);
    this.saveChatHistory();
  }

  /**
   * Get recent chat history (last N messages)
   */
  getRecentHistory(limit: number = 10): ChatMessage[] {
    return this.chatHistory.slice(-limit);
  }

  /**
   * Clear chat history
   */
  clearHistory(): void {
    this.chatHistory = [];
    this.saveChatHistory();
  }

  /**
   * Close the readline interface
   */
  close(): void {
    this.rl.close();
  }

  /**
   * Display chat history
   */
  displayHistory(): void {
    if (this.chatHistory.length === 0) {
      console.log('No chat history available.');
      return;
    }

    console.log('\n=== Chat History ===');
    this.chatHistory.forEach((msg, index) => {
      const time = msg.timestamp.toLocaleString();
      console.log(`[${time}] ${msg.role.toUpperCase()}: ${msg.content}`);
    });
    console.log('===================\n');
  }
}
