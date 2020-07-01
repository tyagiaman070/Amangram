import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adminseeusers',
  templateUrl: './adminseeusers.component.html',
  styleUrls: ['./adminseeusers.component.css'],
})
export class AdminseeusersComponent implements OnInit {
  @Input()
  users;

  constructor() {}

  ngOnInit(): void {}
}
