import { ListTasksComponent } from './list-tasks.component';
import { ListTasksModule } from './list-tasks.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ListTasksComponent,
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTasksRoutingModule { }
