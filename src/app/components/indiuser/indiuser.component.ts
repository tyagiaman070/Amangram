import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-indiuser',
  templateUrl: './indiuser.component.html',
  styleUrls: ['./indiuser.component.css'],
})
export class IndiuserComponent implements OnInit {
  @Input()
  post;

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  userIndivPosts = [];
  userMain = null;
  isLoadingUserIndivPosts = false;
  noPosts = false;

  constructor(
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private auth: AuthService
  ) {
    // console.log(this.post);
    // user Object
    this.auth.getUser().subscribe((user) => {
      // console.log('USER OBJECT INSIDE HOME.ts', user);
      this.userMain = user;
      if (user !== null) {
        this.isLoadingUserIndivPosts = true;
        // console.log('AAGAYA AYAHA TAAK USER ');
      }
      // Getting Indiv posts
      // TODO:  ADD THIS CODE OF INDIVIDUAL POSTS TO DIFFERNRT ROUTE MY POSTS

      this.db
        .object(`/posts`)
        .valueChanges()
        .subscribe((obj) => {
          if (obj) {
            this.userIndivPosts = Object.values(obj)
              .filter((postsAll) => {
                // console.log(postsAll);
                return postsAll.userId === user.uid;
              })
              .sort((a, b) => b.date - a.date);
            // console.log(this.userIndivPosts, 'INDIV POSTS');
            this.isLoadingUserIndivPosts = false;
            if (this.userIndivPosts.length === 0) {
              this.noPosts = true;
            } else {
              this.noPosts = false;
            }
          } else {
            this.toastr.error('No POSTS Found');
            this.userIndivPosts = [];
          }
        });
    });
  }

  ngOnInit(): void {}

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaId}`;
  }

  deleteThisPost(postId, postLocationName) {
    // console.log(postId);

    this.db
      .object(`/posts/${postId}`)
      .remove()
      .then((res) => {
        this.toastr.success(`${postLocationName} seleted success`, '', {
          closeButton: true,
        });
        // console.log('AFTER DELETING POST ', res);
      })
      .catch((err) => {
        // console.log('ERROR IN DELETING', err);
      });
  }
}
