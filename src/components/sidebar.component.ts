import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../models/note.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sidebar" [class.open]="isOpen">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <span>Notes App</span>
        </div>
        <button 
          class="btn-toggle"
          (click)="toggleSidebar()"
          [class.hide-on-desktop]="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div class="sidebar-content">
        <button class="btn-new-note" (click)="onNewNote()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Nouvelle note
        </button>

        <div class="search-section">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange($event)">
          </div>
        </div>

        <div class="categories-section">
          <h3 class="section-title">Catégories</h3>
          <div class="category-list">
            <button 
              class="category-item"
              [class.active]="selectedCategory === ''"
              (click)="onCategorySelect('')">
              <div class="category-info">
                <span class="category-dot all-categories"></span>
                <span class="category-name">Toutes</span>
              </div>
              <span class="category-count">{{ totalNotes }}</span>
            </button>
            
            <button 
              *ngFor="let category of categories"
              class="category-item"
              [class.active]="selectedCategory === category.id"
              (click)="onCategorySelect(category.id)">
              <div class="category-info">
                <span 
                  class="category-dot"
                  [style.background-color]="category.color"></span>
                <span class="category-name">{{ category.name }}</span>
              </div>
              <span class="category-count">{{ getCategoryCount(category.id) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div 
      class="sidebar-overlay"
      [class.visible]="isOpen"
      (click)="closeSidebar()">
    </div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: -280px;
      top: 0;
      width: 280px;
      height: 100vh;
      background: white;
      border-right: 1px solid #E5E7EB;
      transition: left 0.3s ease;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .sidebar.open {
      left: 0;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1F2937;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .btn-toggle {
      width: 36px;
      height: 36px;
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

    .btn-toggle:hover {
      background: #E5E7EB;
    }

    .sidebar-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }

    .btn-new-note {
      width: 100%;
      padding: 14px 16px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
      transition: all 0.2s ease;
    }

    .btn-new-note:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .search-section {
      margin-bottom: 32px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box svg {
      position: absolute;
      left: 12px;
      color: #9CA3AF;
      z-index: 1;
    }

    .search-box input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #D1D5DB;
      border-radius: 10px;
      font-size: 0.875rem;
      background: #F9FAFB;
      transition: all 0.2s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: #3B82F6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .categories-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-item {
      width: 100%;
      padding: 12px 16px;
      border: none;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
      color: #6B7280;
    }

    .category-item:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .category-item.active {
      background: #EBF5FF;
      color: #1D4ED8;
      font-weight: 500;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: block;
    }

    .category-dot.all-categories {
      background: linear-gradient(135deg, #3B82F6, #10B981);
    }

    .category-name {
      font-size: 0.875rem;
    }

    .category-count {
      font-size: 0.75rem;
      background: #E5E7EB;
      color: #6B7280;
      padding: 2px 6px;
      border-radius: 4px;
      min-width: 20px;
      text-align: center;
    }

    .category-item.active .category-count {
      background: #DBEAFE;
      color: #1D4ED8;
    }

    @media (min-width: 1024px) {
      .sidebar {
        position: static;
        left: 0;
        border-right: 1px solid #E5E7EB;
      }
      
      .sidebar-overlay {
        display: none;
      }
      
      .btn-toggle.hide-on-desktop {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() categories: Category[] = [];
  @Input() selectedCategory = '';
  @Input() searchTerm = '';
  @Input() totalNotes = 0;
  @Input() categoryCounts: Record<string, number> = {};
  
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() closeSidebarEvent = new EventEmitter<void>();
  @Output() newNote = new EventEmitter<void>();
  @Output() categorySelect = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  closeSidebar(): void {
    this.closeSidebarEvent.emit();
  }

  onNewNote(): void {
    this.newNote.emit();
  }

  onCategorySelect(categoryId: string): void {
    this.categorySelect.emit(categoryId);
  }

  onSearchChange(term: string): void {
    this.searchChange.emit(term);
  }

  getCategoryCount(categoryId: string): number {
    return this.categoryCounts[categoryId] || 0;
  }
}