export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  notes: Note[]
  reminders: Reminder[]
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  content: string
  createdAt: Date
}

export interface Reminder {
  id: string
  title: string
  date: Date
  completed: boolean
}

export type ClientFormData = Omit<Client, 'id' | 'notes' | 'reminders' | 'createdAt' | 'updatedAt'>