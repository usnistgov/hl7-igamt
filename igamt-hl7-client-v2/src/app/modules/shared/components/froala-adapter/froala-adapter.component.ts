import { Component, OnInit } from '@angular/core';
import * as froala from '../../../../config/froala.json';

@Component({
  selector: 'app-froala-adapter',
  templateUrl: './froala-adapter.component.html',
  styleUrls: ['./froala-adapter.component.css'],
})
export class FroalaAdapterComponent implements OnInit {
  config;
  constructor() {
    this.config = {key: froala.key};
    this.config = {...  this.config,
      placeholderText: '',
      imageUploadURL: '/api/storage/upload',
      imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
      fileUploadURL: '/api/storage/upload',
      fileAllowedTypes: ['application/pdf', 'application/msword', 'application/x-pdf', 'text/plain', 'application/xml', 'text/xml'],
      charCounterCount: false,
      quickInsertTags: [''],
      immediateAngularModelUpdate: true,
      events: {
        'froalaEditor.image.beforeUpload': (images) => {
          console.log('Before upload');
          console.log(images);
        },
        'froalaEditor.image.uploaded': (response) => {
          console.log('froalaEditor.image.uploaded');
          console.log(response);
        },
        'froalaEditor.image.inserted': ($img, response) => {
          console.log('froalaEditor.image.inserted');
          console.log(response);
          console.log($img);
        },
        'froalaEditor.image.replaced': ($img, response) => {
          console.log('froalaEditor.image.replaced');
          console.log(response);
          console.log($img);
        },
        'froalaEditor.image.removed': ($img, obj1, obj2, obj3, obj4) => {
          console.log(obj2[0].src);
        },
        'image.error': (error, response) => {
          console.log(error);
          console.log(response);
        },
      },
      imageResize: true,
      pastePlain: true,
    };
  }

  ngOnInit() {
    console.log(froala.key);
  }

}
