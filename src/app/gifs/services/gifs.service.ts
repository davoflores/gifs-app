import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

const GIPHY_URL = 'http://api.giphy.com/v1/gifs/search';
const GHIPY_API_KEY = 'xsHETKKjLIyB3RRPHCoLFdJh7n0SG6dq';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  
  constructor(private http: HttpClient) {

    //load
    if( localStorage.getItem('history') ){
      this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
      this.searchTag(this.tagHistory[0]);
    }
  }

  get tagHistory() {
    return [...this._tagsHistory];
  }

  searchTag( tag: string): void {
    if( tag.length == 0) return;

    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift( tag );

    this._tagsHistory = this._tagsHistory.splice(0, 10);

    //save
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ));

    console.log(JSON.stringify( this._tagsHistory ));
  
    const params = new HttpParams()
      .set('api_key', GHIPY_API_KEY)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(GIPHY_URL, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
      });
  }
}
