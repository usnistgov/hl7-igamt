import {Component,OnInit} from '@angular/core';
import {Car} from '../domain/car';
import {CarService} from '../service/carservice';
import {ConfirmationService} from 'primeng/primeng';

@Component({
    templateUrl: './overlaysdemo.html',
    providers: [ConfirmationService]
})
export class OverlaysDemo implements OnInit {
    
    cars: Car[];
    
    images: any[];
    
    display: boolean;
        
    constructor(private carService: CarService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.carService.getCarsSmall().then(cars => this.cars = cars.splice(0,5));
        
        this.images = [];
        this.images.push({source:'assets/demo/images/sopranos/sopranos1.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos1_small.jpg', title:'Nature 1'});
        this.images.push({source:'assets/demo/images/sopranos/sopranos2.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos2_small.jpg', title:'Nature 2'});
        this.images.push({source:'assets/demo/images/sopranos/sopranos3.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos3_small.jpg', title:'Nature 3'});
        this.images.push({source:'assets/demo/images/sopranos/sopranos4.jpg', thumbnail: 'assets/demo/images/sopranos/sopranos4_small.jpg', title:'Nature 4'});
    }
    
    confirm() {
        this.confirmationService.confirm({
            message: 'Are you sure to perform this action?'
        });
    }
}