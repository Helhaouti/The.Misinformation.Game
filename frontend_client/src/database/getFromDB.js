import {StudyImage} from "../model/images";
import {Game} from "../model/game/game";
// import {decompressJson} from "./compressJson";
import {retryPromiseOperation} from "../utils/promises";
import {getDownloadURL, ref} from "firebase/storage";
import {DatabaseAPI} from "./DatabaseAPI";


export async function readStudySettings(studyID) {
     // Replacing endpoint
    return await DatabaseAPI.queryStudy(studyID)
}

/**
 * TODO : In the future, it may be good to use pages, as if the number of studies
 *        becomes really large, this will become very costly.
 */
export async function readAllStudies(user) {
    if (!user)
        throw new Error("No user provided");

    return await DatabaseAPI.queryAllStudies(user);
}

/**
 * Returns a Promise with whether the current user is an admin.
 */
export async function readIsAdmin(user) {
    if (!user)
        throw new Error("No user provided");

    return true;
}

function getStudyImagePathType(path) {
    const pieces = path.split(".");
    if (pieces.length === 1)
        throw new Error("Path is missing its extension");

    return pieces[pieces.length - 1];
}

/**
 * Reads the study image from the given path.
 *
 * @param {string} path - The path of the study image to be read.
 * @returns {Promise} A promise that resolves with the study image data, or null if there was an error.
 */
export function readStudyImage(path) {

    return retryPromiseOperation(
        () => readStudyImageFromURL(path), 1000, 1 )
        .catch((e) => {
            console.error("Failed to read study image:", e);
            return null;
        });
}

/**
 * Reads a study image from the given URL that point to an Azure Blob Storage hosted images.
 * Ensure that the CORS for the Blob accept the connection, and that the Access Level is set to Anonymous access.
 * @reworked function for integrating with Azure.
 *
 * @param {string} url - The URL of the study image in Azure Blob Storage.
 * @returns {Promise<StudyImage>} A promise that resolves with a StudyImage object representing the loaded image.
 * @throws {Error} If there is an error loading the study image.
 */
async function readStudyImageFromURL(url) {
    // Define request options for the fetch call
    const requestOptions = {
        method: "GET"
    };

    // Determine the image type from the path
    const type = getStudyImagePathType(url);

    try {
        // Fetch the image from the given URL
        const response = await fetch(url, requestOptions);

        console.log(`Fetch image on: ${url} with status ${response.status}`);
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${url}. Status: ${response.status}`);
        }

        // Read the response as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Convert the ArrayBuffer to a Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);

        // Create and return a StudyImage instance
        return new StudyImage(uint8Array, type);
    } catch (error) {
        // Throw an error if there is an issue loading the image
        throw new Error(`Error loading study image from URL: ${error.message}`);
    }
}

/**
 * Reads a study image from the given path.
 *
 * @param {string} path - The path of the study image.
 * @returns {Promise<StudyImage>} A promise that resolves with a StudyImage object representing the loaded image.
 * @throws {Error} If there is an error loading the study image.
 */
async function readStudyImageInternal(path) {
    return readStudyImageFromURL(path);

    const type = getStudyImagePathType(path);

    return new Promise((resolve, reject) => {
        getDownloadURL(ref(path))
            .then((url) => {
                const request = new XMLHttpRequest();
                // Long timeout as we really don't want to hammer the backend.
                request.timeout = 8000;
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.onload = () => {
                    const response = request.response;
                    if (response) {
                        resolve(new StudyImage(new Uint8Array(response), type));
                    } else {
                        reject(new Error("Missing response when loading StudyImage from " + path));
                    }
                };

                const makeErrorListener = (errorDesc) => {
                    return () => {
                        reject(new Error(
                            errorDesc + " StudyImage from " + path +
                            (request.status ? " (" + request.status + ")" : "") +
                            (request.statusText ? ": " + request.statusText : "")
                        ));
                    };
                };
                request.onerror = makeErrorListener("Could not load");
                request.onabort = makeErrorListener("Aborted while loading");
                request.ontimeout = makeErrorListener("Timed out while loading");
                request.send(null);
            })
            .catch((reason) => {
                if (reason.code === "storage/object-not-found") {
                    console.error(reason);
                    const err = new Error("Image not found.");
                    reject(err);
                    return;
                }
                console.error("Error loading study image:", reason);
                // reject(reason);
            });
    });
}


/**
 * Retrieves all completed study results for a given study.
 *
 * @param {Object} study - The study object representing a study in the application.
 * @param {Object} problems - An object to store any problems that have been found when fetching the completed study results.
 * @return {Array} - Returns an array of completed study results (games), for the given study.
 */
export async function readAllCompletedStudyResults(study, problems) {
    // Retrieve all results for the given study.
    const snapshot = await DatabaseAPI.get_all_results_for_study(study.id);

    // Initialize an array to store the results (games).
    const games = [];

    // Iterate through the fetched results.
    snapshot['data'].forEach((element) => {
        try {
            // Attempt to create a game object from the JSON element and add it to the games array.
            games.push(Game.fromJSON(element, study));
        } catch (err) {
            // If an error is encountered when creating a Game object...
            // the error is logged and the problematic element is added to the problems object.
            let participantID;
            try {
                // Try to retrieve the participant ID from the element.
                participantID = element["participant"]["participantID"];
            } catch (err) {
                participantID = null;
            }

            // Add the problematic element's ID, participant ID and error message to the problems object.
            problems[element.id] = {
                participantID: participantID,
                error: err.message
            };
            // Log the error.
            console.error(err);
        }
    })
    // Return the array of games, which are the completed study results.
    return games;
}
