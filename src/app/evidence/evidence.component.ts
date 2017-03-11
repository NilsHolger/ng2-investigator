import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2/angularfire2';
import { EvidenceService } from './evidence.service';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit {
  private angularFire;
  private evidenceService;
  private newsItems;

  evidence = [
    { word : 'w1', count: 1},
    { word : 'w2', count: 2},
    { word : 'w3', count: 3}
  ];

  constructor(angularFire: AngularFire,  evidenceService: EvidenceService) {
        this.angularFire = angularFire;
        this.evidenceService = evidenceService;
   }

  ngOnInit() {
    this.angularFire.database.list('/Notifier/rated-news', {
      query: {
        orderByChild : 'rank',
        limitToLast : 1 //fetch 1 item for now
      }
    }).subscribe(item => {
      this.evidenceService.wordAnalyzer(item[0].link);
    });
  }



}
