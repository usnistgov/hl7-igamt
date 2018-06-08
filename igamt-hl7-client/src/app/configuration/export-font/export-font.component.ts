import { Component, OnInit } from '@angular/core';
import {ExportFontService} from '../../service/configuration/export-font/export-font.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-export-font',
  templateUrl: './export-font.component.html',
  styleUrls: ['./export-font.component.css']
})
export class ExportFontComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location, private exportFontService: ExportFontService) {
    this.changed = false;
  }

  exportFontConfigurationDisplay: Object;
  changed: boolean;

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.exportFontConfigurationDisplay = data.exportFontConfigurationDisplay;
      });
  }

  save() {
    this.exportFontService.saveExportFont(this.exportFontConfigurationDisplay).then(() => {
      console.log('saved successfully');
    }).catch(error => {
      console.log('unable to save table options: ' + error);
    });
  }

  setChanged() {
    this.changed = true;
  }

  goBack(): void {
    this.location.back();
  }

}
