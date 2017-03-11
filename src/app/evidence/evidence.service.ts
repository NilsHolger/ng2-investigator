import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AngularFire, FirebaseListObservable } from 'angularfire2/angularfire2';
import {Observable} from 'rxjs';
import { googleSearchConfig, timeSpans } from '../app.module';

@Injectable()
export class EvidenceService {
  private angularFire: AngularFire;
  private corpus: FirebaseListObservable<any>;
  private IDFs: FirebaseListObservable<any>;
  private http;
  private corpusSize;
  private vocabularySize;
  private words;
  private article = '';


  constructor(http: Http, angularFire: AngularFire) {
    this.http = http;
    this.angularFire = angularFire;
    this.corpus = angularFire.database.list('Evidence/Corpus/Articles');
    this.IDFs = angularFire.database.list('Evidence/Corpus/IDFs');
  }

  corpusBuilder(mainKeyword, supportKeywords) {
    this.resetCounters();
    let keywords = this.setKeywordArray(mainKeyword, supportKeywords);
    keywords.forEach((keyword: any) => {
      this.fetchLinks(keyword);
    })
  }

  setKeywordArray(mainKeyword, supportKeywords) {
    let keywords = [];
    if (supportKeywords) {
      keywords = supportKeywords.split(',');
      keywords.forEach(keyword => {
        keywords.push(mainKeyword + ' ' + keyword);
      });
      keywords.unshift(mainKeyword);
      return keywords;
    }
  }

  fetchLinks(keyword) {
    const self = this;
    timeSpans.forEach(function(period) {
        self.getSearchResults(self.getGoogleQueryUrl(keyword, period))
        .subscribe(data => data.forEach(function(item) {
          self.wordAnalyzer(item.link);
        }))
    });
  }

  getSearchResults(url) {
    return this.http.get(url).map((res: Response) => res.json()).map(data => data.items);
  }

  getGoogleQueryUrl(keyword, range) {
    return `
          https://www.googleapis.com/customsearch/v1?key=${googleSearchConfig.apiKey}
          &cx=${googleSearchConfig.cx}&q=${keyword}&sort=${range.sort}&dateRestrict=${range.span}
    `;
  }

  resetCounters() {
    this.article = null;
    this.words = [];
  }

  saveIDFs (word) {
    let uniqueBagOfWords = {};
    this.IDFs.remove();
    // this.corpus._ref.once('value').then(snapshot => {
    //   this.corpusSize = snapshot.numChildren();
    //   snapshot.forEach(item => {
    //     item.child('bag_of_words').val().forEach(word => {
    //       uniqueBagOfWords.hasOwnProperty(word.word) ? uniqueBagOfWords[word.word]++ : uniqueBagOfWords[word.word] = 1;
    //     });
    //   });
    //   let words = Object.keys(uniqueBagOfWords);
    //   this.vocabularySize = words.length;
    //   words.forEach(word => {
    //     let idf = Math.abs(Math.log2(this.corpusSize / (uniqueBagOfWords[word] + 1)));
    //     this.IDFs.push({'word': word, 'doc_with_word': uniqueBagOfWords[word], 'IDF': idf});
    //     this.words.some(function(item) {
    //       if (item.word === word) {
    //         item['idf'] = idf.toFixed(4);
    //         item['tfidf_C'] = (idf * item.count).toFixed(4);
    //         item['tfidf_N'] = (idf * item.normalized).toFixed(4);
    //         return true;
    //       }
    //     })
    //   });
    // });
  }

  wordCounts(url) {
    //todo: get a url subscribeto its response and call other functions
    //to count the words and their occurence in it.
    //ideally it will return an array of objects
    return this.words;
  }

  wordAnalyzer(url) {
    this.getArticle(this.getYahooQueryUrl(url)).subscribe(data => {
      this.resetCounters();
      this.findKey(data, 'content');
      if (this.article) {
      this.evaluateWords(this.countInstances(this.extractWords(this.article)))
      .then(data => {
        this.corpus.push({article: this.article, link: url, bag_of_words: data});
      })
    }
    });
  }

  evaluateWords(instances) {
    const self = this;
    let normFactor = this.calculateNorm(instances);
    return Promise.all(instances.map(function(word){
      if (word.word.length < 20) {
        let normalized = word.count / normFactor;
        word['normalized'] = normalized.toFixed(4);
        self.words.push(word);
      }
      return word;
    }))
  }


  calculateNorm (rawWords) {
    let total = 0;
    rawWords.forEach(function (word) {
      total += word.count * word.count;
    });
    return Math.sqrt(total);
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
