import { Component } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/angularfire2';
import { NotifierConfig } from './notifier.config';
import { NotifierService } from './notifier.service';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})
export class NotifierComponent {
      private notify = [true, false];
      private notifier = ['app', 'email'];
      private threshold = ['high rated', 'medium rated', 'low rated'];
      private model = new NotifierConfig(false, 'app', 'low rated');
      private ratedNews: FirebaseListObservable<any>;
      private notifierService: NotifierService;

      private config: FirebaseObjectObservable<any>;

      constructor(angularFire: AngularFire, notifierService: NotifierService) {
          this.config = angularFire.database.object('/Notifier/config', { preserveSnapshot: true});
          this.ratedNews = angularFire.database.list('Notifier/rated-news');
          this.notifierService = notifierService;
          this.updateUI();
       }

      updateUI() {
        this.config.subscribe(snapshot => {
          if (snapshot.exists()){
            this.model = {
              'notify': snapshot.val().notify,
              'notifier': snapshot.val().notifier,
              'threshold': snapshot.val().threshold
            };
          } else {
            this.config.set(this.model);
          }
          //todo schedule a cron job based on the values of the UI
          let notify = this.model.notify;
          let notifier = this.model.notifier;
          let threshold = this.model.threshold;
          if (notify === true) {
            this.notifierService.scheduler(notifier, threshold);
          }
        })
      }


      updateDB(value) {
          switch(value) {
            case true || false:
              this.model.notify = value;
              break;
            case 'email' || 'app':
              this.model.notifier = value;
             break;
            case 'high rated' || 'medium rated' || 'low rated':
              this.model.threshold = value;
            break;
          }
          this.config.update(this.model);
      }

}
