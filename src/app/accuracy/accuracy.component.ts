import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2/angularfire2';
import { AccuracyService } from './accuracy.service';
import { articleRange } from '../app.module';

@Component({
  selector: 'app-accuracy',
  templateUrl: './accuracy.component.html',
  styleUrls: ['./accuracy.component.css']
})
export class AccuracyComponent implements OnInit {
  private preventions = [];
  private cures: FirebaseListObservable<any>;
  private items;
  constructor(angularFire: AngularFire, accuracyService: AccuracyService) {
    this.cures = angularFire.database.list('/Accuracy/cures');
    this.preventions = accuracyService.getPreventions();
   }

  ngOnInit() {
    this.cures.subscribe(data => {
      this.items = data;
      console.log(data);
    })
  }

  newCure() {
    this.cures.push({ description: 'new cure'});
  }

  editCure(id, event) {
    this.cures.update(id, {description: event.target.outerText});
  }

  deleteCure(id) {
    this.cures.remove(id);
  }

}
