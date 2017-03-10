import { Component } from '@angular/core';
import { CollectorService } from './collector.service';
import { AngularFire, FirebaseListObservable } from 'angularfire2/angularfire2';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrls: ['./collector.component.css']
})
export class CollectorComponent {
  caption = 'some news worth investigating';
  private headlines;
  private items: FirebaseListObservable<any>;

  constructor(collectorService: CollectorService, angularFire: AngularFire) {
      collectorService.getHeadlines().subscribe(data => {this.headlines = data;});

      this.items = angularFire.database.list('/Collector');
   }
   onChange(item, status) {
     this.items.push(item);
   }


}
