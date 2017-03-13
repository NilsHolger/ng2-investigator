import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-corpus',
  templateUrl: './report-corpus.html',
  styleUrls: ['./report-corpus.css']
})
export class ReportCorpusComponent {
  @Input() corpus: {};
  constructor() {}
}
