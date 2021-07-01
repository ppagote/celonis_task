import { TasksService } from './tasks.service';
import { AppService } from './app.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { CountTaskComponent } from './count-task/count-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CreateTasksComponent,
    ListTasksComponent,
    CountTaskComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AppService,
    TasksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
