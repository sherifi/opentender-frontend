import { Component } from "@angular/core";
import { ConfigService } from "../../services/config.service";

@Component({
	moduleId: __filename,
	selector: "donate",
	templateUrl: "donate.component.html"
})
export class DonatePage {
	public contactmail: string;

	constructor(private config: ConfigService) {
		this.contactmail = config.contactmail;
	}
}
