import { Type } from '@angular/core';
import { Data, LoadChildren, ResolveData, Route, Routes, RunGuardsAndResolvers, UrlMatcher } from '@angular/router';
import { Action } from '@ngrx/store';
import { DamWidgetContainerComponent } from '../components/data-widget/dam-widget-container/dam-widget-container.component';
import { DamWidgetComponent } from '../components/data-widget/dam-widget/dam-widget.component';
import { DataLoaderGuard } from '../guards/data-loader.guard';
import { WidgetDeactivateGuard } from '../guards/widget-deactivate.guard';
import { WidgetSetupGuard } from '../guards/widget-setup.guard';

export interface IDamWidgetRoute {
  canActivate?: any[];
  canDeactivate?: any[];
  data?: Data;
}

export function DamWidgetRoute(
  data: {
    widgetId: string,
    routeParam?: string,
    loadAction: Type<Action>,
    successAction: string,
    failureAction: string,
    redirectTo: any[],
    component: Type<DamWidgetComponent>,
  },
  route?: IDamWidgetRoute): Route {
  return {
    data: {
      ...(route ? route.data : {}),
      ...data,
    },
    component: DamWidgetContainerComponent,
    canActivate: [
      WidgetSetupGuard,
      DataLoaderGuard,
      ...(route ? route.canActivate : []),
    ],
    canDeactivate: [
      WidgetDeactivateGuard,
      ...(route ? route.canDeactivate : []),
    ],
  };
}
