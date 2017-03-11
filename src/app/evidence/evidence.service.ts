import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class EvidenceService {
  private http;
  private words;
  private article = '';

  constructor(http: Http) {
    this.http = http;
  }

  wordCounts(url) {
    //todo: get a url subscribeto its response and call other functions
    //to count the words and their occurence in it.
    //ideally it will return an array of objects
    return this.words;
  }

  wordAnalyzer(url) {
    this.getArticle(this.getYahooQueryUrl(url)).subscribe(data => {
      this.findKey(data, 'content');
      this.words = this.countInstances(this.extractWords(this.article));
    });
  }

  countInstances(allWords) {
    let instances = {};
    allWords.forEach(function(word) {
      if (instances.hasOwnProperty(word)) {
        instances[word]++;
      } else {
        if(word) {
        instances[word] = 1;
       }
      }
    });
    return this.sortWords(instances);
  }

  sortWords(instances) {
        let words = [];
        let sortedWords = Object.keys(instances).sort(function(a, b) {
          return instances[b] - instances[a];
        });
        sortedWords.forEach(function(word) {
          words.push({word: word, count: instances[word]});
        });
      return words;
  }

  extractWords(article) {
    let pure = article.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    return pure.split(/\s+/);
  }

    findKey(object, string) {
      for (let key in object) {
        if (object[key] && typeof(object[key]) === 'object') {
          this.findKey(object[key], string);
        } else if (
          key === string || typeof (key) === 'string' && key !== 'class' && key !== 'id' && key !== 'href'
        ) {
        this.article += object[key] + ' ';
        }
      }
    }

  getArticle(url) {
    return this.http.get(url).map((res: Response) => res.json()).map(data => data.query.results);
  }

  getYahooQueryUrl(link) {
  return "https://query.yahooapis.com/v1/public/yql?" +
    "q=select * from html where url=\"" + link + "\" and " +
    "xpath=\"//*[contains(@class,\'paragraph\')]|//p\"" +
    "&format=json&diagnostics=true&callback=";
  }
}
