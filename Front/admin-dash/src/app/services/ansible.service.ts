import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnsibleService {
  private apiUrl = 'http://localhost:8090/ansible';

  constructor(private http: HttpClient) {}


  ansibleCreateBackup(dynamicHost: string, user: string, projectId: number, backName: string, namespaceName: string,contextName: string): Observable<any> {
    const url = `${this.apiUrl}/create-backup`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('project_id', projectId.toString())
      .set('back_name', backName)
      .set('namespace_name', namespaceName)
      .set('context_name', contextName);

    return this.http.post(url, body.toString(), { headers });
  }
  CreateBackupForAll(dynamicHost: string, user: string, projectId: number, backName: string,contextName: string): Observable<any> {
    const url = `${this.apiUrl}/create-backup-for-all`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('project_id', projectId.toString())
      .set('back_name', backName)
      .set('context_name', contextName);

      return this.http.post(url, body.toString(), { headers });
  }

  CreateBackupForDeploy(dynamicHost: string, user: string, projectId: number, backName: string,contextName: string): Observable<any> {
    const url = `${this.apiUrl}/create-backup-for-deploy`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('project_id', projectId.toString())
      .set('back_name', backName)
      .set('context_name', contextName);

      return this.http.post(url, body.toString(), { headers });
  }
  CreateBackupForPvPvc(dynamicHost: string, user: string, projectId: number, backName: string,contextName: string): Observable<any> {
    const url = `${this.apiUrl}/create-backup-for-pv-pvc`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('project_id', projectId.toString())
      .set('back_name', backName)
      .set('context_name', contextName);
      return this.http.post(url, body.toString(), { headers });
  }
  ansibelmigrateBackup(dynamicHost: string, user: string, backupId: number, contextName: string): Observable<string> {
    const url = `${this.apiUrl}/migrate-backup`;
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('back_id', backupId.toString())
      .set('context_name', contextName);

    return this.http.post<string>(url, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  ansibeldeleteBackup(dynamicHost: string, user: string, backupId: number, contextName: string): Observable<string> {
    const url = `${this.apiUrl}/delete-backup`;
    const body = new HttpParams()
      .set('dynamicHost', dynamicHost)
      .set('user', user)
      .set('back_id', backupId.toString())
      .set('context_name', contextName);

    return this.http.post<string>(url, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }


  private handleError(error: any) {
    return throwError('Error occurred while calling API');
  }

  sshSetup(ssh_key: string, user: string): Observable<string> {
    const url = `${this.apiUrl}/ssh-setup`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
    .set("ssh_key",ssh_key)
    .set("user",user);
    return this.http.post<string>(url, body.toString(),{headers}).pipe(
      catchError(this.handleError)
    );
  }
}