import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- Imports cruciaux

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // <-- Il faut les déclarer ici pour que les boutons marchent
  template: `
    <h1>Mon Exam ToDo List</h1>

    <nav style="margin-bottom: 20px; display: flex; gap: 10px;">
      <!-- Grâce à RouterLink, ces boutons vont maintenant changer l'URL -->
      <button routerLink="/todos/all">All</button>
      <button routerLink="/todos/in-progress">In Progress</button>
      <button routerLink="/todos/done">Done</button>
    </nav>

    <!-- La liste s'affiche ici -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'frontend';
}
