import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentMetadataComponent } from './segment-metadata.component';
import {SegmentMetaDataRouting} from "./segment-metadata-routing.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,SegmentMetaDataRouting,FormsModule

],
  declarations: [SegmentMetadataComponent]
})
export class SegmentMetadataModule { }
