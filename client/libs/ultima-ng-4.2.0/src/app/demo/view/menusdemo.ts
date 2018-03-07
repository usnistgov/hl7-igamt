import {Component,OnInit,ViewEncapsulation} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
    templateUrl: './menusdemo.html',
    styles: [`
        .ui-steps-item {
            width: 25%
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class MenusDemo implements OnInit {

    breadcrumbItems: MenuItem[];
    
    tieredItems: MenuItem[];
    
    items: MenuItem[];
    
    tabMenuItems: MenuItem[];
    
    megaMenuItems: MenuItem[];
    
    panelMenuItems: MenuItem[];
    
    stepsItems: MenuItem[];

    ngOnInit() {
        this.breadcrumbItems = [];
        this.breadcrumbItems.push({label:'Categories'});
        this.breadcrumbItems.push({label:'Sports'});
        this.breadcrumbItems.push({label:'Football'});
        this.breadcrumbItems.push({label:'Countries'});
        this.breadcrumbItems.push({label:'Spain'});
        this.breadcrumbItems.push({label:'F.C. Barcelona'});
        this.breadcrumbItems.push({label:'Squad'});
        this.breadcrumbItems.push({label:'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi'});
        
        this.tabMenuItems = [
            {label: 'Stats', icon: 'ui-icon-insert-chart'},
            {label: 'Calendar', icon: 'ui-icon-date-range'},
            {label: 'Documentation', icon: 'ui-icon-book'},
            {label: 'Support', icon: 'ui-icon-help-outline'},
            {label: 'Social', icon: 'ui-icon-public'}
        ];
        
        this.tieredItems = [
            {
                label: 'File',
                icon: 'ui-icon-folder',
                items: [{
                        label: 'New', 
                        icon: 'ui-icon-plus',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Edit',
                icon: 'ui-icon-edit',
                items: [
                    {label: 'Undo', icon: 'ui-icon-undo'},
                    {label: 'Redo', icon: 'ui-icon-redo'}
                ]
            },
            {
                label: 'Help',
                icon: 'ui-icon-help-outline',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'ui-icon-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'ui-icon-settings',
                items: [
                    {
                        label: 'Edit',
                        icon: 'ui-icon-refresh',
                        items: [
                            {label: 'Save', icon: 'ui-icon-save'},
                            {label: 'Update', icon: 'ui-icon-update'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'ui-icon-list',
                        items: [
                            {label: 'Delete', icon: 'ui-icon-delete'}
                        ]
                    }
                ]
            },
            {
                label: 'Quit', icon: 'ui-icon-power-settings-new'
            }
        ];
        
        this.items = [{
            label: 'File',
            items: [
                {label: 'New', icon: 'ui-icon-plus'},
                {label: 'Open', icon: 'ui-icon-open-in-browser'}
            ]
        },
        {
            label: 'Edit',
            items: [
                {label: 'Undo', icon: 'ui-icon-undo'},
                {label: 'Redo', icon: 'ui-icon-redo'}
            ]
        }];
        
        this.megaMenuItems = [
            {
                label: 'TV', icon: 'ui-icon-tv',
                items: [
                    [
                        {
                            label: 'TV 1',
                            items: [{label: 'TV 1.1'},{label: 'TV 1.2'}]
                        },
                        {
                            label: 'TV 2',
                            items: [{label: 'TV 2.1'},{label: 'TV 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'TV 3',
                            items: [{label: 'TV 3.1'},{label: 'TV 3.2'}]
                        },
                        {
                            label: 'TV 4',
                            items: [{label: 'TV 4.1'},{label: 'TV 4.2'}]
                        }    
                    ]
                ]
            },
            {
                label: 'Sports', icon: 'ui-icon-alarm',
                items: [
                    [
                        {
                            label: 'Sports 1',
                            items: [{label: 'Sports 1.1'},{label: 'Sports 1.2'}]
                        },
                        {
                            label: 'Sports 2',
                            items: [{label: 'Sports 2.1'},{label: 'Sports 2.2'}]
                        },

                    ],
                    [
                        {
                            label: 'Sports 3',
                            items: [{label: 'Sports 3.1'},{label: 'Sports 3.2'}]
                        },
                        {
                            label: 'Sports 4',
                            items: [{label: 'Sports 4.1'},{label: 'Sports 4.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Sports 5',
                            items: [{label: 'Sports 5.1'},{label: 'Sports 5.2'}]
                        },
                        {
                            label: 'Sports 6',
                            items: [{label: 'Sports 6.1'},{label: 'Sports 6.2'}]
                        }
                    ]
                ]
            },
            {
                label: 'Entertainment', icon: 'ui-icon-stars',
                items: [
                    [
                        {
                            label: 'Entertainment 1',
                            items: [{label: 'Entertainment 1.1'},{label: 'Entertainment 1.2'}]
                        },
                        {
                            label: 'Entertainment 2',
                            items: [{label: 'Entertainment 2.1'},{label: 'Entertainment 2.2'}]
                        }
                    ],
                    [
                        {
                            label: 'Entertainment 3',
                            items: [{label: 'Entertainment 3.1'},{label: 'Entertainment 3.2'}]
                        },
                        {
                            label: 'Entertainment 4',
                            items: [{label: 'Entertainment 4.1'},{label: 'Entertainment 4.2'}]
                        }    
                    ]
                ]
            },
            {
                label: 'Technology', icon: 'ui-icon-phone-android',
                items: [
                    [
                        {
                            label: 'Technology 1',
                            items: [{label: 'Technology 1.1'},{label: 'Technology 1.2'}]
                        },
                        {
                            label: 'Technology 2',
                            items: [{label: 'Technology 2.1'},{label: 'Technology 2.2'}]
                        },
                    ],
                    [
                        {
                            label: 'Technology 4',
                            items: [{label: 'Technology 3.1'},{label: 'Technology 3.2'}]
                        }  
                    ]
                ]
            }
        ];
        
        this.panelMenuItems = [
            {
                label: 'File',
                icon: 'ui-icon-insert-drive-file',
                items: [{
                        label: 'New', 
                        icon: 'ui-icon-add',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {label: 'Quit'}
                ]
            },
            {
                label: 'Edit',
                icon: 'ui-icon-edit',
                items: [
                    {label: 'Undo', icon: 'ui-icon-undo'},
                    {label: 'Redo', icon: 'ui-icon-redo'}
                ]
            },
            {
                label: 'Help',
                icon: 'ui-icon-help-outline',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'ui-icon-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'ui-icon-settings',
                items: [
                    {
                        label: 'Edit',
                        icon: 'ui-icon-edit',
                        items: [
                            {label: 'Save', icon: 'ui-icon-save'},
                            {label: 'Update', icon: 'ui-icon-update'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'ui-icon-phone-android',
                        items: [
                            {label: 'Delete', icon: 'ui-icon-delete'}
                        ]
                    }
                ]
            }
        ];
        
        this.stepsItems = [
            {
                label: 'Personal'
            },
            {
                label: 'Seat'
            },
            {
                label: 'Payment'
            },
            {
                label: 'Confirmation'
            }
        ];
    }

}