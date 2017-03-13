import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2/angularfire2';
import { ReportConfig } from './report.config';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private templates: FirebaseListObservable<any>;
  private corpus = {
    topFreqs: [{word: 'w1', count: 10}, {word: 'w2', count: 9}],
    topIdFs: [{word: 'w1', idf: 0.4}, {word: 'w2', idf: 0.3}],
    articleStats: {
      longestArticle: { size: 6333, link: 'http://nilsnaegele.com'},
      shortestArticle: {size: 77, link: 'http://nilsnaegele.com'},
      averageSize: 549
    }
  };
  private general = {
    mainKeywords: 'MARS', corpusSize: '540', vocabularySize: '15000'
  };

  private items = [];

  constructor(angularFire: AngularFire) {
    this.templates = angularFire.database.list('/Report/templates');
   }

  ngOnInit() {
    this.templates.subscribe(data => { this.items = data; });
  }

  onSaveReportTemplate(report) {
    let key = report.$key;
    delete report.$key;
    delete report.$exists;
    this.templates.update(key, report);
  }

  onDeleteReportTemplate(report) {
    this.templates.remove(report.$key);
  }

  newReportTemplate() {
    this.templates.push(new ReportConfig('untitled123', false, false, false, 5, 6, false, false, false, false, false,
                                      {show: false, size: false, distance: false, url: false}, 0, 0));
  }

}
