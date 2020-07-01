import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { v4 as uuidv4 } from 'uuid';

import { NgForm } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { readAndCompressImage } from 'browser-image-resizer';
import imageConfig from 'src/utils/config';

import { faMapMarker } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  position = null;
  latlon = null;
  faMapMarker = faMapMarker;
  imgurl = null;
  isLoading = false;
  locationName: string;
  description: string;
  picture: string = null;
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0');
  yyyy = this.today.getFullYear();

  todayDate = this.mm + '/' + this.dd + '/' + this.yyyy;

  userMain = null;
  userSignUp = null;
  uploadPercent: number = null;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService,
    auth: AuthService,
    private router: Router
  ) {
    auth.getUser().subscribe((user) => {
      this.db
        .object(`/users/${user.uid}`)
        .valueChanges()
        .subscribe((usera) => {
          this.userMain = user;
          this.userSignUp = usera;
          // console.log(usera);

          // console.log(this.userMain.uid);
          // console.log(this.userSignUp);
        });
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const uid = uuidv4();

    // this.db
    //   .object(`/posts/${uid}`)
    //   .set({
    //     id: uid,
    //     locationName: this.locationName,
    //     description: this.description,
    //     picture: this.picture,
    //     by: this.user.name,
    //     instaId: this.user.instaUserName,
    //     date: Date.now(),
    //   })
    //   .then((res) => {
    //     this.toastr.success('POST added success');
    //     console.log('RESPONSE AFTER ADDING POST', res);

    //     this.router.navigateByUrl('/');
    //   })
    //   .catch((err) => {
    //     this.toastr.error(err);
    //     console.log(err);
    //   });
    this.isLoading = true;
    this.db
      .object(`/posts/${uid}`)
      .set({
        id: uid,
        locationName: this.locationName,
        description: this.description,
        picture: this.picture,
        by: this.userSignUp.name,
        instaId: this.userSignUp.instaUserName,
        date: new Date(),
        userId: this.userMain.uid,
        userEmail: this.userMain.email,
        // userInstaId: this.userSignUp.instaUserName,
        // userLocation: this.userMain
      })
      .then(() => {
        this.toastr.success('Post added successfully');
        this.isLoading = false;
        this.router.navigateByUrl('/');
      })
      .catch((err) => {
        this.toastr.error('Problem in adding post');
      });

    // this.db
    //   .object(`/users/${this.userMain.uid}/posts/${uid}`)
    //   .set({
    //     id: uid,
    //     locationName: this.locationName,
    //     description: this.description,
    //     picture: this.picture,
    //     by: this.userSignUp.name,
    //     instaId: this.userSignUp.instaUserName,
    //     date: Date.now(),
    //   })
    //   .then(() => {
    //     // this.toastr.success('Post added successfully');
    //     // this.router.navigateByUrl('/');
    //   })
    //   .catch((err) => {
    //     this.toastr.error('Oopsss');
    //   });
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    const resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = uuidv4();
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
            this.toastr.success('IMAGE OF POST SUCCESS');
          });
        })
      )
      .subscribe();
  }

  getLiveLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.position = position;
        console.log(position);
        this.latlon =
          this.position?.coords?.latitude +
          ',' +
          this.position?.coords?.longitude;
        if (this.position?.coords?.latitude) {
          this.imgurl = `https://maps.googleapis.com/maps/api/staticmap?center=+${this.latlon}+&zoom=14&size=400x300&sensor=false&key=AIzaSyAJPgZgRGEbL1EHru_wNOBuGjSw1K7OvDs`;
          console.log(this.latlon);

          console.log(this.imgurl);
        } else {
          console.log('NOT SET TO IMAGE URL');
        }
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
}
