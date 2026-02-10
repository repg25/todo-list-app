 export interface Task {
    id?: number;
    titulo: string;
    descripcion: string;
    created_at?: Date;
    completed_at?: Date;
    duracion_minutos?: number;
    is_completed: boolean;
 }