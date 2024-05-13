// How many photos to delete?
// Put a number value, like this
// const maxImageCount = 5896
const maxImageCount = "ALL_PHOTOS";

// Selector for Images and buttons
const ELEMENT_SELECTORS = {
    checkboxClass: '.ckGgle',
    languageAgnosticDeleteButton: 'div[data-delete-origin] button',
    deleteButton: 'button[aria-label="Delete"]',
    restoreButton: 'button[aria-label="Restore"]'
    confirmationButton: '#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.V639qd.bvQPzd.oEOLpc.Up8vH.J9Nfi.A9Uzve.iWO5td > div.XfpsVe.J9fJmf > button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.nCP5yc.kHssdc.HvOprf'
}

// Time Configuration (in milliseconds)
const TIME_CONFIG = {
    delete_cycle: 10000,
    press_button_delay: 2000
};

const MAX_RETRIES = 1000;

let imageCount = 0;

let checkboxes;
let buttons = {
    deleteButton: null,
    restoreButton: null,
    confirmationButton: null
}

let restoreTask = setInterval(async () => {
    let attemptCount = 1;

    do {
        checkboxes = document.querySelectorAll(ELEMENT_SELECTORS['checkboxClass']);
        await new Promise(r => setTimeout(r, 1000));
    } while (checkboxes.length <= 0 && attemptCount++ < MAX_RETRIES);


    if (checkboxes.length <= 0) {
        console.log("[INFO] No more images to delete.");
        clearInterval(restoreTask);
        console.log("[SUCCESS] Tool exited.");
        return;
    }

    attemptCount = 1;
    imageCount += checkboxes.length;

    checkboxes.forEach((checkbox) => { checkbox.click() });
    console.log("[INFO] Deleting", checkboxes.length, "images");

    setTimeout(() => {
        try {
            buttons.restoreButton = document.querySelector(ELEMENT_SELECTORS['languageAgnosticRestoreButton']);
            buttons.restoreButton.click();
        } catch {
            buttons.restoreButton = document.querySelector(ELEMENT_SELECTORS['restoreButton']);
            buttons.restoreButton.click();
        }

        setTimeout(() => {
            buttons.confirmation_button = document.querySelector(ELEMENT_SELECTORS['confirmationButton']);
            buttons.confirmation_button.click();

            console.log(`[INFO] ${imageCount}/${maxImageCount} Deleted`);
            if (maxImageCount !== "ALL_PHOTOS" && imageCount >= parseInt(maxImageCount)) {
                console.log(`${imageCount} photos deleted as requested`);
                clearInterval(restoreTask);
                console.log("[SUCCESS] Tool exited.");
                return;
            }

        }, TIME_CONFIG['press_button_delay']);
    }, TIME_CONFIG['press_button_delay']);
}, TIME_CONFIG['delete_cycle']);
