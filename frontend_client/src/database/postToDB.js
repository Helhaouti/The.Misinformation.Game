import {DatabaseAPI} from "./DatabaseAPI";

/**
 * Uploads the study configuration to the database.
 * We keep this wrapper to keep compatibility between the application and the API
 *
 * @param {Object} study - The study configuration object.
 * @returns {Promise<void>} - A promise that resolves once the study configuration is uploaded.
 */
export async function uploadStudyConfiguration(study) {
    try {
        const studyJson = study.toJSON();
        await DatabaseAPI.insertStudy(studyJson);
    } catch (error) {
        console.error('Failed to upload study configuration:', error);
        throw error;
    }
}


/**
 * Updates the study configuration in the database.
 * We keep this wrapper to keep compatibility between the application and the API
 *
 * @param {Object} study - The study object containing the updated configuration.
 * @param {string} study.id - The ID of the study.
 * @param {boolean} study.enabled - The new enabled status of the study.
 * @param {number} study.lastModifiedTime - The last modified time of the study as a Unix timestamp.
 * @return {Promise<void>} - A promise that resolves when the study configuration is updated successfully or rejects with an error.
 * @throws {Error} Throws an error if the study object is missing required properties.
 */
export async function updateStudyConfiguration(study) {
    try {
        await DatabaseAPI.updateStudyEnabled(study);
    } catch (error) {
        console.error('Failed to upload study configuration:', error);
        throw error;
    }
}


/**
 * This function uploads all images to storage.
 * The images paths are where they get stored, and the images are the files themselves.
 * @param {Object} imageDict - contains paths as keys and images as values to be uploaded.
 * @param {function} progressFn - this function will be called periodically for intermediate images with the number of
 * images uploaded and total number of images.
 * @return {Promise<void>} returns a Promise that will complete when all images have been successfully uploaded.
 */
export function uploadImagesToStorage(imageDict, progressFn) {
    // A new Promise - Resolved when all the images are uploaded. Rejected if there's an error in any of the uploads.
    return new Promise((resolve, reject) => {
        // Create a progress object to keep track of the number of images uploaded, started, errored, etc...
        const progress = {
            uploaded: 0,
            started: 0,
            errored: false,
            allStarted: false
        };

        const tasks = [];  // Array to keep track of all upload tasks.

        for (let path in imageDict) {
            // Continue if the path is not a property of imageDict i.e., it's an inherited property.
            if (!imageDict.hasOwnProperty(path))
                continue;
            const image = imageDict[path];

            /* Each image is uploaded by making a call to insertImageB64 method of DatabaseAPI.
               It returns a promise that is stored in the tasks array. */
            const task = DatabaseAPI.insertImageB64(image, path);

            task.then(() => {
                // If upload is successful, increment the number of uploaded images.
                progress.uploaded += 1;

                /* If all images have been started (all upload promises created) and no error occurred yet,
                   check if all images were uploaded. If yes, resolve the Promise, else call the progressFn. */
                if (progress.allStarted && !progress.errored) {
                    if (progress.uploaded === progress.started) {
                        resolve();
                    } else {
                        progressFn(progress.uploaded, progress.started);
                    }
                }
            }).catch((error) => {  // If there is an error in the upload.
                console.error(`Error uploading ${path}:`, error);
                try {
                    console.error(error);
                    progress.errored = true;  // Set errored to true if an error occurred.
                    // If any upload errors, cancel all other uploads.
                    for (let index = 0; index < tasks.length; ++index) {
                        tasks[index].cancel();
                    }
                } finally {
                    reject(error);   // Reject the Promise with the error.
                }
            });
            tasks.push(task);    // The Promise from the upload is added to tasks array.
            progress.started += 1;   // We count on more new upload to the tasks.
        }

        /* If the hostname is localhost, ignore any promises that did not call their then method.
           Else, if all uploads were successful, resolve the Promise. Then set allStarted to true. */
        if (window.location.hostname === "localhost") {
            resolve();
        } else if (progress.uploaded === progress.started) {
            resolve();
        } else {
            progress.allStarted = true;
        }
    });
}


/**
 * Posts the results of a game to the DatabaseAPI.
 * We keep this wrapper to keep compatibility between the application and the API
 *
 * @param {string} study - The study identifier.
 * @param {Object} game - The game object containing the results.
 * @returns {Promise<void>} - A promise that resolves when the results are uploaded to the database.
 */
export async function postResults(study, game) {
    try {
        console.log("Posting results for study:", study);
        const resultsJson = game.toJSON();
        console.log('resultsJSON:', resultsJson);
        await DatabaseAPI.uploadResults(study, resultsJson);
    } catch (error) {
        console.error('Failed to post results:', error);
        throw error;
    }
}

