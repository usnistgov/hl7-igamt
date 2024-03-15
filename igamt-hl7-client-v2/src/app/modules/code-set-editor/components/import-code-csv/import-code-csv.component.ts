import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-code-csv',
  templateUrl: './import-code-csv.component.html',
  styleUrls: ['./import-code-csv.component.css']
})
export class ImportCodeCSVComponent implements OnInit {

  constructor( private http:  HttpClient ) { }

  ngOnInit() {
  }

  upload( file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post('api/code-sets/importCSV/' + id, formData);
  }

  uploadFile(files: FileList) {
    if (files.length === 0)
      return;

    const fileToUpload = files.item(0);
    this.upload(fileToUpload).subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }


}
