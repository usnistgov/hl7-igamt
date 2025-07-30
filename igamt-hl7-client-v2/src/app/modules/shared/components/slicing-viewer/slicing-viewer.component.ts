import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { IDisplayElement } from '../../models/display-element.interface';
import { ISlicing } from '../../models/slicing';
import { MatDialog } from '@angular/material';
import { SlicingViewerDialogComponent } from '../slicing-viewer-dialog/slicing-viewer-dialog.component';
import { IResource } from '../../models/resource.interface';
import { AResourceRepositoryService } from '../../services/resource-repository.service';
import { ElementNamingService } from '../../services/element-naming.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-slicing-viewer',
  templateUrl: './slicing-viewer.component.html',
  styleUrls: ['./slicing-viewer.component.css'],
})
export class SlicingViewerComponent implements OnInit {

  @Input()
  slicing: ISlicing;
  @Input()
  options: IDisplayElement[];
  @Input()
  resource: IResource;
  @Input()
  location: string;
  @Input()
  defaultFlavorId: string;
  @Input()
  repository: AResourceRepositoryService;

  constructor(
    private dialog: MatDialog,
    private elementNamingService: ElementNamingService,
  ) { }

  openSlicingViewerDialog(slicing: ISlicing) {
    this.elementNamingService.getPathInfoFromPathId(this.resource, this.repository, this.location).pipe(
      take(1),
      tap((pathInfo) => {
        this.dialog.open(SlicingViewerDialogComponent, {
          data: {
            slicing: slicing,
            options: this.options,
            elementName: this.elementNamingService.getStringNameFromPathInfo(pathInfo),
            defaultFlavorId: this.defaultFlavorId
          },
        });
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
