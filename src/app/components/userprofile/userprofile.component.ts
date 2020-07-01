import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { finalize } from 'rxjs/operators';

import { NgForm } from '@angular/forms';

import { readAndCompressImage } from 'browser-image-resizer';
import imageConfig from 'src/utils/config';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent implements OnInit {
  userMain = null;
  uploadPercent = null;
  user = null;
  isLoading = false;
  picture = null;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    public ngFireAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) {
    this.auth.getUser().subscribe((user) => {
      // console.log('USER OBJECT INSIDE USER PROFILE.ts', user);
      this.userMain = user;
      if (user !== undefined) {
        this.db
          .object(`/users/${user?.uid}`)
          .valueChanges()
          .subscribe((res) => {
            if (res) {
              this.user = res;
              this.picture = this.user.picture;
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

  SendVerificationMail() {
    return this.ngFireAuth.currentUser
      .then((u) => u.sendEmailVerification())
      .then(() => {
        this.router.navigateByUrl('/profile');
      });
  }

  onSubmit(f: NgForm) {
    const {
      // email,
      // password,
      username,
      // confirmPassword,
      // country,
      bio,
      name,
    } = f.form.value;
    // Check Values Further
    // TODO: || country === '---------'
    // if (confirmPassword !== password) {
    //   // console.log('country', country);

    //   return this.toastr.error('Passwords do not match', '', {
    //     closeButton: true,
    //   });
    // }
    this.isLoading = true;
    // this.auth
    //   .signUp(email, password)
    //   .then((res) => {
    // console.log('RESPONSE AFTER SIGN UP', res);
    // const { uid } = res.user;

    this.db
      .object(`/users/${this.user?.id}`)
      .update({
        id: this.user?.id,
        name,
        email: this.user?.email,
        instaUserName: username,
        country: this.user?.country,
        bio,
        picture: this.picture,
        role: 0,
      })
      // })
      .then(() => {
        this.ngFireAuth.currentUser.then((u) => u.sendEmailVerification());
        this.router.navigateByUrl('/');
        this.toastr.success('Updation success', '', {
          closeButton: true,
        });
        this.isLoading = false;
      })
      .catch((err) => {
        this.toastr.error(`ERROR IN Updating Profile ${err}`, '', {
          closeButton: true,
        });
        console.log(err, 'ERROR IN updation');
      });
  }

  async uploadFile(event) {
    const file = event.target.files[0];

    const resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = uuidv4();
    // TODO: RENAME THE IMAGE

    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('IMAGE UPLOAD SUCCESS', '', {
              closeButton: true,
            });
          });
        })
      )
      .subscribe();
  }
  // TODO: DELETE USER FROM AUTH USERS
  // deleteAccount() {
  //   this.db
  //     .object(`/users/${this.user?.id}`)
  //     .remove()
  //     .then((res) => {
  //       // this.ngFireAuth.currentUser.delete();
  //       console.log('USER DELETED SUCCESS', res);
  //       this.ngFireAuth.signOut();
  //     })
  //     .catch((err) => console.log('ERROR IN DELETING'));

  //   // this.auth.removeUser()
  // }
}
