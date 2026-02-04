
import { Domain, Account, Message, MessageDetail } from '../types';

const API_BASE = 'https://api.mail.tm';

export const mailService = {
  async getDomains(): Promise<Domain[]> {
    const response = await fetch(`${API_BASE}/domains`);
    const data = await response.json();
    return data['hydra:member'] || [];
  },

  async createAccount(address: string, password: string): Promise<Account> {
    const response = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!response.ok) throw new Error('Account creation failed. User might exist.');
    return response.json();
  },

  async getToken(address: string, password: string): Promise<string> {
    const response = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, password }),
    });
    if (!response.ok) throw new Error('Authentication failed.');
    const data = await response.json();
    return data.token;
  },

  async getMessages(token: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data['hydra:member'] || [];
  },

  async getMessageDetail(id: string, token: string): Promise<MessageDetail> {
    const response = await fetch(`${API_BASE}/messages/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  async deleteMessage(id: string, token: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.ok;
  }
};
