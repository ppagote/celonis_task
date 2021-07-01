import { TaskObj } from './../create-tasks';
import { TasksService } from './../tasks.service';
import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.css'],
})
export class CreateTasksComponent implements OnInit {
  title = 'Task Wizard - Choose task type (2/4)';
  linkUrl = '';
  @Input() task: TaskObj;
  name: any = '';

  constructor(
    private taskService: TasksService,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.taskService.currentTask.subscribe((msg) => (this.task = msg));
    console.log(this.task);
    /* if (this.task == null) {
      this.appService
        .createTask({ this.name } as TaskObj)
        .subscribe((createdTask) => {
          console.log(createdTask);
          this.task = createdTask;
        });
    } */

    if (this.task != null) {
      sessionStorage.setItem('task', JSON.stringify(this.task));
    } else {
      this.task = JSON.parse(sessionStorage.getItem('task'));
    }
  }

  startCountTask() {
    this.taskService.changeTask(this.task);
  }
}
