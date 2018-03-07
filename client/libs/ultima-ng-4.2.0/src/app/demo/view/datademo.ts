import {Component,OnInit,ViewEncapsulation} from '@angular/core';
import {CarService} from '../service/carservice';
import {NodeService} from '../service/nodeservice';
import {EventService} from '../service/eventservice';
import {Car} from '../domain/car';
import {TreeNode} from 'primeng/primeng';

@Component({
    templateUrl: './datademo.html',
    styles: [`                
        .cars-datalist ul {
            margin: 0;
            padding: 0;
        }
    
        @media (max-width:640px) {
            .cars-datalist .text-column {
                text-align: center;
            }
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class DataDemo implements OnInit {

    cars1: Car[];
    
    cars2: Car[];
    
    cars3: Car[];
    
    data: TreeNode[];
    
    selectedNode1: TreeNode;
    
    selectedCar: Car;
    
    sourceCars: Car[];
    
    targetCars: Car[];
    
    orderListCars: Car[];
    
    carouselCars: Car[];
    
    files1: TreeNode[];
    
    files2: TreeNode[];
    
    events: any[];
    
    selectedNode: TreeNode;
        
    scheduleHeader: any;

    constructor(private carService: CarService, private eventService: EventService, private nodeService: NodeService) { }
    
    ngOnInit() {
        this.carService.getCarsMedium().then(cars => this.cars1 = cars);
        this.carService.getCarsMedium().then(cars => this.cars2 = cars);
        this.carService.getCarsMedium().then(cars => this.cars3 = cars);
        this.carService.getCarsMedium().then(cars => this.sourceCars = cars);
        this.targetCars = [];
        this.carService.getCarsSmall().then(cars => this.orderListCars = cars);
        this.nodeService.getFilesystem().then(files => this.files1 = files);
        this.nodeService.getFiles().then(files => this.files2 = files);
        this.eventService.getEvents().then(events => {this.events = events;});
        
        this.carouselCars = [
            {vin: 'r3278r2', year: 2010, brand: 'Audi', color: 'Black'},
            {vin: 'jhto2g2', year: 2015, brand: 'BMW', color: 'White'},
            {vin: 'h453w54', year: 2012, brand: 'Honda', color: 'Blue'},
            {vin: 'g43gwwg', year: 1998, brand: 'Renault', color: 'White'},
            {vin: 'gf45wg5', year: 2011, brand: 'VW', color: 'Red'},
            {vin: 'bhv5y5w', year: 2015, brand: 'Jaguar', color: 'Blue'},
            {vin: 'ybw5fsd', year: 2012, brand: 'Ford', color: 'Yellow'},
            {vin: '45665e5', year: 2011, brand: 'Mercedes', color: 'Brown'},
            {vin: 'he6sb5v', year: 2015, brand: 'Ford', color: 'Black'}
        ];
        
        this.scheduleHeader = {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		};
        
        this.data = [{
            label: 'F.C Barcelona',
            expanded: true,
            children: [
                {
                    label: 'F.C Barcelona',
                    expanded: true,
                    children: [
                        {
                            label: 'Chelsea FC'
                        },
                        {
                            label: 'F.C. Barcelona'
                        }
                    ]
                },
                {
                    label: 'Real Madrid',
                    expanded: true,
                    children: [
                        {
                            label: 'Bayern Munich'
                        },
                        {
                            label: 'Real Madrid'
                        }
                    ]
                }
            ]
        }];
    }
}