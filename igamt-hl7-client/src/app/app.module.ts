import { NgModule } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {AlertModule} from "ngx-bootstrap";
import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OrganizationChartModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';

import {KeyFilterModule} from 'primeng/keyfilter';
import {MessageModule} from 'primeng/message';

// import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy, CommonModule,APP_BASE_HREF} from '@angular/common';
import { DocumentationComponent } from './documentation/documentation.component';
import {WorkspaceService} from "./service/workspace/workspace.service";
import {IgDocumentService} from './service/ig-document/ig-document.service';
import {IndexedDbService} from './service/indexed-db/indexed-db.service';
import {ConformanceProfilesIndexedDbService} from './service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service';
import {SegmentsIndexedDbService} from './service/indexed-db/segments/segments-indexed-db.service';
import {DatatypesIndexedDbService} from './service/indexed-db/datatypes/datatypes-indexed-db.service';
import {ValuesetsIndexedDbService} from './service/indexed-db/valuesets/valuesets-indexed-db.service';
import {ValuesetsService} from './service/valuesets/valuesets.service';
import {AppRoutes} from './app.routes';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {GeneralConfigurationService} from "./service/general-configuration/general-configuration.service";
import {SegmentsService} from './service/segments/segments.service';
import {DatatypesService} from './service/datatypes/datatypes.service';
import {ConformanceProfilesService} from './service/conformance-profiles/conformance-profiles.service';
// import {ProfileComponentsService} from "./service/profilecomponents/profilecomponents.service";
import {AuthService} from "./login/auth.service";
import {AuthGuard} from "./login/auth-guard.service";
import {HttpClientModule} from "@angular/common/http";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./requestInterceptor";
import {UserService} from "./service/userService/user.service";
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {NotFoundComponent} from "./common/404/404.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import { TreeModule } from 'angular-tree-component';
import {AppBreadcrumbComponent} from "./app.breadcrumb.component";
import {BreadcrumbService} from "./breadcrumb.service";
import {ConformanceProfilesTocService} from "./service/indexed-db/conformance-profiles/conformance-profiles-toc.service";
import {TocDbService} from "./service/indexed-db/toc-db.service";
import {CompositeProfilesTocService} from "./service/indexed-db/composite-profiles/composite-profiles-toc.service";
import {DatatypesTocService} from "./service/indexed-db/datatypes/datatypes-toc.service";
import {SegmentsTocService} from "./service/indexed-db/segments/segments-toc.service";
import {ValuesetsTocService} from "./service/indexed-db/valuesets/valuesets-toc.service";
import {ProfileComponentsTocService} from "./service/indexed-db/profile-components/profile-components-toc.service";

import {ConstraintsService} from './service/constraints/constraints.service';
import {SectionsService} from "./service/sections/sections.service";
import {SectionsIndexedDbService} from "./service/indexed-db/sections/sections-indexed-db.service";

@NgModule({
    imports: [
        BrowserModule,
        TreeModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        KeyFilterModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MessageModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeTableModule,
        CommonModule,
        ReactiveFormsModule,

        AlertModule.forRoot()

    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppComponent,
        HomeComponent,
        AboutComponent,
        DocumentationComponent,
        AppMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        NotFoundComponent,
        LoginComponent,
        RegisterComponent,
        DocumentationComponent,
      AppBreadcrumbComponent
    ], providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    // { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' },
    // {
    //   provide: APP_BASE_HREF,
    //   useValue: '<%= APP_BASE %>'
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
     WorkspaceService,
    GeneralConfigurationService,
    IgDocumentService,
    IndexedDbService,
        ConformanceProfilesIndexedDbService,
     SegmentsIndexedDbService,
    DatatypesIndexedDbService,
    ValuesetsIndexedDbService,
    SectionsIndexedDbService,
    ProfileComponentsTocService,
    TocDbService,
    DatatypesTocService,
    SegmentsTocService,
    ValuesetsTocService,
    DatatypesService,
        ConformanceProfilesService,
    ConformanceProfilesTocService,
    CompositeProfilesTocService,
    SegmentsService,
    SectionsService,
    AuthService,
    AuthGuard,
    UserService,
    BreadcrumbService,

        ConstraintsService
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
