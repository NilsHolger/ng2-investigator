import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2/angularfire2';
import { VisNetworkService } from 'ng2-vis/components/network';
import { ModalComponent } from '../modal/modal.component';
import { EvidenceService } from './evidence.service';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit {
  @ViewChild(ModalComponent) modal: ModalComponent;
  public visNetworkService: VisNetworkService;
  private angularFire;
  private evidenceService;
  private network: FirebaseObjectObservable<any>;
  private newsItems;
  private mainKeyword;
  private supportKeywords;
  private clusterKeywords;


  constructor(angularFire: AngularFire,  evidenceService: EvidenceService, vns: VisNetworkService) {
        this.angularFire = angularFire;
        this.evidenceService = evidenceService;
        this.network = angularFire.database.object('Evidence/Corpus/network-graph');
        this.visNetworkService = vns;
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
    this.evidenceService.clusterBuilder(this.mainKeyword, this.clusterKeywords).then(data => {
      setTimeout(() => {
           self.network.set(data[0]);
           self.modal.showModal(data[0]);
      }, 25000);
      //this.visNetworkService.setData("networkId1", data);
     });
  }


  buildCorpus() {
    //todo: get input keywords and fetch related articles/news
  }



}
