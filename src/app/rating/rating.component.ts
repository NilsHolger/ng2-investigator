import { Component } from '@angular/core';
import { RatingService } from './rating.service';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  private ratingService;
  private trends;
  private collectedNews;
  private ratedNews;

  constructor(ratingService: RatingService) {
          this.ratingService = ratingService;
          this.trends = ratingService.getTrends();
          this.collectedNews = ratingService.getNews();
          this.ratedNews = ratingService.rateNews();
   }


}
