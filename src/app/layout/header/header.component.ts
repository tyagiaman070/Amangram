import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email = null;
  user = null;
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private db: AngularFireDatabase
  ) {
    auth.getUser().subscribe((user) => {
      // console.log('USER OBJECT INSIDE HEADER.ts', user);
      this.email = user?.email;
      if (user !== null) {
        this.db
          .object(`/users/${user?.uid}`)
          .valueChanges()
          .subscribe((res) => {
            if (res) {
              this.user = res;
              // console.log(this.user, 'single USERS');
            } else {
              // this.toastr.error('No User Found in database');
              this.user = null;
            }
          });
      } else {
        this.user = null;
      }
    });
  }

  ngOnInit(): void {}

  async handleSignOut() {
    try {
      await this.auth.signOut();

      this.router.navigateByUrl('/');
      this.toastr.info('LOGOUT SUCCESS', '', {
        closeButton: true,
      });
      this.email = null;
      // this.user = null;
    } catch (err) {
      this.toastr.info('LOGOUT Problem', '', {
        closeButton: true,
      });
      // console.log('PROBLEM IN SIGN OUT IN HEADER.ts');
    }
  }
}
