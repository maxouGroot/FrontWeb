import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  template: `
    <li style="display: flex; gap: 10px; align-items: center; margin-bottom: 5px;">

      <!-- Checkbox pour changer le statut -->
      <input type="checkbox" [checked]="todo.status === 'done'" (change)="toggleStatus()" />

      <!-- Nouvelle syntaxe @if / @else -->
      @if (!isEditing) {
        <!-- DIV : Mode lecture (Double clic pour éditer) -->
        <div
          (dblclick)="startEdit()"
          [style.text-decoration]="todo.status === 'done' ? 'line-through' : 'none'"
          style="flex-grow: 1; cursor: pointer;">
          {{ todo.title }}
        </div>
      } @else {
        <!-- INPUT : Mode édition -->
        <input
          #editInput
          type="text"
          [(ngModel)]="editValue"
          (keydown.enter)="saveEdit()"
          (blur)="saveEdit()"
          style="flex-grow: 1;"
        />
      }

      <!-- Bouton de suppression -->
      <button (click)="onDelete.emit(todo.id)">Supprimer</button>

    </li>
  `
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() onUpdate = new EventEmitter<Todo>();
  @Output() onDelete = new EventEmitter<number>();
  @ViewChild('editInput') editInput!: ElementRef;

  isEditing = false;
  editValue = '';

  startEdit() {
    this.isEditing = true;
    this.editValue = this.todo.title;
    setTimeout(() => this.editInput.nativeElement.focus(), 0);
  }

  saveEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      if (this.editValue.trim() !== '' && this.editValue !== this.todo.title) {
        this.onUpdate.emit({ ...this.todo, title: this.editValue });
      }
    }
  }

  toggleStatus() {
    const newStatus = this.todo.status === 'done' ? 'in progress' : 'done';
    this.onUpdate.emit({ ...this.todo, status: newStatus });
  }
}
