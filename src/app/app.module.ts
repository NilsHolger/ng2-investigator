import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import 'rxjs/Rx';
import 'node-cron';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CollectorComponent } from './collector/collector.component';
import { RatingComponent } from './rating/rating.component';
import { NotifierComponent } from './notifier/notifier.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { AiComponent } from './ai/ai.component';
import { ReportComponent } from './report/report.component';
import { AutopilotComponent } from './autopilot/autopilot.component';
import { AccuracyComponent } from './accuracy/accuracy.component';

import { CollectorService } from './collector/collector.service';
import { RatingService } from './rating/rating.service';
import { NotifierService } from './notifier/notifier.service';
import { EvidenceService } from './evidence/evidence.service';
import { RatingLogic } from './rating/rating.logic';

import { OrderByPipe } from './pipes/orderby.pipe';

export const firebaseConfig = {
        apiKey: "AIzaSyBN1zVUFMKTH90DYuSfkJSi4N1HTpoZrWI",
        authDomain: "ng2-investigator.firebaseapp.com",
        databaseURL: "https://ng2-investigator.firebaseio.com",
        storageBucket: "ng2-investigator.appspot.com",
        messagingSenderId: "112006120191"
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    CollectorComponent,
    RatingComponent,
    NotifierComponent,
    EvidenceComponent,
    AiComponent,
    ReportComponent,
    AutopilotComponent,
    AccuracyComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, CollectorService,
    NotifierService, RatingService, EvidenceService, RatingLogic],
  bootstrap: [AppComponent]
})
export class AppModule { }
