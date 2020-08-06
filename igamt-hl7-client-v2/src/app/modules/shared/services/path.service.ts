import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IPath } from '../models/cs.interface';

@Injectable({
  providedIn: 'root',
})
export class PathService {

  constructor() { }

  getPathFromPathId(pathId: string): IPath {
    const elms = pathId.split('-');
    const pathOf = (list: string[]): IPath => {
      if (list && list.length > 0) {
        return {
          elementId: list[0],
          child: pathOf(list.slice(1)),
        };
      } else {
        return undefined;
      }
    };

    return pathOf(elms);
  }

  pathToString(path: IPath) {
    if (!path) {
      return '';
    } else {
      return path.elementId + (path.child ? '-' + this.pathToString(path.child) : '');
    }
  }

  concatOverlapPath(pre: IPath, post: IPath): IPath {
    // If there are no prefixes return postfix
    if (!pre) {
      return _.cloneDeep(post);
    }
    // If there are no postfixes return prefix
    if (!post) {
      return _.cloneDeep(pre);
    }

    const resultPath = _.cloneDeep(pre);
    const prefixLastChild = this.getLastChild(resultPath);

    // check overlap
    if (prefixLastChild.elementId === post.elementId) {
      prefixLastChild.child = _.cloneDeep(post.child);
      return resultPath;
    } else {
      throw new Error('Cannot concat paths');
    }
  }

  getLastChild(p: IPath): IPath {
    if (p.child) {
      return this.getLastChild(p.child);
    } else {
      return p;
    }
  }

  straightConcatPath(pre: IPath, post: IPath): IPath {
    // If there are no prefixes return postfix
    if (!pre) {
      return _.cloneDeep(post);
    }
    // If there are no postfixes return prefix
    if (!post) {
      return _.cloneDeep(pre);
    }

    const resultPath = _.cloneDeep(pre);
    const prefixLastChild = this.getLastChild(resultPath);
    prefixLastChild.child = _.cloneDeep(post);
    return resultPath;
  }

  trimPathRoot(path: IPath): IPath {
    if (path && path.child) {
      return path.child;
    } else {
      return path;
    }
  }
}
