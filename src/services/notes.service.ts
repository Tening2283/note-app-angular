import { Injectable, signal, computed } from '@angular/core';
import { Note, Category } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly STORAGE_KEY = 'notes-app-data';
  
  // Signals for reactive state management
  private notesSignal = signal<Note[]>([]);
  private categoriesSignal = signal<Category[]>([
    { id: '1', name: 'Personnel', color: '#3B82F6' },
    { id: '2', name: 'Travail', color: '#10B981' },
    { id: '3', name: 'Idées', color: '#F59E0B' },
    { id: '4', name: 'Important', color: '#EF4444' }
  ]);
  private searchTermSignal = signal<string>('');
  private selectedCategorySignal = signal<string>('');

  // Public computed signals
  notes = this.notesSignal.asReadonly();
  categories = this.categoriesSignal.asReadonly();
  searchTerm = this.searchTermSignal.asReadonly();
  selectedCategory = this.selectedCategorySignal.asReadonly();

  // Filtered notes based on search and category
  filteredNotes = computed(() => {
    const notes = this.notesSignal();
    const search = this.searchTermSignal().toLowerCase();
    const category = this.selectedCategorySignal();

    return notes.filter(note => {
      const matchesSearch = !search || 
        note.title.toLowerCase().includes(search) || 
        note.content.toLowerCase().includes(search) ||
        note.tags.some(tag => tag.toLowerCase().includes(search));
      
      const matchesCategory = !category || note.category === category;
      
      return matchesSearch && matchesCategory;
    });
  });

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.notes) {
        // Convert date strings back to Date objects
        const notes = data.notes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        this.notesSignal.set(notes);
      }
      if (data.categories) {
        this.categoriesSignal.set(data.categories);
      }
    }
  }

  private saveData(): void {
    const data = {
      notes: this.notesSignal(),
      categories: this.categoriesSignal()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  addNote(noteData: Partial<Note>): Note {
    const note: Note = {
      id: this.generateId(),
      title: noteData.title || 'Nouvelle note',
      content: noteData.content || '',
      category: noteData.category || '',
      tags: noteData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notesSignal.update(notes => [...notes, note]);
    this.saveData();
    return note;
  }

  updateNote(id: string, updates: Partial<Note>): void {
    this.notesSignal.update(notes => 
      notes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    this.saveData();
  }

  deleteNote(id: string): void {
    this.notesSignal.update(notes => notes.filter(note => note.id !== id));
    this.saveData();
  }

  getNote(id: string): Note | undefined {
    return this.notesSignal().find(note => note.id === id);
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setSelectedCategory(categoryId: string): void {
    this.selectedCategorySignal.set(categoryId);
  }

  addCategory(name: string, color: string): void {
    const category: Category = {
      id: this.generateId(),
      name,
      color
    };
    this.categoriesSignal.update(categories => [...categories, category]);
    this.saveData();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}