import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2/angularfire2';
import { RatingLogic } from './rating.logic';

@Injectable()
export class RatingService {
  private news: FirebaseListObservable<any>;
  private ratingLogic;
  private trends;
  protected numberOfTrends = 20;

  constructor( angularFire: AngularFire, ratingLogic: RatingLogic ) {
              this.news = angularFire.database.list('/Collector');
              this.ratingLogic = ratingLogic;
              this.trends= ratingLogic.getTrends(this.numberOfTrends);
            }

  getNews() { return this.news; }

  getTrends() { return this.trends; }

  rateNews() {
    let news = [];
    var self = this;
    this.news.subscribe(snapshots => {

        snapshots.forEach(function(snapshot) {
          let newsRank;
          let title = snapshot.title
          let desc = snapshot.description;
          let date = snapshot.pubDate;
          let link = snapshot.link;

          newsRank = self.ratingLogic.rateTrends(`${title} ${desc}`) + self.ratingLogic.rateDate(date);
          if (title) {
          news.push({
            'title': title,
            'description': desc,
            'rank': newsRank,
            'link': link
           });
          }
         })
       });
       return news;
  }
}
