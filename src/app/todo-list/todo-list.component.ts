import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Ajout de ChangeDetectorRef
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, TodoItemComponent],
  template: `
    <div style="margin-top: 20px;">
      <input
        type="text"
        [(ngModel)]="newTodoTitle"
        (keydown.enter)="addTodo()"
        placeholder="Ajouter une tâche et appuyer sur Entrée..."
      />
    </div>

    <ul>
      @for (todo of filteredTodos; track todo.id) {
        <app-todo-item
          [todo]="todo"
          (onUpdate)="updateTodo($event)"
          (onDelete)="deleteTodo($event)">
        </app-todo-item>
      } @empty {
        <li>Aucune tâche pour le moment.</li>
      }
    </ul>
  `
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle: string = '';
  currentFilter: string = 'all';

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // 2. Injection dans le constructeur
  ) {}

  ngOnInit() {
    this.fetchTodos();

    this.route.params.subscribe(params => {
      this.currentFilter = params['filter'] || 'all';
      this.applyFilter();
    });
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe(data => {
      this.todos = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.currentFilter === 'done') {
      this.filteredTodos = this.todos.filter(t => t.status === 'done');
    } else if (this.currentFilter === 'in-progress') {
      this.filteredTodos = this.todos.filter(t => t.status === 'in progress');
    } else {
      this.filteredTodos = [...this.todos];
    }

    // 3. ON FORCE LA MISE À JOUR VISUELLE ICI
    this.cdr.detectChanges();
  }

  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle).subscribe(newTodo => {
        this.todos = [...this.todos, newTodo];
        this.newTodoTitle = '';
        this.applyFilter();
      });
    }
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo.id, updatedTodo).subscribe(() => {
      this.todos = this.todos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
      this.applyFilter();
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
      this.applyFilter();
    });
  }
}
