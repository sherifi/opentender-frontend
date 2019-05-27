import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DonatePage } from "./donate.component";

const routes: Routes = [{ path: "", component: DonatePage }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
