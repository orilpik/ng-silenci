import { Component, OnInit, Inject } from '@angular/core';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  silenceRequested = false;
  silenceRequester = '';
  countdown: number = 60;
  interval: any;

  constructor(@Inject('database') private db: any) { }

  ngOnInit(): void {
    this.requestNotificationPermission();
    const silenceRef = ref(this.db, 'silence');
    onValue(silenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.requester) {
        this.silenceRequested = true;
        this.silenceRequester = data.requester;
        this.startCountdown();
        this.showNotification(data.requester);
      } else {
        this.silenceRequested = false;
      }
    });
  }

  startCountdown() {
    this.countdown = 60;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.silenceRequested = false;
        clearInterval(this.interval);
        const silenceRef = ref(this.db, 'silence');
        remove(silenceRef);
      }
    }, 1000);
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  showNotification(requester: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Sol·licitud de silenci', {
        body: `${requester} demana silenci durant 1 minut`,
        icon: '/assets/icons/silence.png' // Assegura't de tenir un icona en aquesta ruta
      });
    }
  }
}
