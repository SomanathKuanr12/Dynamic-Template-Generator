import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { UploadTemplateComponent } from "../upload-template/upload-template.component";
import { TemplateListComponent } from "../template-list/template-list.component";
import { AuthGuard } from "../gaurds/auth.gaurd";
import { MyDocumentComponent } from "../my-document/my-document.component";
import { ResetPasswordComponent } from '../reset-password/reset-password.component';



const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'template_list',
        pathMatch: 'full'
      },
      {
        path: 'template_list',
        component: TemplateListComponent
      },
      {
        path: 'upload_template',
        component: UploadTemplateComponent
      },
      {
        path: 'my_document',
        component: MyDocumentComponent
      },
      {
        path: 'reset_password',
        component: ResetPasswordComponent
      }
    ]
  },
  {
    path: 'dashboard',
    redirectTo: '/dashboard/template_list',
    pathMatch: 'full'
  }
];




@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DashboardRoutingModule { }