import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { CollectorComponent } from './collector/collector.component';
import { RatingComponent } from './rating/rating.component';
import { NotifierComponent } from './notifier/notifier.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { AiComponent } from './ai/ai.component';
import { ReportComponent } from './report/report.component';
import { AutopilotComponent } from './autopilot/autopilot.component';
import { AccuracyComponent } from './accuracy/accuracy.component';


const routes: Routes = [
  { path: '', redirectTo: 'collector', pathMatch: 'full' },
  { path: 'collector',  component: CollectorComponent },
  { path: 'rating', component: RatingComponent },
  { path: 'notifier',     component: NotifierComponent },
  { path: 'evidence',  component: EvidenceComponent },
  { path: 'ai', component: AiComponent },
  { path: 'report',     component: ReportComponent },
  { path: 'autopilot',  component: AutopilotComponent },
  { path: 'accuracy', component: AccuracyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
