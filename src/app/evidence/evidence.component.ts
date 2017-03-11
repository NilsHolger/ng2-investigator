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
  private supportKeywords;
  private mainKeyword;

  constructor(angularFire: AngularFire,  evidenceService: EvidenceService) {
        this.angularFire = angularFire;
        this.evidenceService = evidenceService;
   }

  ngOnInit() {
    this.angularFire.database.list('/Notifier/rated-news', {
      query: {
        orderByChild : 'rank',
        limitToFirst : 5 //fetch 5 items
      }
    }).subscribe(data => {
      this.newsItems = data;
    });
  }

  onSelect(item, isRadio) {
    let url = isRadio ? item.link : item;
    this.evidenceService.wordAnalyzer(url);
  }

  onIDFs() {
    this.evidenceService.saveIDFs(this.mainKeyword);
  }


  buildCorpus() {
    //todo: get input keywords and fetch related articles/news
  }



}
