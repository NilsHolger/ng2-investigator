import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-report-general',
  templateUrl: './report-general.html',
  styleUrls: ['./report-general.css']
})
export class ReportGeneralComponent {
  @Input() general: {};

  constructor() {}
  
}
