import { TaskObj } from './create-tasks';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  // private createTaskSource = new Subject<string> ();
  private countTaskStatusSource = new BehaviorSubject(null);

  currentTask = this.countTaskStatusSource.asObservable();

  changeTask(task: TaskObj) {
    console.log(task);
    this.countTaskStatusSource.next(task);
  }

  constructor() {}
}
