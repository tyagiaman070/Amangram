import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];
  userMain = null;
  isLoading = false;

  constructor(
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    auth: AuthService
  ) {
    auth.getUser().subscribe((user) => {
      // console.log('USER OBJECT INSIDE HOME.ts', user);
      this.userMain = user;
      // console.log(user);
      // if (user !== null) {

      // console.log('AAGAYA AYAHA TAAK USER ');
      // }
    });
    // all users

    this.db
      .object('/users')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.users = Object.values(obj);
          // this.isLoading = false;
          // console.log(this.users, 'ALL USERS');
        } else {
          this.toastr.error('No User Found in database');
          this.users = [];
        }
      });
    // get ALl Posts
    if (this.userMain !== null) {
      this.isLoading = true;
    }
    this.db
      .object('/posts')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.posts = Object.values(obj).sort((a, b) => b.date - a.date);
          this.isLoading = false;
          // console.log('AAGAYA AYAHA TAAK FALSE ');
          // console.log(this.posts, 'ALL POSTS');
        } else {
          this.toastr.error('No POSTS TO DISPLAY');
          this.users = [];
        }
      });
  }

  ngOnInit(): void {}
}
