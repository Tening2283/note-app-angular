import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note, Category } from '../models/note.model';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-overlay" (click)="onOverlayClick($event)">
      <div class="editor-modal">
        <div class="editor-header">
          <h2>{{ isEditing ? 'Modifier la note' : 'Nouvelle note' }}</h2>
          <button class="btn-close" (click)="onClose()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="editor-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Titre</label>
              <input 
                id="title"
                type="text" 
                [(ngModel)]="formData.title"
                placeholder="Titre de la note..."
                class="form-input"
                #titleInput>
            </div>
            
            <div class="form-group category-group">
              <label for="category">Catégorie</label>
              <select 
                id="category"
                [(ngModel)]="formData.category"
                class="form-select">
                <option value="">Aucune catégorie</option>
                <option 
                  *ngFor="let category of categories" 
                  [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="content">Contenu</label>
            <textarea 
              id="content"
              [(ngModel)]="formData.content"
              placeholder="Écrivez votre note ici..."
              class="form-textarea"
              rows="12"></textarea>
          </div>

          <div class="form-group">
            <label for="tags">Tags (séparés par des virgules)</label>
            <input 
              id="tags"
              type="text" 
              [(ngModel)]="tagsInput"
              placeholder="personnel, important, idée..."
              class="form-input">
          </div>
        </div>

        <div class="editor-footer">
          <button class="btn btn-secondary" (click)="onClose()">
            Annuler
          </button>
          <button class="btn btn-primary" (click)="onSave()">
            {{ isEditing ? 'Sauvegarder' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .editor-modal {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0;
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 24px;
    }

    .editor-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .btn-close {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background: #F3F4F6;
      color: #6B7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: #E5E7EB;
      color: #374151;
    }

    .editor-form {
      padding: 0 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .category-group {
      min-width: 200px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #D1D5DB;
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s ease;
      background: white;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 200px;
      font-family: inherit;
      line-height: 1.6;
    }

    .editor-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #E5E7EB;
      margin-top: 24px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-secondary {
      background: #F3F4F6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #E5E7EB;
    }

    .btn-primary {
      background: #3B82F6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563EB;
    }

    @media (max-width: 768px) {
      .editor-overlay {
        padding: 10px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .category-group {
        min-width: auto;
      }
    }
  `]
})
export class NoteEditorComponent {
  @Input() note: Note | null = null;
  @Input() categories: Category[] = [];
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() close = new EventEmitter<void>();

  isEditing = false;
  formData: Partial<Note> = {};
  tagsInput = '';

  constructor() {
    effect(() => {
      if (this.note) {
        this.isEditing = true;
        this.formData = {
          title: this.note.title,
          content: this.note.content,
          category: this.note.category,
          tags: [...this.note.tags]
        };
        this.tagsInput = this.note.tags.join(', ');
      } else {
        this.isEditing = false;
        this.formData = {
          title: '',
          content: '',
          category: '',
          tags: []
        };
        this.tagsInput = '';
      }
    });
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    // Parse tags from input
    const tags = this.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const noteData: Partial<Note> = {
      ...this.formData,
      tags
    };

    this.save.emit(noteData);
  }
}