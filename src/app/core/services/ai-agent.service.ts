import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  chatHistory = signal<ChatMessage[]>([
    { role: 'model', content: "Hi! I'm your UI/UX Agent. How can I help you improve the design today?" }
  ]);
  isTyping = signal<boolean>(false);

  private readonly API_URL = 'http://localhost:3000/api';

  async sendMessage(text: string) {
    if (!text.trim()) return;

    // Add user message
    this.chatHistory.update(history => [...history, { role: 'user', content: text }]);
    this.isTyping.set(true);

    try {
      const response = await fetch(`${this.API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: this.chatHistory() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      this.chatHistory.update(history => [
        ...history, 
        { role: 'model', content: data.text || "I couldn't generate a response." }
      ]);
    } catch (error: any) {
      this.chatHistory.update(history => [
        ...history, 
        { role: 'model', content: `Error: ${error.message}. Please ensure the Express server is running and GEMINI_API_KEY is configured.` }
      ]);
      console.error('AI Agent Error:', error);
    } finally {
      this.isTyping.set(false);
    }
  }

  async applyCode(filePath: string, content: string) {
    try {
      const response = await fetch(`${this.API_URL}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath, content })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('AI Agent Apply Error:', error);
      throw error;
    }
  }
}
