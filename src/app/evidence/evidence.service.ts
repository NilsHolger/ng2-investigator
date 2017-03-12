import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AngularFire, FirebaseListObservable} from 'angularfire2/angularfire2';
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
  private clusters;
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

  clusterBuilder(main, centers) {
      const self = this;
      let count;
      let max;
      let clusterCenters = {};
      let flag;
      let keywords = centers.split(',');
      let records = this.corpus.push('');
      let observations = {};
      let network = {};
      let nodes = [];
      let edges = [];
      let currentCenterId;
      let id = 10;
      let colorIndex = 2;
      // nodes.push({
      //   id: 1, label: main, title: [main, 'This is the root'], font: {size:40},
      //   color: this.colors[0], borderWidth: 3, borderWidthSelected: 4
      // });

      return Promise.all(keywords.map(function (word) {
        observations[word] = [];
        records
          .then(snapshot => {
            max = 0;
            snapshot.forEach(article => {
              count = 0;
              flag = false;
              article.child('bag_of_words').val().forEach(word => {
                if (word.word == word) count += word.count;
                if (word.word == main) flag = true;
              });
              if (flag && count > max) {
                max = count;
                clusterCenters[word] = {
                  id: article.key,
                  bag_of_words: article.child('bag_of_words').val()
                }
              }
              edges.push({from: 1, to: currentCenterId, width: 2});
              return clusterCenters;
            })
            currentCenterId = id++;
            nodes.push({
              id: currentCenterId,
              label: word,
              title:[word, 'This is a cluster center', 0],
              color: '',
              borderWidth: 2,
              borderWidthSelected: 3,
              font: {size: 28},
            });
            edges.push({from: 1, to: currentCenterId, width: 2});
            return clusterCenters;
          })
          .then(centers => {
              let i = 1;
              return records
                .then(snapshot => {
                  snapshot.forEach(article => {
                    let sum = 0;
                    let distance = 0;
                    let contents = article.child('article').val();
                    centers[word].bag_of_words.forEach(k => {
                      article.child('bag_of_words').val().forEach(w => {
                        if (k.word == w.word) {
                          sum += isNaN(k.normalized * w.normalized) ?
                            0 : (k.normalized * w.normalized);
                        }
                      })
                    })
                    distance = 1 - sum;
                    observations[word].push({
                      id: article.key,
                      distance: distance.toFixed(4),
                      link: article.child('link').val(),
                      size: contents.split(' ').length
                    });
                  })
                  observations[word].sort(function (a, b) {
                    return a['distance'] - b['distance'];
                  });
                  observations[word] = observations[word].slice(0,6);

                  var node = nodes.find(node => node.label === word);
                  observations[word].forEach(item => {
                    nodes.push({
                      id: id,
                      label: (item.link)?item.link
                        .replace('http://','')
                        .replace('https://','')
                        .replace('www.','').split("/")[0]+'\n'+item.size+' words'
                      :'4xx',
                      title: [item.link, item.id],
                      shadow:{ enabled: true, color: 'rgba(0,0,0,0.5)', size:11, x:3, y:3 },
                      color: '',
                      shape: 'box'
                    });
                    edges.push({
                      from: node.id,
                      to: id,
                      dashes: true,
                      label: item.distance,
                      length: 100 + item.distance * 1000,
                      font: {
                        color: '#777777',
                        background: 'white',
                        align:'middle'
                      },
                    });
                    id++;
                  });
                  colorIndex ++;
                })
            })
        network = {nodes: nodes, edges: edges};
        return network;
      }));
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
          &num=3
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
