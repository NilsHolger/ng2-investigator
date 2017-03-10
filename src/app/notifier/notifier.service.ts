import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CollectorService } from '../collector/collector.service';
import { RatingService } from '../rating/rating.service';
import { FirebaseListObservable, AngularFire } from 'angularfire2/angularfire2';

@Injectable()
export class NotifierService{
  private cron = require('node-cron');
  private collectorService;
  private ratingService;
  private angularFire;
  private task;
  private http;
  private threshold = [1, 5, 10];
  private items: FirebaseListObservable<any>;

  constructor(collectorService: CollectorService, ratingService: RatingService,
     angularFire: AngularFire, http: Http){
    this.http = http;
    this.collectorService = collectorService;
    this.ratingService = ratingService;
    this.angularFire = angularFire;

  }

  scheduler(notifier: string, threshold: string) {
    //if (this.task !== null) { this.task.stop();}
    const self = this;
    this.task = this.cron.schedule('* */12 * * *', function() {
      //self.collectRateNotify(notifier, threshold);
    });
  }

  collectRateNotify(notifier, threshold) {
    const self = this;
    let thresholdRank = this.thresholdToRank(threshold);
    this.items= this.angularFire.database.list('/Notifier/rated-news');
    this.collectorService.getHeadlines().subscribe(
      data => { data.forEach((item: any) => {
        let trendRank = self.ratingService.rl.rateTrends( item.title + item.description );
        let dateRank = self.ratingService.rl.rateDate(item.pubDate);
        let newsRank = trendRank + dateRank;
        if (newsRank > thresholdRank) {
          let ratedItem = {
            'title': item.title,
            'description': item.description?item.description:'',
            'rank': newsRank,
            'date': item.pubDate?item.pubDate:'',
            'link': item.link
          };
          self.items.push(ratedItem);
          if (notifier === 'email') { this.emailNotification(ratedItem);}
        }
      }
    )}
    )
  }
  thresholdToRank(threshold) {
      let rank = this.threshold[0];
      if (threshold === 'high rated') { rank = this.threshold[2]; }
      else if (threshold === 'medium rated') { rank = this.threshold[1]; }
      return rank;
  }
  emailNotification(ratedItem) {
    console.log('email sending ...');
    // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    // let options = new RequestOptions({headers: headers});
    // let body = `message=Hi,\n there is a new rated item in firebase database with following details:\n
    //   title: '+ ${ratedItem.title}\ndescription: ${ratedItem.description}\n
    //   rank: ${ratedItem.rank}\ndate: ${ratedItem.date}\n
    //   link: ${ratedItem.link}\n
    //   Please click on the link if you are interested to know more about this news item.`;
    //   this.http.post('http://localhost/mail.php', body, options).subscribe(res => {
    //   console.log('post result %o', res);})
  }
}
