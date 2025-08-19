import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faLanguage, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { User } from '../../../model/User';
import { FirestoreService } from '../../../services/firestore.service';


@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  imports: [CommonModule, FontAwesomeModule, NgbModule, RouterModule, TranslateDirective],

  styleUrls: ['./main-header.component.sass']
})


export class MainHeaderComponent implements OnInit {

  faLanguage = faLanguage;
  faBars = faBars;
  faRightFromBracket = faRightFromBracket;

  currentLang: string = "en";
  adminPage: boolean = false;
  showSubmenu: boolean = false;
  isMenuCollapsed: boolean = true;


  private provider = new GoogleAuthProvider();

  user$;

  constructor(public auth: Auth, public router: Router, public translate: TranslateService, private firestoreService: FirestoreService) {
    this.user$ = user(this.auth);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.debug("event", event.url);
        // this.showSubmenu = event.url == "/" || event.url.startsWith("/illustrations");
      }
    });



  }

  ngOnInit(): void {
    console.debug("MainHeaderComponent::ngOnInit - lang", this.translate.currentLang)
    this.isMenuCollapsed = true;
    this.currentLang = this.translate.currentLang ?? "en";
    this.translate.use(this.currentLang);

  }

  ngAfterViewInit(): void {
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    localStorage.setItem("current-lang", lang);

    this.translate.use(lang);
  }

  login() {
    signInWithPopup(this.auth, this.provider).then((userCredential) => {
      const credential = GoogleAuthProvider.credentialFromResult(userCredential);
      console.debug("MainHeaderComponent.login - credential", credential)
      console.debug("MainHeaderComponent.login - userCredential", userCredential);
      if (userCredential.user.email) {
        this.firestoreService.loadUser(userCredential.user.email).then((docs) => {
          let docId = null;
          console.log("MainHeaderComponent.loadUser - result" + docs);
          if (docs)
            docs.forEach((doc) => {
              docId = doc.id;
            });
          const user = User.createFromUserCredential(docId, userCredential);
          this.saveUser(user);
        }).catch(function (error) {
          console.error(error.message);
        });
      }
    });
  }

  private saveUser(user: User) {
    console.log("user", user);
    this.firestoreService.saveUser(user).then((result) => {
      console.log(result);
    })
      .catch(function (error) {
        console.error(error.message);
      });

  }

  logout() {
    signOut(this.auth).then(() => {
      console.debug('signed out');
    }).catch((error) => {
      console.debug('sign out error: ' + error);
    })
  }


}
