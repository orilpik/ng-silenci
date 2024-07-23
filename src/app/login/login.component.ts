import { Component, Inject } from '@angular/core';
import { getDatabase, ref, set } from 'firebase/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name = '';

  constructor(@Inject('database') private db: any) { }

  requestSilence() {
    set(ref(this.db, 'silence'), { requester: this.name });
  }
}
