import { Component } from '@angular/core';
import { TemplateService } from '../Services/template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrl: './upload-template.component.css'
})
export class UploadTemplateComponent {
  selectedFile: File | null = null;
  files: any[] = [];
   successMessage="";
   errMessage=""
  //currentUserId=sessionStorage.getItem('userid') ;
  constructor(private fileUploadService: TemplateService,private route:Router) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      const currentUserId = sessionStorage.getItem('userid');
      console.log(currentUserId);
  
      this.fileUploadService.upload(this.selectedFile, currentUserId).subscribe(
        (response: any) => {
          // Set success message
          this.successMessage = response.message;
  
          // Clear the success message and navigate after 1 second
          setTimeout(() => {
            this.successMessage = "";
            this.route.navigate(['/dashboard/template_list']);
          }, 1000);
        },
        (error: any) => {
          // Set error message
          this.errMessage = error.message;
  
          // Clear the error message after 1 second
          setTimeout(() => {
            this.errMessage = "";
          }, 1000);
  
          console.error('Upload error:', error);
        }
      );
    } else {
      // Set error message if no file is selected
      this.errMessage = "Please select a file";
  
      // Clear the error message after 1 second
      setTimeout(() => {
        this.errMessage = "";
      }, 1000);
    }
  }
  

  // loadFiles(): void {
  //   this.fileUploadService.getFiles().subscribe(files => {
  //     this.files = files;
  //   });
  // }

  // ngOnInit(): void {
  //   this.loadFiles();
  // }
}
