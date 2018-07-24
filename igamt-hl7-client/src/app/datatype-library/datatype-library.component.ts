import {Component} from '@angular/core';
import {LocationStrategy} from '@angular/common';

@Component({
    templateUrl: './datatype-library.component.html'
})
export class DatatypeLibraryComponent {

  constructor(private location: LocationStrategy) {}

  exportToHtml() {
    window.open(this.prepareUrl('5b2184a8cc89678ae75feacf', 'html'));
  }

  exportToWord() {
    window.open(this.prepareUrl('5b2184a8cc89678ae75feacf', 'word'));
  }

  private prepareUrl(id: string, type: string): string {
    return this.location.prepareExternalUrl('api/datatypelibraries/' + id + '/export/' + type).replace('#', '');
  }
}
