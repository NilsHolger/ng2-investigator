import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { VisModule } from 'ng2-vis';

import 'node-cron';
import 'rxjs/Rx';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CollectorComponent } from './collector/collector.component';
import { RatingComponent } from './rating/rating.component';
import { NotifierComponent } from './notifier/notifier.component';
import { EvidenceComponent } from './evidence/evidence.component';
import { AiComponent } from './ai/ai.component';
import { ReportComponent } from './report/report.component';
import { ReportTemplateComponent } from './report/report-template.component';
import { ReportGeneralComponent } from './report/report-general.component';
import { ReportCorpusComponent } from './report/report-corpus.component';
import { AutopilotComponent } from './autopilot/autopilot.component';
import { AccuracyComponent } from './accuracy/accuracy.component';
import { ModalComponent } from './modal/modal.component';

import { CollectorService } from './collector/collector.service';
import { RatingService } from './rating/rating.service';
import { NotifierService } from './notifier/notifier.service';
import { EvidenceService } from './evidence/evidence.service';
import { AccuracyService } from './accuracy/accuracy.service';
import { RatingLogic } from './rating/rating.logic';

import { OrderByPipe } from './pipes/orderby.pipe';


export const firebaseConfig = {
        apiKey: "AIzaSyBN1zVUFMKTH90DYuSfkJSi4N1HTpoZrWI",
        authDomain: "ng2-investigator.firebaseapp.com",
        databaseURL: "https://ng2-investigator.firebaseio.com",
        storageBucket: "ng2-investigator.appspot.com",
        messagingSenderId: "112006120191"
};

export const googleSearchConfig = {
      apiKey: "AIzaSyCN0aDngAg2wjNbq6pzxUntKDjDgsE5ml4",
      cx: "004287087866899583493:81pzopc3zps"
};

export const timeSpans = [
      {"span": "d1", "sort": "date:d"},
      {"span": "w1", "sort": "date:a"},
      {"span": "m1", "sort": "date:a"},
      {"span": "m6", "sort": "date:a"},
      {"span": "y1", "sort": "date:a"},
      {"span": "y10", "sort": "date:a"},
];

export let Preventions = [];

export const articleRange = {min: 100, max: 10000}; //characters

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
    ReportTemplateComponent,
    ReportGeneralComponent,
    ReportCorpusComponent,
    AutopilotComponent,
    AccuracyComponent,
    OrderByPipe,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    VisModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, CollectorService,
    NotifierService, RatingService, EvidenceService, AccuracyService, RatingLogic],
  bootstrap: [AppComponent]
})
export class AppModule { }
