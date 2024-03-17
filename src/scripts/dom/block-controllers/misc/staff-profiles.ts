/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import BlockController from "../block-controller";

export default class StaffProfilesController extends BlockController {
    private staffSummaries: NodeListOf<HTMLElement>;

    setup(): boolean {
        this.staffSummaries = this.block.querySelectorAll(".staff-summary");

        this.staffSummaries.forEach((staffSummary: HTMLElement) => {
            const innerStaffProfile = staffSummary.querySelector(".staff-profile");
            if (!this.validate(innerStaffProfile, "No inner staff profile found")) return;

            const closeButton = innerStaffProfile.querySelector(".close-button");
            if (!this.validate(closeButton, "No close button found")) return;

            closeButton.addEventListener("click", (event) => {
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

        return true;
    }
    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
