import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log(message: string){
    this.messageService.add('HeroService' + message);
  }

  private heroesUrl = 'api/heroes';

  getHero(id: number): Observable<Hero>{
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  getHeroes(): Observable<Hero[]>{
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl);
  }
}
