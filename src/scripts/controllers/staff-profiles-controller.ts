/*
 * Created on Mon Oct 16 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";

export default class StaffProfilesController extends BlockController {
    blockClassName: string;

    blocks: NodeListOf<HTMLElement>;
    block?: HTMLElement | null;
    staffSummaries?: NodeListOf<HTMLElement>;

    constructor(blockClassName: string) {
        super();
        this.name = "StaffProfilesController";
        if (!blockClassName) throw new Error("FeaturedVideoController: blockClassName is undefined");
        this.blockClassName = blockClassName;
    }

    setup(): void {
        this.block = document.querySelector(this.blockClassName);

        if (this.invalid(this.block)) {
            this.log("No staff profiles block found:", this.blockClassName);
            return;
        }

        this.staffSummaries = this.block?.querySelectorAll(".staff-summary");

        this.addEventListeners();

        this.isInitialized = true;
    }

    addEventListeners() {
        this.staffSummaries?.forEach((staffSummary) => {
            const innerStaffProfile = staffSummary.querySelector(".staff-profile");
            const closeButton = innerStaffProfile?.querySelector(".close-button");

            closeButton?.addEventListener("click", (event) => {
                // since close button is inside staff summary event needs to to stop bubbling up or else it will close and then open again
                event.stopPropagation();
                if (innerStaffProfile) {
                    innerStaffProfile.classList.remove("opened");
                }
            });

            staffSummary.addEventListener("click", () => {
                if (innerStaffProfile && !innerStaffProfile.classList.contains("opened")) {
                    innerStaffProfile.classList.add("opened");
                }
            });
        });
    }
}
