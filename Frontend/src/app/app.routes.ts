import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/authguard-guard';
import { managerGuard } from './guards/managerguard-guard';
import { DashboardComponent } from './manager/dashboard/dashboard';
import { ProjectsComponent } from './manager/projects/projects';
import { CreateProjectComponent } from './manager/create-project/create-project';
import { TasksComponent } from './manager/tasks/tasks';
import { KanbanComponent } from './manager/kanban/kanban';
import { CreateTaskComponent } from './manager/create-task/create-task';
import { developerGuard } from './guards/developerguard-guard';
import { MyTasksComponent } from './developer/my-tasks/my-tasks';
import { TaskDetailComponent } from './developer/task-detail/task-detail';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // Manager routes
  {
    path: 'manager',
    canActivate: [authGuard, managerGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'create-project', component: CreateProjectComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'create-task', component: CreateTaskComponent },
      { path: 'kanban/:id', component: KanbanComponent },
    ],
  },

  // Developer routes
  {
    path: 'developer',
    canActivate: [authGuard, developerGuard],
    children: [
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'task-detail/:id', component: TaskDetailComponent },
    ],
  },

  // Any unknown route → redirect to login
  { path: '**', redirectTo: 'login' },
];
