import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { titulo: '', descripcion: '', is_completed: false };
  isLoading = false;
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  //Funcion para cargar las tareas desde el backend
  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Suscribirse al observable para obtener las tareas y manejar errores
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.errorMessage = 'Error al cargar las tareas. Verifica que el servidor esté corriendo.';
        this.isLoading = false;
      }
    });
  }

  //Funcion para agregar una nueva tarea, con validacion de titulo no vacio
  addTask() {
    if (this.newTask.titulo.trim() === '') {
      this.errorMessage = 'El título de la tarea no puede estar vacío.';
      return;
    }
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.newTask = { titulo: '', descripcion: '', is_completed: false };
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error al crear tarea:', error);
          this.errorMessage = 'Error al crear la tarea.';
        }
      });
    }

  //Funcion para marcar una tarea como completada
  completeTask(id: number | undefined) {
    if (id) {
      this.taskService.completeTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error al completar tarea:', error);
          this.errorMessage = 'Error al completar la tarea.';
        }
      });
    }
  }

  //Funcion para eliminar una tarea, con confirmacion 
  deleteTask(id: number | undefined) {
    if (id && confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
          this.errorMessage = 'Error al eliminar la tarea.';
        }
      });
    }
  }

  // Funcion para formatear la duracion de la tarea en hrs/min
  formatDuration(minutes: number | undefined): string {
    if (!minutes) return '-';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}