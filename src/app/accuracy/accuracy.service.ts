import { Injectable } from '@angular/core';
import { Preventions } from '../app.module';

@Injectable()
export class AccuracyService {
  private preventions = Preventions;
  constructor() {}
  takeSnapshot(id, description, file, line, variables) {
    if (Preventions.length === 0) {
      Preventions.push({
        id: id, description: description, file: file,
        line: line, hits: 1, variables: [variables]
      })
    } else {
      let prev = (Preventions.find(item => item.id === id ));
      if (prev) {
        prev.hits++;
        prev.variables.push(variables);
      } else {
        Preventions.push({
          id: id, description: description, file: file, line: line,
          hits: 1, variables: [variables]
        });
      }
    }
    console.log(Preventions);
  }
  getPreventions() {
    return this.preventions;
  }
}
