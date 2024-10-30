import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../Services/template.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})
export class TemplateListComponent implements OnInit{
  files: any[] = [];
  constructor(private templateService: TemplateService) { }

    loadFiles(): void {
    this.templateService.getFiles().subscribe(files => {
      this.files = files;
    });
  }

  ngOnInit(): void {
    this.loadFiles();
  }
}
