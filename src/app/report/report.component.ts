import { Component, OnInit } from '@angular/core';

import { ReportConfig } from './report.config';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private templates = [];
  constructor() { }

  ngOnInit() {
    this.templates.push(new ReportConfig('testABC.XYZ E2E', true, true, false, 5, 6, true, true, false, true, true,
                                      {show: true, size: true, distance: true, url: true}, 11, 22));
   console.log(this.templates[0]);
  }

}
