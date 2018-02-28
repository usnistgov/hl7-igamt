import {Component,OnInit,OnDestroy} from '@angular/core';
import {CarService} from '../service/carservice';
import {NodeService} from '../service/nodeservice';
import {EventService} from '../service/eventservice';
import {Car} from '../domain/car';
import {TreeNode} from 'primeng/primeng';

@Component({
    templateUrl: './miscdemo.html'
})
export class MiscDemo implements OnInit,OnDestroy {
    
    images: any[];
    
    value: number = 0;
    
    interval: any;
    
    response: string;
    
    ngOnInit() {
        this.interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if(this.value >= 100) {
                this.value = 100;
                clearInterval(this.interval);
                this.interval = null;
            }
        }, 2000);
        
        this.images = [];
        this.images.push({source:'assets/demo/images/nature/nature1.jpg', alt:'Description for Image 1', title:'Title 1'});
        this.images.push({source:'assets/demo/images/nature/nature2.jpg', alt:'Description for Image 2', title:'Title 2'});
        this.images.push({source:'assets/demo/images/nature/nature3.jpg', alt:'Description for Image 3', title:'Title 3'});
        this.images.push({source:'assets/demo/images/nature/nature4.jpg', alt:'Description for Image 4', title:'Title 4'});
        this.images.push({source:'assets/demo/images/nature/nature5.jpg', alt:'Description for Image 5', title:'Title 5'});
        this.images.push({source:'assets/demo/images/nature/nature6.jpg', alt:'Description for Image 6', title:'Title 6'});
        this.images.push({source:'assets/demo/images/nature/nature7.jpg', alt:'Description for Image 7', title:'Title 7'});
        this.images.push({source:'assets/demo/images/nature/nature8.jpg', alt:'Description for Image 8', title:'Title 8'});
        this.images.push({source:'assets/demo/images/nature/nature9.jpg', alt:'Description for Image 9', title:'Title 9'});
        this.images.push({source:'assets/demo/images/nature/nature10.jpg', alt:'Description for Image 10', title:'Title 10'});
        this.images.push({source:'assets/demo/images/nature/nature11.jpg', alt:'Description for Image 11', title:'Title 11'});
        this.images.push({source:'assets/demo/images/nature/nature12.jpg', alt:'Description for Image 12', title:'Title 12'});
    }
    
    onCommand(event) {
        if(event.command === 'date')
            this.response = new Date().toDateString();
        else
            this.response = 'Unknown command: ' + event.command;
    }
    
    ngOnDestroy() {
        if(this.interval) {
            clearInterval(this.interval);
        }
    }
}