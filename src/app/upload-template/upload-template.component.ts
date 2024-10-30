import { Component } from '@angular/core';
import { TemplateService } from '../Services/template.service';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrl: './upload-template.component.css'
})
export class UploadTemplateComponent {
  selectedFile: File | null = null;
  files: any[] = [];
  currentUserId=localStorage.getItem('userId') ;
  constructor(private fileUploadService: TemplateService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.fileUploadService.upload(this.selectedFile,this.currentUserId).subscribe((response: any) => {
        console.log('Upload success:', response);
        //this.loadFiles();
      }, (error: any) => {
        console.error('Upload error:', error);
      });
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
