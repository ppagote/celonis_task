import { environment } from './../../environments/environment';
import { AppService } from './../app.service';
import { TaskObj } from './../create-tasks';
import { TaskStatus } from '../status';
import { TasksService } from './../tasks.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

const inputNumberValidator: ValidatorFn = (formGroup: FormGroup) => {
  const x = formGroup.get('from').value;
  const y = formGroup.get('to').value;
  return x !== null && y !== null && x <= y ? null : { range: true };
};

@Component({
  selector: 'app-count-task',
  templateUrl: './count-task.component.html',
  styleUrls: ['./count-task.component.css'],
})
export class CountTaskComponent implements OnInit {
  title = 'Task Wizard - Choose task type (2/4)';

  formGroup: FormGroup;
  from: number;
  to: number;
  submitted = false;
  status: string;
  taskStatus = TaskStatus;
  task: TaskObj;
  initialFrom: number;
  linkUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TasksService,
    private appService: AppService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group(
      {
        from: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]*$'),
          ]),
        ],
        to: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      },
      {
        validator: inputNumberValidator,
      }
    );
  }

  ngOnInit(): void {
    this.taskService.currentTask.subscribe((msg) => (this.task = msg));
    console.log(this.task);
    if (this.task != null) {
      this.storeId();
    } else {
      this.task = JSON.parse(sessionStorage.getItem('id'));
      console.log('refresh');
    }

    this.to = this.task.toCount;
    this.initialFrom = this.task.fromCount;
    if (this.task.taskStatus === this.taskStatus.Executing.toString()) {
      this.getProgress(0);
    } else {
      this.status = this.task.taskStatus;
      this.from = this.task.fromCount;
      this.to = this.task.toCount;
      this.initialFrom = this.task.fromCount;
      if (this.from !== 0 && this.to !== 0) {
        this.formGroup.setValue({ from: this.from, to: this.to });
      }
    }
  }

  storeId() {
    sessionStorage.setItem('id', JSON.stringify(this.task));
  }

  get formGroupControl() {
    return this.formGroup.controls;
  }

  onSubmit(formData) {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.from = Number(formData.from);
      this.to = Number(formData.to);
      this.initialFrom = Number(formData.from);
      console.log(formData);
      this.task.fromCount = this.from;
      this.task.toCount = this.to;
      this.title = 'Task Wizard - Choose task type (3/4)';
      this.appService.updateTask(this.task).subscribe();
      this.storeId();
      this.status = 'confirm';
    }
  }

  onConfirmExecution() {
    this.status = this.taskStatus.Executing.toString();
    this.title = 'Task Wizard - Choose task type (3/4)';

    console.log(this.from, this.to);
    this.task.taskStatus = this.status;
    console.log(this.task);
    this.storeId();
    // API to fetch the incremented from value and the perform below check
    this.appService
      .executeOrCancelTask(this.task, environment.execute_api)
      .subscribe();

    this.getProgress(1000);

    // this.incrementCounter();
    console.log(this.status);
    console.log(this.from, this.to);
  }

  getProgress(start: number) {
    console.log(this.task);
    this.appService
      .getCounterProgress(this.task, start)
      .subscribe((userTask) => {
        console.log(userTask);
        this.task = userTask;
        this.storeId();

        console.log(this.from, this.to);
        if (this.from === this.to) {
          this.appService.ngOnDestroy();
          this.status = this.taskStatus.Finished.toString();
          this.initialFrom = this.task.fromCount;
        } else {
          this.from = this.task.updatedFromCount;
          this.status = this.taskStatus.Executing.toString();
        }
        // this.status = this.task.taskStatus;
      });
  }

  /* async incrementCounter() {
    for (let i = this.from; i < this.to; i++) {
      console.log(this.status);
      if (this.status !== this.taskStatus.Cancelled.toString()) {
        console.log('here' + i);
        await this.myFunction();
        this.from++;
        console.log(this.from, this.to);
      } else {
        break;
      }
    }
  }

  myFunction() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  } */

  onCancel() {
    this.appService.ngOnDestroy();
    this.title = 'Task Wizard - Choose task type (3/4)';

    // this.from = this.to;
    // API to stop the execution
    this.task.taskStatus = this.taskStatus.Cancelled.toString();
    console.log(this.task);
    this.appService.updateTask(this.task).subscribe((userTask) => {
      this.task = userTask;
      this.status = this.task.taskStatus;
      sessionStorage.removeItem(this.task.id);
      // this.status = this.taskStatus.Cancelled.toString()
      this.router.navigate(['']);
    });
  }
}
