import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LoginService } from '../login/login.service';
import { RemoteConnectionService } from '../remote-connection/remote-connection.service';

import { environment } from '../../../../environments/environment';

import { NotificationType } from '../../models/notification-type';

const baseRestPath = '/notifications';
const baseGetUserUrl = environment.backend_sdk + baseRestPath;

@Injectable()
export class NotificationTypeService {

  constructor(private loginService: LoginService, private remoteConnectionService: RemoteConnectionService) { }

  public getAll(): Observable<Array<NotificationType>> {
    return this.remoteConnectionService.getAsObservable(baseGetUserUrl)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

}
