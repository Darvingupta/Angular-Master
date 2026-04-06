import { Component, ElementRef, ViewChild, inject, signal, effect, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../core/services/ai-agent.service';

@Component({
  selector: 'app-ai-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Action Button -->
    <button 
      class="agent-fab" 
      [class.open]="isOpen()" 
      (click)="toggleAgent()"
      title="Ask UI/UX Agent">
      ✨
    </button>

    <!-- Chat Window -->
    <div class="agent-window" [class.open]="isOpen()">
      <div class="agent-header">
        <div class="header-info">
          <span class="agent-icon">✨</span>
          <div class="agent-title-container">
            <span class="agent-title">Gemini Design Expert</span>
            <span class="agent-subtitle">Powered by Google AI</span>
          </div>
        </div>
        <button class="close-btn" (click)="toggleAgent()">✕</button>
      </div>

      <div class="agent-messages" #messagesContainer>
        @for (msg of agentService.chatHistory(); track $index) {
          <div class="message-row" [class.user]="msg.role === 'user'" [class.model]="msg.role === 'model'">
            <div class="message-bubble">
              <span class="message-content" [innerHTML]="formatMessage(msg.content)"></span>
            </div>
          </div>
        }
        
        @if (agentService.isTyping()) {
          <div class="message-row model typing-indicator-row">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        }
      </div>

      <div class="agent-input-area">
        <input 
          #chatInput
          type="text" 
          [(ngModel)]="userInput" 
          (keydown.enter)="sendMessage()"
          placeholder="Ask for UI/UX improvements..."
          [disabled]="agentService.isTyping()"
        />
        <button 
          class="send-btn" 
          (click)="sendMessage()" 
          [disabled]="!userInput.trim() || agentService.isTyping()">
          ➤
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* FAB Styles */
    .agent-fab {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c4dff, #1a73e8);
      color: white;
      font-size: 24px;
      border: none;
      box-shadow: 0 10px 25px rgba(26, 115, 232, 0.4);
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .agent-fab:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 35px rgba(26, 115, 232, 0.5);
    }
    
    .agent-fab.open {
      transform: scale(0);
      opacity: 0;
    }

    /* Window Styles */
    .agent-window {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 400px;
      height: 600px;
      max-height: calc(100vh - 60px);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5) inset;
      border: 1px solid rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      z-index: 999;
      transform: scale(0.9) translateY(20px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
      transform-origin: bottom right;
      overflow: hidden;
    }
    
    .agent-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    @media (max-width: 480px) {
      .agent-window {
        width: calc(100vw - 40px);
        right: 20px;
        bottom: 20px;
      }
    }

    /* Header */
    .agent-header {
      background: linear-gradient(135deg, #1e1e2e, #2d2d44);
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    
    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .agent-icon {
      font-size: 24px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .agent-title-container {
      display: flex;
      flex-direction: column;
    }
    
    .agent-title {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
    
    .agent-subtitle {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.7);
    }
    
    .close-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      font-size: 20px;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      transform: rotate(90deg);
    }

    /* Messages Area */
    .agent-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
    }
    
    /* Scrollbar styling */
    .agent-messages::-webkit-scrollbar { width: 6px; }
    .agent-messages::-webkit-scrollbar-track { background: transparent; }
    .agent-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    .agent-messages::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

    .message-row {
      display: flex;
      width: 100%;
    }
    
    .message-row.user {
      justify-content: flex-end;
    }
    
    .message-row.model {
      justify-content: flex-start;
    }

    .message-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.95rem;
      line-height: 1.5;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      animation: messageEnter 0.3s ease forwards;
    }
    
    @keyframes messageEnter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-row.user .message-bubble {
      background: linear-gradient(135deg, #1a73e8, #4285f4);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-row.model .message-bubble {
      background: #f1f3f4;
      color: #3c4043;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    /* Pre formatting for code in bubbles */
    .message-content { display: block; word-break: break-word; }
    
    /* Typing Indicator */
    .typing-indicator-row { margin-top: 5px; }
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #f1f3f4;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
    }
    
    .typing-indicator span {
      width: 6px;
      height: 6px;
      background: #a0aab5;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out both;
    }
    
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* Input Area */
    .agent-input-area {
      padding: 15px 20px;
      border-top: 1px solid rgba(0,0,0,0.05);
      background: white;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .agent-input-area input {
      flex: 1;
      padding: 14px 20px;
      border: 1px solid #e0e0e0;
      border-radius: 30px;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
      background: #f8f9fa;
    }
    
    .agent-input-area input:focus {
      border-color: #1a73e8;
      background: white;
      box-shadow: 0 0 0 3px rgba(26,115,232,0.1);
    }
    
    .agent-input-area input:disabled {
      background: #f1f3f4;
      cursor: not-allowed;
    }

    .send-btn {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #1a73e8;
      color: white;
      border: none;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .send-btn:hover:not(:disabled) {
      background: #1557b0;
      transform: scale(1.05);
    }
    
    .send-btn:disabled {
      background: #bdc1c6;
      cursor: not-allowed;
    }
  `]
})
export class AiAgentComponent {
  isOpen = signal(false);
  userInput = '';
  agentService = inject(AiAgentService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  constructor() {
    // Scroll to bottom whenever chat history updates
    effect(() => {
      this.agentService.chatHistory();
      this.scrollToBottom();
    });
  }

  toggleAgent() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      // Focus input when opened
      afterNextRender(() => {
        setTimeout(() => this.chatInput?.nativeElement?.focus(), 100);
        this.scrollToBottom();
      });
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.agentService.isTyping()) return;
    
    const text = this.userInput;
    this.userInput = ''; // clear input
    
    await this.agentService.sendMessage(text);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  // Simple formatter to handle basic markdown like bold and code blocks
  formatMessage(text: string): string {
    if (!text) return '';
    
    let formatted = text
      // Replace code blocks
      .replace(/\`\`\`(.*?)\`\`\`/gs, '<pre style="background:rgba(0,0,0,0.05);padding:10px;border-radius:6px;overflow-x:auto;font-family:monospace;margin:8px 0;font-size:0.85em;">$1</pre>')
      // Replace inline code
      .replace(/\`(.*?)\`/g, '<code style="background:rgba(0,0,0,0.05);padding:2px 4px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#e83e8c;">$1</code>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // New lines to br
      .replace(/\\n/g, '<br/>');
      
    return formatted;
  }
}
