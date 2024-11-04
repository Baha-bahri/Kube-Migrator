import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  search = false;
  displayedColumns: string[] = ['email', 'username', 'action'];
  dataSource: User[] = [];
  newUser: User = {
    username: '',
    email: '',
    phone: '',
    password: ''
  };
  
  back_data : User[]= []
  createUserForm: FormGroup;
  
  @ViewChild('createUserModal') createUserModal?: TemplateRef<any>;

  constructor(private userService: UserService, private dialog: MatDialog, private formBuilder: FormBuilder) { 
    this.createUserForm = this.formBuilder.group({ 
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  check_username = false;
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.dataSource = users.filter(item => item.username != "admin");
        this.back_data = this.dataSource;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      (response: boolean) => {
        if (response) {
          this.fetchUsers();
        } else {
          console.error('Error deleting user:', id);
        }
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  openCreateUserModal(): void {
    if (this.createUserModal) { 
      this.dialog.open(this.createUserModal);
    }
  }

  closeCreateUserModal(): void {
    this.dialog.closeAll();
  }

  createUser(): void {
    this.userService.register(this.newUser).subscribe(
      (createdUser: User) => {
        console.log('User created:', createdUser);
        this.closeCreateUserModal();
        this.fetchUsers();
        this.check_username = false;
      },
      (error) => {
        this.check_username = true;
        console.error('Error creating user:', error);
      }
    );
  }


  search_users(event : any)
  {
   let text = event.target.value;
   this.dataSource = this.back_data.filter(item => item.username.toLowerCase().includes(text.toLowerCase()))
  }
}
