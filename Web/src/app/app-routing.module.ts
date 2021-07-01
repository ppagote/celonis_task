import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  {
    path: 'create-tasks',
    loadChildren: () => import('./create-tasks/create-tasks.module').then(m => m.CreateTasksModule)
  },
  {
    path: 'count-tasks',
    loadChildren: () => import('./count-task/count-task.module').then(m => m.CountTaskModule)
  },
  {
    path: '',
    loadChildren: () => import('./list-tasks/list-tasks.module').then(m => m.ListTasksModule),
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
