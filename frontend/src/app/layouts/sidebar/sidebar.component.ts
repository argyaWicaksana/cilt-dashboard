import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { MENU_CCTV, MENU_CILT, MENU_EREPORT, MENU_LUBRICATION, MENU_PROD_COST, MENU_SCHEDULE_END_CYCLE, MENU_UNIFORM } from "./menu";
import { AppNames, MenuItem } from "./menu.model";
import { AuthenticationService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  @ViewChild("sideMenu") sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  logoUrl?: string;
  logoSmUrl?: string;
  logoDarkUrl?: string;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private authService: AuthenticationService
  ) {
    translate.setDefaultLang("en");
  }

  ngOnInit(): void {
    // Menu Items
    this.selectApp();
    this.setLogo();
  }

  setLogo() {
    const currentRoutePath = this.router.url;
    if (currentRoutePath.includes("ereport")) {
      this.logoUrl = "assets/images/e-report-logo-light.png";
      this.logoDarkUrl = "assets/images/e-report-logo-dark.png";
    }
    if (currentRoutePath.includes("cctv")) {
      this.logoUrl = "assets/images/cctv-logo.png";
    }
    if (currentRoutePath.includes("uniform")) {
      this.logoUrl = "assets/images/p-uniform-logo.svg";
    }
    if (currentRoutePath.includes("cilt")) {
      this.logoUrl = "assets/images/cilt-logo-dark.png";
      this.logoDarkUrl = this.logoUrl;
      this.logoSmUrl = "assets/images/cilt-logo-only-dark.png";
    }
    if (currentRoutePath.includes("production-cost")) {
      this.logoUrl = "assets/images/production-cost-dark.png";
      this.logoDarkUrl = "assets/images/production-cost-dark.png";
      this.logoSmUrl = "assets/images/production-cost-sm.png";
    }
    if (currentRoutePath.includes("schedule-end-cycle")) {
      this.logoUrl = "assets/images/schedule-end-cycle-light.png";
      this.logoDarkUrl = "assets/images/schedule-end-cycle-light.png";
      this.logoSmUrl = "assets/images/schedule-end-cycle-sm.png";
    }
  }

  isAllowed(allowedRoles?: number[], appNames?: AppNames[]): boolean {
    const user = this.authService.currentUser;
    if (!user) {
      return false;
    }

    if (appNames) {
      if (appNames.includes(AppNames.UNIFORM)) {
        if (allowedRoles!.includes(parseInt(user.user_level_uniform))) {
          return true;
        }
        return false;
      }
      if (appNames.includes(AppNames.CCTV)) {
        if (allowedRoles!.includes(parseInt(user.user_level_cctv))) {
          return true;
        }
        return false;
      }
      if (appNames.includes(AppNames.EREPORT)) {
        if (this.authService.userHasRoleReport(allowedRoles!)) {
          return true;
        }
        return false;
      }
      if (
        appNames.some(appName => [
          AppNames.CILT, AppNames.LUBRICATION,
          AppNames.PROD_COST, AppNames.SCHEDULE_END_CYCLE
        ].includes(appName))
      ) {
        if (!allowedRoles || this.authService.userHasRole(allowedRoles)) {
          return true;
        }
        return false;
      }
      // if (appNames.includes(AppNames.LUBRICATION) || appNames.includes(AppNames.PROD_COST) || appNames.includes(AppNames.SCHEDULE_END_CYCLE)) {
      //   return true;
      // }
    }
    if (!allowedRoles) {
      return true;
    }
    if (allowedRoles.includes(parseInt(user.user_level_report))) {
      return true;
    }
    return false;
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.initActiveMenu();
  }

  selectApp() {
    const currentRoutePath = this.router.url;
    if (currentRoutePath.includes("ereport")) {
      this.menuItems = MENU_EREPORT;
      return;
    }
    if (currentRoutePath.includes("cctv")) {
      this.menuItems = MENU_CCTV;
      return;
    }
    if (currentRoutePath.includes("uniform")) {
      this.menuItems = MENU_UNIFORM;
      return;
    }
    if (currentRoutePath.includes("cilt")) {
      this.menuItems = MENU_CILT;
      return;
    }
    if (currentRoutePath.includes(AppNames.LUBRICATION)) {
      this.menuItems = MENU_LUBRICATION;
      return;
    }

    if (currentRoutePath.includes(AppNames.PROD_COST)) {
      this.menuItems = MENU_PROD_COST;
      return;
    }

    if (currentRoutePath.includes(AppNames.SCHEDULE_END_CYCLE)) {
      this.menuItems = MENU_SCHEDULE_END_CYCLE;
      return;
    }
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling
          ? item.nextElementSibling.classList.remove("show")
          : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  toggleSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  toggleExtraSubItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(document.querySelectorAll(".extra-sub-menu"));
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });

      let subDropDowns = Array.from(
        document.querySelectorAll(".menu-dropdown .nav-link")
      );
      subDropDowns.forEach((submenu: any) => {
        submenu.setAttribute("aria-expanded", "false");
      });

      if (event.target && event.target.nextElementSibling) {
        isCurrentMenuId.setAttribute("aria-expanded", "true");
        event.target.nextElementSibling.classList.toggle("show");
      }
    }
  }

  // Click wise Parent active class add
  toggleParentItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let dropDowns = Array.from(document.querySelectorAll("#navbar-nav .show"));
    dropDowns.forEach((node: any) => {
      node.classList.remove("show");
    });
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) =>
        x.classList.contains("active")
      );
      activeIconItems.forEach((item: any) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      });
    }
    isCurrentMenuId.setAttribute("aria-expanded", "true");
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    if (isMenu.classList.contains("show")) {
      isMenu.classList.remove("show");
      isCurrentMenuId.setAttribute("aria-expanded", "false");
    } else {
      let dropDowns = Array.from(
        document.querySelectorAll("#navbar-nav .show")
      );
      dropDowns.forEach((node: any) => {
        node.classList.remove("show");
      });
      isMenu ? isMenu.classList.add("show") : null;
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const iconItems = Array.from(ul.getElementsByTagName("a"));
        let activeIconItems = iconItems.filter((x: any) =>
          x.classList.contains("active")
        );
        activeIconItems.forEach((item: any) => {
          item.setAttribute("aria-expanded", "false");
          item.classList.remove("active");
        });
      }
      isCurrentMenuId.setAttribute("aria-expanded", "true");
      if (isCurrentMenuId) {
        this.activateParentDropdown(isCurrentMenuId);
      }
    }
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        if (
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
        ) {
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .classList.add("show");
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.closest(".collapse")
            .previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) =>
        x.classList.contains("active")
      );
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize =
      document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == "sm-hover-active") {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove("vertical-sidebar-enable");
  }
}
