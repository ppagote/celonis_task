import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { TaskStatus } from '../status';
import { TasksService } from './../tasks.service';
import { TaskObj } from '../create-tasks';
import { AppService } from './../app.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css'],
})
export class ListTasksComponent implements OnInit {
  title = 'List of tasks';
  linkUrl = undefined;
  tasks: TaskObj[] = [];
  create = false;
  taskStatus = TaskStatus;
  task: TaskObj;
  constructor(
    private appService: AppService,
    private taskService: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  showStatus(task: TaskObj) {
    this.taskService.changeTask(task);
  }

  getTasks() {
    this.appService.listTasks().subscribe(
      (taskList) => {
        this.tasks = taskList;
        console.log(this.tasks);
      },
      (error) => console.error('Error: ' + error)
    );
  }

  callDeleteService(task: TaskObj) {
    this.appService.deleteTask(task.id).subscribe(
      () => this.getTasks(),
      (error) => console.error('Error: ' + error)
    );
  }

  callCancelService(task: TaskObj) {
    this.appService.executeOrCancelTask(task, environment.cancel_api)
    .subscribe(
      () => this.getTasks(),
      (error) => console.error('Error: ' + error)
    );
  }

  createTask(name: string) {
    this.appService.createTask({ name } as TaskObj).subscribe((createdTask) => {
      console.log(createdTask);
      this.task = createdTask;
      // this.create = true;
      this.showStatus(this.task);
      // this.title = 'Task Wizard - Choose task type (2/4)';
     // this.linkUrl = '';
      this.router.navigate(['create-tasks/create']);
    });
  }
}
