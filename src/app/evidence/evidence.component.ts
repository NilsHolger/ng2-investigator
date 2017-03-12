import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2/angularfire2';

import { ModalComponent } from '../modal/modal.component';
import { EvidenceService } from './evidence.service';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit {
  @ViewChild(ModalComponent) modal: ModalComponent;

  private angularFire;
  private evidenceService;
  private newsItems;
  private mainKeyword;
  private supportKeywords;
  private clusterKeywords;


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

  buildClusters() {
    const self = this;
    if (this.mainKeyword === undefined || this.clusterKeywords === undefined) { return; }
    this.evidenceService.clusterBuilder(this.mainKeyword, this.clusterKeywords).then(data => { console.log(data); });
    //.then(data => { self.modal.showModal(data[0]);});
  }


  buildCorpus() {
    //todo: get input keywords and fetch related articles/news
  }



}
