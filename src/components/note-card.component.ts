import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-card" (click)="onSelect()">
      <div class="note-header">
        <h3 class="note-title">{{ note.title }}</h3>
        <div class="note-actions">
          <button 
            class="btn-icon edit" 
            (click)="onEdit($event)"
            title="Modifier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button 
            class="btn-icon delete" 
            (click)="onDelete($event)"
            title="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="note-content">
        {{ truncateContent(note.content) }}
      </div>
      
      <div class="note-footer">
        <div class="note-tags">
          <span 
            *ngFor="let tag of note.tags" 
            class="tag">
            {{ tag }}
          </span>
        </div>
        <div class="note-date">
          {{ formatDate(note.updatedAt) }}
        </div>
      </div>
      
      <div 
        *ngIf="note.category" 
        class="category-indicator"
        [style.background-color]="getCategoryColor()">
      </div>
    </div>
  `,
  styles: [`
    .note-card {
      position: relative;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      overflow: hidden;
    }

    .note-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-color: #3B82F6;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .note-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
      line-height: 1.4;
      flex: 1;
      margin-right: 12px;
    }

    .note-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .note-card:hover .note-actions {
      opacity: 1;
    }

    .btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: #F3F4F6;
      color: #6B7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .btn-icon:hover {
      background: #E5E7EB;
      color: #374151;
    }

    .btn-icon.delete:hover {
      background: #FEE2E2;
      color: #DC2626;
    }

    .btn-icon.edit:hover {
      background: #DBEAFE;
      color: #2563EB;
    }

    .note-content {
      color: #4B5563;
      line-height: 1.6;
      margin-bottom: 16px;
      font-size: 0.95rem;
    }

    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tag {
      background: #F3F4F6;
      color: #6B7280;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .note-date {
      font-size: 0.75rem;
      color: #9CA3AF;
      white-space: nowrap;
    }

    .category-indicator {
      position: absolute;
      top: 0;
      right: 0;
      width: 4px;
      height: 100%;
    }

    @media (max-width: 768px) {
      .note-card {
        padding: 16px;
      }
      
      .note-actions {
        opacity: 1;
      }
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Input() categoryColor?: string;
  @Output() select = new EventEmitter<Note>();
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  onSelect(): void {
    this.select.emit(this.note);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.note);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.note);
  }

  truncateContent(content: string): string {
    const maxLength = 150;
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `il y a ${hours}h`;
    } else {
      return 'À l\'instant';
    }
  }

  getCategoryColor(): string {
    return this.categoryColor || '#3B82F6';
  }
}