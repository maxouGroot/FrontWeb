import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  { path: 'todos/:filter', component: TodoListComponent },
  { path: '', redirectTo: 'todos/all', pathMatch: 'full' },
  { path: '**', redirectTo: 'todos/all' }
];
