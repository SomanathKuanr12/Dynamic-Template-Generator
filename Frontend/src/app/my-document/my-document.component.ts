import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TemplateService } from '../Services/template.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-my-document',
  templateUrl: './my-document.component.html',
  styleUrls: ['./my-document.component.css']
})
export class MyDocumentComponent implements OnInit {
  files: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  successMessage = '';
  errMessage = '';
  isSubmitted = false;
  isPdf = false;
  currentUrlPath = '';
  
  selectedPdfUrl: any;
  filePath: any;



  constructor(
    private templateService: TemplateService,
    private route: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }



  viewPdf(url: string): void {
    this.isPdf = true;
    console.log(url);
    this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Set the selected PDF URL
  }

  onCloseView() {
    this.isPdf = false;
  }

  loadFiles(): void {
    const currentUserId = sessionStorage.getItem('userid');
    this.templateService.getDocument(currentUserId, this.searchTerm, this.currentPage, this.pageSize)
      .subscribe(
        (response) => {
          this.files = response.data;
          console.log(this.files);
          this.totalPages = response.totalPages;
        },
        (error: any) => {
          // Set error message
          this.errMessage = error.message;
          setTimeout(() => {
            this.errMessage = '';
          }, 1000);
          console.error('Get Document error:', error);
        }
      );
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFiles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadFiles();
    }
  }
 

  downloadType="pdf"
  onSelectDownload(fp:any) {
    this.http.get(fp, { responseType: 'blob' }).subscribe((fileBlob) => {
      const downloadUrl = window.URL.createObjectURL(fileBlob); // Create a URL for the blob
      const a = document.createElement('a'); // Create a download link
      a.href = downloadUrl;
      a.download = fp.split('/').pop() || 'downloaded-file.pdf'; // Use the file name from the path or a default name
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
    }, error => {
      console.error('PDF download error:', error);
      // Optionally, show an error message to the user
    });

}
}