import { Component, computed, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NotesService } from './services/notes.service';
import { SidebarComponent } from './components/sidebar.component';
import { NoteCardComponent } from './components/note-card.component';
import { NoteEditorComponent } from './components/note-editor.component';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    NoteCardComponent, 
    NoteEditorComponent
  ],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <app-sidebar
        [isOpen]="sidebarOpen()"
        [categories]="notesService.categories()"
        [selectedCategory]="notesService.selectedCategory()"
        [searchTerm]="notesService.searchTerm()"
        [totalNotes]="notesService.notes().length"
        [categoryCounts]="categoryCounts()"
        (toggleSidebarEvent)="toggleSidebar()"
        (closeSidebarEvent)="closeSidebar()"
        (newNote)="openEditor()"
        (categorySelect)="selectCategory($event)"
        (searchChange)="setSearchTerm($event)">
      </app-sidebar>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <header class="app-header">
          <div class="header-left">
            <button 
              class="btn-menu"
              (click)="toggleSidebar()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
            <h1>{{ getHeaderTitle() }}</h1>
          </div>
          <div class="header-actions">
            <button class="btn-new" (click)="openEditor()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
              Nouvelle note
            </button>
          </div>
        </header>

        <!-- Notes Grid -->
        <main class="notes-container">
          <div *ngIf="notesService.filteredNotes().length === 0" class="empty-state">
            <div class="empty-illustration">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <h3>{{ getEmptyStateTitle() }}</h3>
            <p>{{ getEmptyStateMessage() }}</p>
            <button class="btn-empty-action" (click)="openEditor()">
              Créer ma première note
            </button>
          </div>

          <div *ngIf="notesService.filteredNotes().length > 0" class="notes-grid">
            <app-note-card
              *ngFor="let note of notesService.filteredNotes(); trackBy: trackByNoteId"
              [note]="note"
              [categoryColor]="getCategoryColor(note.category)"
              (select)="selectNote($event)"
              (edit)="editNote($event)"
              (delete)="deleteNote($event)">
            </app-note-card>
          </div>
        </main>
      </div>

      <!-- Note Editor Modal -->
      <app-note-editor
        *ngIf="showEditor()"
        [note]="selectedNote()"
        [categories]="notesService.categories()"
        (save)="saveNote($event)"
        (close)="closeEditor()">
      </app-note-editor>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background: #F9FAFB;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .app-header {
      background: white;
      border-bottom: 1px solid #E5E7EB;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-menu {
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

    .btn-menu:hover {
      background: #E5E7EB;
      color: #374151;
    }

    .app-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .btn-new {
      padding: 10px 20px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-new:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .notes-container {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 20px;
      max-width: 400px;
      margin: 0 auto;
    }

    .empty-illustration {
      margin-bottom: 24px;
      color: #D1D5DB;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #6B7280;
      margin: 0 0 24px 0;
      line-height: 1.6;
    }

    .btn-empty-action {
      padding: 12px 24px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-empty-action:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }

    @media (min-width: 1024px) {
      .btn-menu {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 12px 16px;
      }
      
      .notes-container {
        padding: 16px;
      }
      
      .notes-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .btn-new span {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  sidebarOpen = signal(false);
  showEditor = signal(false);
  selectedNote = signal<Note | null>(null);

  // Computed values
  categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    const notes = this.notesService.notes();
    
    notes.forEach(note => {
      if (note.category) {
        counts[note.category] = (counts[note.category] || 0) + 1;
      }
    });
    
    return counts;
  });

  constructor(public notesService: NotesService) {}

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  openEditor(): void {
    this.selectedNote.set(null);
    this.showEditor.set(true);
  }

  editNote(note: Note): void {
    this.selectedNote.set(note);
    this.showEditor.set(true);
  }

  closeEditor(): void {
    this.showEditor.set(false);
    this.selectedNote.set(null);
  }

  saveNote(noteData: Partial<Note>): void {
    const currentNote = this.selectedNote();
    
    if (currentNote) {
      this.notesService.updateNote(currentNote.id, noteData);
    } else {
      this.notesService.addNote(noteData);
    }
    
    this.closeEditor();
  }

  deleteNote(note: Note): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.notesService.deleteNote(note.id);
    }
  }

  selectNote(note: Note): void {
    this.editNote(note);
  }

  selectCategory(categoryId: string): void {
    this.notesService.setSelectedCategory(categoryId);
    this.closeSidebar();
  }

  setSearchTerm(term: string): void {
    this.notesService.setSearchTerm(term);
  }

  getCategoryColor(categoryId: string): string {
    const category = this.notesService.categories().find(c => c.id === categoryId);
    return category?.color || '#3B82F6';
  }

  getHeaderTitle(): string {
    const selectedCategory = this.notesService.selectedCategory();
    const searchTerm = this.notesService.searchTerm();
    
    if (searchTerm) {
      return `Recherche: "${searchTerm}"`;
    }
    
    if (selectedCategory) {
      const category = this.notesService.categories().find(c => c.id === selectedCategory);
      return category?.name || 'Notes';
    }
    
    return 'Toutes les notes';
  }

  getEmptyStateTitle(): string {
    const searchTerm = this.notesService.searchTerm();
    const selectedCategory = this.notesService.selectedCategory();
    
    if (searchTerm) {
      return 'Aucun résultat';
    }
    
    if (selectedCategory) {
      return 'Aucune note dans cette catégorie';
    }
    
    return 'Aucune note pour le moment';
  }

  getEmptyStateMessage(): string {
    const searchTerm = this.notesService.searchTerm();
    const selectedCategory = this.notesService.selectedCategory();
    
    if (searchTerm) {
      return `Aucune note ne correspond à votre recherche "${searchTerm}".`;
    }
    
    if (selectedCategory) {
      const category = this.notesService.categories().find(c => c.id === selectedCategory);
      return `Vous n'avez pas encore de notes dans la catégorie "${category?.name}".`;
    }
    
    return 'Créez votre première note pour commencer à organiser vos idées.';
  }

  trackByNoteId(index: number, note: Note): string {
    return note.id;
  }
}

bootstrapApplication(AppComponent);