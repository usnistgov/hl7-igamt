import {Injectable} from '@angular/core';
import {IndexedDbService} from '../indexed-db.service';
import {Section} from '../objects-database';

@Injectable()
export class SectionsIndexedDbService {

  constructor(private indexeddbService: IndexedDbService) {
  }

  public getSection(id): Promise<Section> {
    return new Promise<Section>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.transaction('r', this.indexeddbService.changedObjectsDatabase.sections, async () => {
          const section = await this.indexeddbService.changedObjectsDatabase.sections.get(id);
          if (section != null) {
            resolve(section);
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  }



  public saveSection(section: Section): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.sections.put(section).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        reject();
      }
    });
  }



  public getByChangeType(type: string): Promise<Array<Section>> {
    return this.indexeddbService.changedObjectsDatabase.sections.where('changeType').equals(type).toArray();
  }

  public updateDnD(id,section,dnd){
    return new Promise<any>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.sections.update(id,{dnd:dnd}).then(res => {
          if(res){
            resolve();
          }else{

           this.saveNew(id,section,dnd, resolve, reject);

          }
        }).catch((error) => {
          this.saveNew(id,section,dnd, resolve, reject);

        });
      } else {
        reject();
      }
    });

  }

  public updateContent(id,section,dnd){
    return new Promise<any>((resolve, reject) => {
      if (this.indexeddbService.changedObjectsDatabase != null) {
        this.indexeddbService.changedObjectsDatabase.sections.update(id,{section:section}).then(res => {
          if(res){
            resolve();
          }else{

            this.saveNew(id,section,dnd, resolve, reject);

          }
        }).catch((error) => {
          this.saveNew(id,section,dnd, resolve, reject);

        });
      } else {
        reject();
      }
    });

  }

  public getAll(): Promise<any> {
    return this.indexeddbService.changedObjectsDatabase.sections.toArray();
  }

  private saveNew(id,section,dnd, resolve, reject){

    let s = new Section();
    s.section=section;
    s.dnd=dnd;
    s.id=id;

    this.indexeddbService.changedObjectsDatabase.sections.put(s).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }

}
