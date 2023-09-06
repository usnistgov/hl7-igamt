import { IContent } from './../../models/content.interface';
import { FroalaService } from 'src/app/modules/shared/services/froala.service';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ISectionTemplate, IgTemplate } from '../derive-dialog/derive-dialog.component';
import { Observable } from 'rxjs';
import { IgDocument } from 'src/app/modules/ig/models/ig/ig-document.class';
import { Type } from '../../constants/type.enum';

@Component({
  selector: 'app-upload-zip',
  templateUrl: './upload-zip.component.html',
  styleUrls: ['./upload-zip.component.scss']
})
export class UploadZipComponent implements OnInit {

  @ViewChild('tree') tree;
  froalaConfig$: Observable<any>;
  selectedFile: File | null = null;
  node: ISectionTemplate;
  ig: IgDocument;

  @ViewChild('fileInput') fileInput: any;

  selectedTemplate: ISectionTemplate[] = [];
  constructor(public dialogRef: MatDialogRef<UploadZipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private froalaService: FroalaService){
      this.ig = data.document;
      this.froalaConfig$ =  froalaService.getConfig();
    }

  ngOnInit() {
  }

  getPath(node) {
    if (this.isOrphan(node)) {
      return node.data.position;
    } else {
      return this.getPath(node.parent) + '.' + node.data.position;
    }
  }


  isOrphan(node: any) {
    return node && node.parent && !node.parent.parent;
  }
  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<ISectionTemplate[]>('/api/upload-narrative-zip', formData).subscribe(
      (response) => {
        this.selectedTemplate = this.orderByPosition(response);
        console.log('File uploaded sssss', response);
      },
      (error) => {
        console.error('Error uploading file', error);
      }
    );
  }


  orderByPosition(sections: ISectionTemplate[]): ISectionTemplate[] {
    return sections.sort((a, b) => a.position - b.position)
      .map(section => {
        if (section.children && section.children.length > 0) {
          section.children = this.orderByPosition(section.children);
        }
        return section;
      });
  }

  selectNode(node){
    console.log(node);
    this.node = node.data;
  }



  openFileInput() {
    // Trigger the hidden file input's click event
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    // Handle file selection logic
    console.log(event);
    this.selectedFile = event.target.files[0];
    // console.log('Selected file:', selectedFile);
  }

  removeSelectedFile() {
    this.selectedFile = undefined;
    this.fileInput.nativeElement.value = ''; // Clear the file input value
  }

  confirm(){

    let newContent: IContent[] = this.convertSectionsListToContentsList(this.selectedTemplate);

    let profile =  this.ig.content.find(content => content.type === Type.PROFILE);

    for( let content of  newContent){
      if(content.label  ==='Message Infrastructure'){
        content.children = profile.children;
        content.type = profile.type;
        content.id = profile.id;
      }
    }

    this.dialogRef.close(newContent);
  }

  mergeContent(){


  }

  mergeChildren(sectionChildren: ISectionTemplate[], contentChildren: IContent[]): IContent[] {
    const mergedChildren: IContent[] = [];



    return mergedChildren;
  }



   convertSectionToContent(section: ISectionTemplate): IContent {
    const content: IContent = {
      id: section.label,
      position: section.position,
      label: section.label,
      type: Type.TEXT,
      description: section.content,
      children: []
    };

    if (section.children && section.children.length > 0) {
      content.children = section.children.map(childSection => this.convertSectionToContent(childSection));
    }

    return content;
  }

  convertSectionsListToContentsList(sections: ISectionTemplate[]): IContent[] {
    return sections.map(section => this.convertSectionToContent(section));
  }




}
