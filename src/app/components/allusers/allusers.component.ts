import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css'],
})
export class AllusersComponent implements OnInit {
  users = [];
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
    });
    // all users
    this.isLoading = true;
    this.db
      .object('/users')
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.users = Object.values(obj);
          this.isLoading = false;
          // console.log(this.users, 'ALL USERS');
        } else {
          this.toastr.error('No User Found in database');
          this.users = [];
        }
      });
  }

  ngOnInit(): void {}
}
