import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss'
})
export class ChatBubbleComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.addMessage('¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?', false);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private addMessage(text: string, isUser: boolean, status: 'sending' | 'sent' | 'error' = 'sent'): void {
    this.messages.push({
      text,
      isUser,
      timestamp: new Date(),
      status
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) return;

    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    // Agregar mensaje del usuario
    this.addMessage(userMessage, true, 'sending');

    try {
      const response = await this.chatService.sendMessage(userMessage);
      
      // Actualizar estado del mensaje del usuario
      const lastUserMessage = this.messages[this.messages.length - 1];
      if (lastUserMessage.isUser) {
        lastUserMessage.status = 'sent';
      }

      // Agregar respuesta del asistente
      this.addMessage(response, false);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.addMessage('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.', false, 'error');
      
      // Marcar mensaje del usuario como error
      const lastUserMessage = this.messages[this.messages.length - 2];
      if (lastUserMessage.isUser) {
        lastUserMessage.status = 'error';
      }
    } finally {
      this.isLoading = false;
    }
  }
}