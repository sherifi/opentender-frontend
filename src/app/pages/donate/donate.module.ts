import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { routing } from "./donate.routing";
import { PipesModule } from "../../modules/pipes/pipes.module";
import { DonatePage } from "./donate.component";

@NgModule({
	imports: [CommonModule, PipesModule, routing],
	declarations: [DonatePage]
})
export class DonateModule {}
