import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnChanges {
  @Input()
  post;

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;

  upvote = 0;
  downvote = 0;
  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
    });
    // console.log('POSTS RECEIVED', this.post);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.post.vote) {
      Object.values(this.post.vote).map((val: any) => {
        if (val.upvote) {
          this.upvote += 1;
        }
        if (val.downvote) {
          this.downvote += 1;
        }
      });
    }
  }
  // TODO: BUG IN UPDATING CHANGING
  upvotePost() {
    // console.log('UPVOTING');
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote: 1,
    });
  }

  downvotePost() {
    // console.log('DOWNVOTING');
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote: 1,
    });
  }

  getInstaUrl() {
    return `https://instagram.com/${this.post.instaId}`;
  }

  handleReport() {
    this.toastr.warning(`Post Reported We will analyse it.`, '', {
      closeButton: true,
    });
  }
}
