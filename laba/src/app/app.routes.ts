import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { canActivateAuth } from './shared/guards/access.guard';
export const routes: Routes = [
        { path: '', redirectTo: 'index', pathMatch: 'full' },
        { path: 'index', component: IndexPageComponent },
        { path: 'profile', component: ProfileComponent,  canActivate: [canActivateAuth] },
        { path: 'error', component: ErrorPageComponent },      
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  
  export class SystemRoutingModule { }


  