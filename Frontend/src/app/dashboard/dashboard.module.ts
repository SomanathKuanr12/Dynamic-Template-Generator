import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TemplateListComponent } from '../template-list/template-list.component';
import { UploadTemplateComponent } from '../upload-template/upload-template.component';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SafeUrlPipe } from '../safe-url.pipe';
import { MyDocumentComponent } from '../my-document/my-document.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../gaurds/auth.gaurd';


@NgModule({
  declarations: [
    TemplateListComponent,
    UploadTemplateComponent,
    SafeUrlPipe,
    MyDocumentComponent,
    ResetPasswordComponent,
    DashboardComponent,
   
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxExtendedPdfViewerModule
  ],
 providers:[AuthGuard]
})
export class DashboardModule { }