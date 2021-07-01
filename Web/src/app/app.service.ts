import { environment } from './../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskObj } from './create-tasks';
import { Observable, of, Subject, timer } from 'rxjs';
import {
  catchError,
  retry,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService  implements OnDestroy {
  requestOptions = {};
  headers: HttpHeaders;

  private task$: Observable<TaskObj>;
  private stopPolling = new Subject();

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders()
      .append(environment.header_key, environment.header_value)
      .append('Access-Control-Allow-Origin', '*')
      .append('Content-Type', 'application/json')
      .append('Accept', 'application/json');
    this.requestOptions = {
      headers: this.headers,
    };
  }

  createTask(input: TaskObj): Observable<TaskObj> {
    return this.http
      .post<TaskObj>(environment.base_url, input, this.requestOptions)
      .pipe(
        take(1),
        // tap(_ => this.log('feteched tasks')),
        catchError(this.handleError<TaskObj>('addTask'))
      );
  }

  updateTask(input: TaskObj): Observable<TaskObj> {
    return this.http
      .put<TaskObj>(environment.base_url + input.id, input, this.requestOptions)
      .pipe(
        take(1),
        // tap(_ => this.log('feteched tasks')),
        catchError(this.handleError<TaskObj>('updateTask'))
      );
  }

  listTasks(): Observable<TaskObj[]> {
    return this.http
      .get<TaskObj[]>(environment.base_url, this.requestOptions)
      .pipe(
        take(1),
        // tap(_ => this.log('feteched tasks')),
        catchError(this.handleError<TaskObj[]>('getTasks', []))
      );
  }

  deleteTask(task: TaskObj | string): Observable<TaskObj> {
    const id = typeof task === 'string' ? task : task.id;
    console.log(id, this.requestOptions);

    return this.http
      .delete<TaskObj>(
        environment.base_url + encodeURIComponent(id),
        this.requestOptions
      )
      .pipe(
        take(1),
        // tap(_ => this.log('feteched tasks')),
        catchError(this.handleError<TaskObj>('deleteTask'))
      );
  }

  executeOrCancelTask(
    task: TaskObj | string,
    api: string
  ): Observable<TaskObj> {
    const id = typeof task === 'string' ? task : task.id;
    console.log(id, this.requestOptions);

    return this.http
      .post<TaskObj>(environment.base_url + id + api, task, this.requestOptions)
      .pipe(
        take(1),
        // tap(_ => this.log('feteched tasks')),
        catchError(this.handleError<TaskObj>(api))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getCounterProgress(task: TaskObj | string, start: number): Observable<TaskObj> {
    const id = typeof task === 'string' ? task : task.id;
    console.log(id, this.requestOptions);
    this.task$ = timer(start, 1000).pipe(
      switchMap(() =>
        this.http.get<TaskObj>(
          environment.base_url + encodeURIComponent(id),
          this.requestOptions
        )
      ),
      retry(),
      // share(),
      takeUntil(this.stopPolling)
    );
    return this.task$;
  }

  ngOnDestroy() {
    this.stopPolling.next();
  }
}
