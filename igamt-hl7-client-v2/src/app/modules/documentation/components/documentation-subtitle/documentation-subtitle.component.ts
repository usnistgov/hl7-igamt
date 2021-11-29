import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-documentation-subtitle',
  templateUrl: './documentation-subtitle.component.html',
  styleUrls: ['./documentation-subtitle.component.css'],
})
export class DocumentationSubtitleComponent implements OnInit {

  @Input()
  updateInfo: any;

  ngOnInit(): void {
  }

}
