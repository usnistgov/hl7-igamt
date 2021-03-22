import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IConformanceProfileEditMetadata} from '../../conformance-profile/components/metadata-editor/metadata-editor.component';
import {Message} from '../../dam-framework/models/messages/message.class';
import {Usage} from '../../shared/constants/usage.enum';
import {IDocumentRef} from '../../shared/models/abstract-domain.interface';
import {IComment} from '../../shared/models/comment.interface';
import {IConformanceProfile} from '../../shared/models/conformance-profile.interface';
import {
  IProfileComponent,
  IProfileComponentContext,
  IProfileComponentItem,
  ItemProperty,
  PropertyCardinalityMax, PropertyCardinalityMin, PropertyComment,
  PropertyConfLength, PropertyDatatype,
  PropertyLengthMax,
  PropertyLengthMin,
  PropertyName, PropertySingleCode,
  PropertyUsage, PropertyValueSet,
} from '../../shared/models/profile.component';
import {IChange, PropertyType} from '../../shared/models/save-change';
import {IProfileComponentMetadata} from '../components/profile-component-metadata/profile-component-metadata.component';

@Injectable({
  providedIn: 'root',
})
export class ProfileComponentService {

  readonly URL = 'api/profile-component/';

  getById(id: string): Observable<IProfileComponent> {
    return this.http.get<IProfileComponent>(this.URL + id);
  }
  getChildById(pcId: string, id: string): Observable<IProfileComponentContext> {
   return this.http.get<IProfileComponentContext>(this.URL + pcId + '/context/' + id);
  }

  saveContext(pcId: string, context: IProfileComponentContext): Observable<IProfileComponentContext> {
    console.log(context);
    return this.http.post<IProfileComponentContext>(this.URL + pcId + '/context/' + context.id + '/update', context.profileComponentItems);
  }

  applyChange(change: IChange, profileComponentContext: IProfileComponentContext) {
    if (!profileComponentContext.profileComponentItems) {
      profileComponentContext.profileComponentItems = [];
    }
    this.applyPropertyChange(change, profileComponentContext.profileComponentItems);
  }
  applyProperty(item: ItemProperty, properties: ItemProperty[]) {
    let found = false;
    if (!properties) {
      properties = [];
    }
    for (const index in properties) {
      if (properties[index].propertyKey === item.propertyKey) {
        properties[index] = item;
        found = true;
        break;
      }
    }
    if (!found) {
      properties.push(item);
    }
  }

  applyPropertyChange(change: IChange, existing: IProfileComponentItem[]) {
    const item: ItemProperty = this.convertChangeToProfileComponentItem(change);
    console.log(item);
    let found = false;
    for (const index in existing) {
      if (existing[index].path === change.location) {
        this.applyProperty(item, existing[index].itemProperties);
        found = true;
        break;
      }
    }
    if (!found) {
      existing.push({ path: change.location, itemProperties: [item] });
    }
  }
  convertChangeToProfileComponentItem(change: IChange): ItemProperty {
    console.log(change);
    let itemProperty = {propertyKey: change.propertyType};
    switch (change.propertyType) {
      case PropertyType.USAGE:
        itemProperty = new PropertyUsage(change.propertyValue as Usage);
        break;
      case PropertyType.PREDICATE:
        console.log(change);
        break;
      case PropertyType.LENGTHMAX:
        itemProperty = new PropertyLengthMax(change.propertyValue as string);
        break;
      case PropertyType.LENGTHMIN:
        itemProperty = new PropertyLengthMin(change.propertyValue);
        break;
      case PropertyType.CONFLENGTH:
        itemProperty = new PropertyConfLength(change.propertyValue);
        break;
      case PropertyType.NAME:
        itemProperty = new PropertyName(change.propertyValue );
        break;
      case PropertyType.CONSTANTVALUE:
        itemProperty = new PropertyName(change.propertyValue);
        break;
      case PropertyType.CARDINALITYMAX:
        itemProperty = new PropertyCardinalityMax(change.propertyValue);
        break;
      case PropertyType.CARDINALITYMIN:
        itemProperty = new PropertyCardinalityMin(change.propertyValue);
        break;
      case PropertyType.COMMENT:
        itemProperty = new PropertyComment(change.propertyValue);
        break;
      case PropertyType.DATATYPE:
        itemProperty = new PropertyDatatype(change.propertyValue);
        break;
      case PropertyType.VALUESET:
        itemProperty = new PropertyValueSet(change.propertyValue);
        break;
    }
    return itemProperty;
  }
  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentRef.documentId,
      },
    });
  }

  profileComponentToMetadata(conformanceProfile: IProfileComponent): IProfileComponentMetadata {
    return {
      name: conformanceProfile.name,
      description: conformanceProfile.description,
      profileIdentifier:  conformanceProfile.preCoordinatedMessageIdentifier ? conformanceProfile.preCoordinatedMessageIdentifier : {},
    };
  }
  constructor(private http: HttpClient) { }
}
