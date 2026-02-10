import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
//Servicio para manejar las operaciones relacionadas con las tareas, como obtener, crear, completar y eliminar tareas.
export class TaskService {
    private apiUrl = 'http://localhost:3000/api/tasks';

    constructor(private http:HttpClient) { }

    getAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task); 
    }

    completeTask(id: number): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}/complete`, {});
    }

    deleteTask(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}