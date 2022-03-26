import {User} from '@ezyfs/repositories';
import {Observable} from 'rxjs';

export interface RegistrationAuthorityInternalServiceRPC {
  internalFindOne(userId: number): Observable<User>;
}
