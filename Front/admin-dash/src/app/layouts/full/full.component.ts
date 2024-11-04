import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface SidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  icon_path = "";
  username: string | null = null;
  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
  ) { }

  routerActive: string = "activelink";
  sidebarMenu : SidebarMenu[] = [];


  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if(this.username == "admin")
      {
       this.icon_path =  "assets/images/admin.png"
    this.sidebarMenu = [
      {
        link: "/home",
        icon: "home",
        menu: "Dashboard",
      },
      {
        link: "/user",
        icon: "user",
        menu: "Users",
      },
      {
        link: "/velero-download",
        icon: "download",
        menu: "Velero Download",
      }
    ];
  }
    else
    {
      this.icon_path =  "assets/images/user-logo.png"

      this.sidebarMenu = [
        {
          link: "/user-home",
          icon: "home",
          menu: "Home",
        },
        {
          link: "/project",
          icon: "folder",
          menu: "Projects",
        },
        {
          link: "/backup",
          icon: "file",
          menu: "Backups",
        },
        {
          link: "/credential",
          icon: "settings",
          menu: "Credentials",
        },
        {
          link: "/velero-setup",
          icon: "key",
          menu: "SSH Setup",
        },
        {
          link: "/profile",
          icon: "user",
          menu: "Profile",
        }
      ]
    }
  }

  logout(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('username');
    console.log('Logged out successfully (token and username removed)');
    this.router.navigate(['/login']);
  }
  
}
