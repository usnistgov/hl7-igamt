import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import IndexedDbUtils from '../indexed-db-utils';
import {TocNode} from '../toc-database';

@Injectable()
export class DatatypesTocService {

  constructor(private indexeddbService: IndexedDbService) {}


  public getDatatype(id, callback) {
    let datatype;
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('r', this.indexeddbService.tocDataBase.datatypes, async () => {
        datatype = await this.indexeddbService.tocDataBase.datatypes.get(id);
        callback(datatype);
      });
    } else {
      callback(null);
    }
  }

  public addDatatype(datatype) {
    console.log(datatype);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        const savedDatatype = await this.indexeddbService.tocDataBase.datatypes.get(datatype.id);
        this.doSave(datatype, savedDatatype);
      });
    }
  }

  private doSave(datatype, savedDatatype) {
    savedDatatype = IndexedDbUtils.populateIObject(datatype, savedDatatype);
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        await this.indexeddbService.tocDataBase.datatypes.put(savedDatatype);
      });
    }
  }

  public bulkAdd(datatypes: Array<TocNode>) {
    if (this.indexeddbService.tocDataBase != null) {
      this.indexeddbService.tocDataBase.transaction('rw', this.indexeddbService.tocDataBase.datatypes, async () => {
        this.indexeddbService.tocDataBase.datatypes.bulkPut(datatypes).subscribe(success => {
          return true;
        }, error => {
          return false;
        });
      });
    }
  }
}
