import { checkStudyToJSONCompliance, getStudyChangesToAndFromJSON, Study } from "../models/study";
import { Game, getGameChangesToAndFromJSON } from "../models/game/game";
import { readStudyWorkbook } from "../models/studyExcelReader";

import { generateUID } from "../utils/uid";
import Excel from "exceljs";
import { NotificationType, notifyUser } from "../services/notificationService"
import { getStudy, uploadImagesToStorage, uploadStudyConfiguration } from "../services/studyApiService"

import { doTypeCheck, isOfType } from "../utils/types";
import { StudyImage } from "../models/images";


// Attaches an event listener to the submit button to initiate file upload on page load.
document.addEventListener(
    "DOMContentLoaded",
    () => document
        .getElementById("study-submit-button")
        .addEventListener("click", () => doFileUpload())
);


/**
 * Handles file selection and triggers the reading and upload process.
 * Validates that a file has been selected before proceeding.
 */
function doFileUpload() {
    const fileInput = <HTMLInputElement>document.getElementById("upload-study-file");
    const file = fileInput.files[0];

    if (!file) {
        notifyUser(
            "No file selected. Please select a file to upload.",
            NotificationType.ERROR
        );
        return;
    }

    const reader = new FileReader();

    notifyUser(
        "Processing excel file...",
        NotificationType.INFO
    );

    reader.onload = (event) => {
        readXLSX(
            <ArrayBuffer>event.target.result,
            (study) => {
                verifyStudy(
                    study,
                    (study) => uploadStudy(study)
                );
            }
        );
    };

    reader.onerror = () => {
        console.error(`Error reading file: ${reader.error}`);
        alert(`Error reading file: ${reader.error}`);
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Processes an Excel file to read study data.
 * The study data is parsed and a new Study instance is created.
 * Upon successful parsing, the onComplete callback is invoked with the study.
 *
 * @param {ArrayBuffer} buffer - The file content of an Excel workbook as an ArrayBuffer.
 * @param {Function} onComplete - Callback function to execute upon successful reading of the study.
 */
function readXLSX(
    buffer: ArrayBuffer,
    onComplete: { (study: Study): void; }
) {
    new Excel.Workbook().xlsx
        .load(buffer)
        .then((workbook: Excel.Workbook) => {
            notifyUser(
                "Reading spreadsheet...",
                NotificationType.INFO
            )
            readStudyWorkbook(workbook)
                .then(async (study: Study) => {
                    let previousStudy = undefined; // TODO: Determine previousStudy on page.
                    const authorName = "Test user"; // TODO: Determine author name.
                    const authorID = "Test user"; // TODO: Determine author ID.

                    let currentStudyId = window.location.pathname.split("/").pop()
                    if (currentStudyId.length !== 0) previousStudy = await getStudy(currentStudyId);

                    // If updating a study, use its ID, or else generate a new one.
                    if (previousStudy) {
                        study.id = previousStudy.id;
                        study.authorID = previousStudy.authorID;
                        study.authorName = previousStudy.authorName;
                    } else {
                        study.id = generateUID();
                        study.authorID = authorID;
                        study.authorName = authorName;
                    }
                    study.updateLastModifiedTime();

                    onComplete(study);
                })
                .catch((error) => {
                    console.error(error);
                    notifyUser(
                        `Error reading spreadsheet: ${error.message}`,
                        NotificationType.ERROR
                    );
                })
        })
        .catch((error) => {
            console.error(error);
            notifyUser(
                `Error parsing spreadsheet: ${error.message}`,
                NotificationType.ERROR
            );
        });
}

/**
 * Verifies the contents of {@param study} to check for
 * errors in the study before it is uploaded to the database.
 *
 * @param study
 * @param onComplete the function to be called with the study once it has been successfully verified.
 */
function verifyStudy(
    study: Study,
    onComplete: (study) => any
): void {
    notifyUser(
        `"Verifying study..."`,
        NotificationType.INFO
    )

    const reportInternalError = (errorMessage: string) => notifyUser(
        `An error was found in the study: ${errorMessage}`,
        NotificationType.ERROR
    );

    try {
        doTypeCheck(study, Study, "The study");
    } catch (error) {
        console.error(error);
        reportInternalError("The study was not loaded correctly.");
        return;
    }

    // Do more checks to make sure this study plays
    // nicely with our other systems.
    try {
        // Try convert the study to and from JSON.
        const studyChanges = getStudyChangesToAndFromJSON(study);
        if (studyChanges.length !== 0) {
            console.error(studyChanges);
            reportInternalError("The study changed after saving and loading.");
            return;
        }

        // Verify that none of our custom objects were left after toJSON().
        const error = checkStudyToJSONCompliance(study);
        if (error !== null) {
            console.error(error);
            reportInternalError("The study contained invalid values.");
            return;
        }
    } catch (error) {
        console.error(error);
        reportInternalError("An error occurred while saving this study: " + error.message);
        return;
    }

    let game;
    try {
        // Try create a new Game using the study.
        game = Game.createNew(study);
    } catch (error) {
        console.error(error);
        reportInternalError(
            "An error occurred while simulating a game using this study: " +
            error.message
        );
        return;
    }

    try {
        // Try convert the game to and from JSON.
        const gameChanges = getGameChangesToAndFromJSON(game);
        if (gameChanges.length !== 0) {
            console.error(gameChanges);
            reportInternalError(
                "A test game created using this study " +
                "changed after saving and loading."
            );
            return;
        }
    } catch (error) {
        console.error(error);
        reportInternalError(
            "An error occurred saving a sample game simulated using this study: " +
            error.message
        );
        return;
    }

    // Study was verified as correct!
    onComplete(study);
}


/**
 * Uploads {@param study}, including its configuration and all its images, to the database.
 */
function uploadStudy(
    study: Study
): void {
    doTypeCheck(study, Study, "Study");

    notifyUser(
        "Uploading images...",
        NotificationType.INFO
    )

    // Collect all images to upload.
    let images: { path: string; image: StudyImage; }[] = [];
    for (let index = 0; index < study.posts.length; ++index) {
        const post = study.posts[index];
        if (!isOfType(post.content, "string")) {
            const path = StudyImage.getPath(
                study, post.id, post.content.toMetadata()
            );
            console.log("___________image id(path): ", path)
            images.push({ "path": path, "image": <StudyImage>post.content });
        }
    }
    for (let index = 0; index < study.sources.length; ++index) {
        const source = study.sources[index];
        if (!source.avatar)
            continue;
        console.log("___________study object: ", study)
        const path = StudyImage.getPath(
            study, source.id, source.avatar.toMetadata()
        );
        images.push({ "path": path, "image": <StudyImage>source.avatar });
    }

    // Upload all the images.
    uploadImagesToStorage(images)
        .then(() => uploadStudyConfig(study))
        .catch((error) => {
            notifyUser(
                `Study images could not be uploaded. Error: ${error.message}`,
                NotificationType.ERROR
            );
            console.error(error);
        });
}

/**
 * Uploads the study configuration of {@param study}.
 */
function uploadStudyConfig(
    study: Study
): void {
    notifyUser(
        "Uploading study configuration...",
        NotificationType.INFO
    )
    uploadStudyConfiguration(study).then(() => {
        // Successfully uploaded the study!
        notifyUser(
            "Success",
            NotificationType.SUCCESS
        );
        window.location.reload();
    }).catch((error) => {
        notifyUser(
            `Study could not be uploaded. ${error.message}`,
            NotificationType.ERROR
        )
    });
}

