import { Component, Input } from '@angular/core';
import { ReportConfig } from './report.config';

@Component({
  selector: 'app-report-template',
  templateUrl: './report-template.html'
})
export class ReportTemplateComponent {
  @Input('template') model: ReportConfig;
}
