import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TemplateService } from '../Services/template.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  placeholdersValues: { [key: string]: string } = {};
  files: any[] = [];
  placeholders:any[]=[];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  successMessage="";
   errMessage=""
   isSubmitted=false
   isPdf=false
   currentFilePath=""
   
   selectedPdfUrl: any;

  @ViewChild('placeholderModal', { static: false }) placeholderModal!: ElementRef;

  constructor(private templateService: TemplateService,private route:Router,private sanitizer:DomSanitizer) {
     
    this.placeholders.forEach(placeholder => {
      
      const key = placeholder.replace(/{{|}}/g, '');
      this.placeholdersValues[key] = ''; // Initialize each key with an empty string
    });
  }

  ngOnInit(): void {
  
   
   
    this.loadFiles();
  }

  viewPdf(url: string): void {
    this.isPdf=true
    console.log(url);
    this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url); // Set the selected PDF URL
  }

  onCloseView(){
    this.isPdf=false
  }
  loadFiles(): void {
    const currentUserId = sessionStorage.getItem('userid');
    this.templateService.getFiles(currentUserId, this.searchTerm, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.files = response.data;
        console.log(this.files);
        
        this.totalPages = response.totalPages;
        
        
      },
      (error: any) => {
        // Set error message
        this.errMessage = error.message;

        // Clear the error message after 1 second
        setTimeout(() => {
          this.errMessage = '';
        }, 3000);

        console.error('fileLoad error:', error);
      });
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

 

  openModal(filepath: any): void {
    // Ensure modal instance is created every time the modal is opened
    const fp={fp:filepath}
    this.currentFilePath=filepath
    this.templateService.getPlaceholder(fp).subscribe(response => {
      console.log(response);
      
      this.placeholders = response.placeholders.map((pc: string) => pc.replace(/{{|}}/g, ''));
      console.log(this.placeholders);
    },
    (error: any) => {
      // Set error message
      this.errMessage = error.message;

      // Clear the error message after 1 second
      setTimeout(() => {
        this.errMessage = '';
      }, 3000);

      console.error('Placehoder load error:', error);
    });
    if (this.placeholderModal) {
      const modalInstance = new Modal(this.placeholderModal.nativeElement);
      modalInstance.show();  // Show the modal
    } else {
      console.error('Modal element is not found!');
    }
  }

  closeModal(): void {
    this.isSubmitted = false; // Reset the submitted status when the modal is closed
    this.successMessage = '';
    this.errMessage = ''; 
    if (this.placeholderModal) {
        const modalInstance = Modal.getInstance(this.placeholderModal.nativeElement);
        if (modalInstance) {
            modalInstance.hide(); // This hides the modal
        }
    }
}

formatPlaceholder(placeholder: string): string {
  // Remove {{ and }} if they exist
  placeholder = placeholder.replace(/{{|}}/g, '');
  
  // Split camel case and capitalize each word
  return placeholder
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case words
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

onSave() {
  this.isSubmitted = true;
 // console.log("placeholde"+this.placeholdersValues);
  let allValid=true
 for (const placeholder of this.placeholders) { 
  // Check if placeholder is in placeholderValues and has a non-empty, defined value
  //console.log();
  
  if (!this.placeholdersValues.hasOwnProperty(placeholder) || this.placeholdersValues[placeholder] === '' || this.placeholdersValues[placeholder] === undefined) {
    allValid = false;
    break;
  }
}
  console.log("validity "+allValid);
  
  if (allValid) {
    const userid=sessionStorage.getItem('userid');
    const data = {
      userid:userid,
      fp: this.currentFilePath,
      placeholder: this.placeholdersValues
    };
    console.log(data);
    
    this.templateService.replacePlaceholder(data)
      .subscribe(response => {
        console.log(response);
        this.viewPdf(response.urlpath);
        this.successMessage = response.message;

        // Clear the success message and navigate after 1 second
        setTimeout(() => {
          this.successMessage = '';
          this.closeModal();
        }, 3000);
      },
      (error: any) => {
        // Set error message
        this.errMessage = error.message;

        // Clear the error message after 1 second
        setTimeout(() => {
          this.errMessage = '';
        }, 3000);

        console.error('Upload error:', error);
      });
  } else {
    // Handle invalid form submission here
    this.errMessage = 'Please fill in all the fields.';
    setTimeout(() => {
      this.errMessage = '';
    }, 3000);
  }
}

isFieldInvalid(placeholder: string): boolean {
  return !this.placeholdersValues[placeholder];
}



}
