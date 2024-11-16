import {BrokenStudy, Study} from "../models/study";
import {StudyImage} from "../models/images"
import {API_URLS} from "../constants/API_URLS";
import {downloadResults} from "../models/resultsExcelWriter";
import {NotificationType, notifyUser} from "./notificationService";
import {Game} from "../models/game/game";


/**
 * Queries a study from the database based on the given study ID.
 *
 * @param {string} studyID - The ID of the study to query.
 * @returns {Promise<Object>} A promise that resolves to the queried study object.
 * @throws {Error} If the query fails or encounters an error.
 */
export function getStudy(
    studyID: string
): Promise<Study | BrokenStudy> {
    return fetch(
        API_URLS["QUERY_STUDY_URL"] + studyID
    ).then(async response => {
        if (!response.ok)
            throw new Error("Invalid study id.");

        return extractStudyFromJson(
            studyID,
            await response.json()
        );
    })
}


/**
 * Queries all studies from the API.
 *
 * @returns {Promise<Array<Object>>} The list of studies found in the database.
 */
export function getAllStudies(): Promise<Array<Study | BrokenStudy>> {
    return fetch(
        API_URLS["QUERY_ALL_STUDIES_URL"]
    ).then(async (response: Response) => {
        if (!response.ok)
            throw new Error(`Failed to retrieve all studies. Status: ${response.status}`);

        // Convert json response to Study objects.
        return (await response.json()).map((study) => extractStudyFromJson(study.id, study));
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
    const snapshot = await getAllResultsForStudy(study.id);

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


async function getAllResultsForStudy(studyId: Study | BrokenStudy) {
    const response = await fetch(
        `${API_URLS["GET_RESULTS_URL"]}/${studyId}`,
        {
            method: "POST"
        }
    );
    return response.json();
}


/**
 * Insert a study into the database.
 *
 * @return {Promise} - A promise that resolves when the study has been successfully inserted.
 *                     The resolved value is not defined.
 * @throws {Error} - If the insertion of the study fails.
 * @param study
 */
export function uploadStudyConfiguration(
    study: Study
): Promise<Response> {
    const requestOptions: RequestInit = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(study.toJSON()),
        redirect: "follow",
    };

    return fetch(
        API_URLS["INSERT_STUDY_URL"],
        requestOptions
    ).then(response => {
        if (!response.ok)
            throw new Error(`Failed to upload study. Status: ${response.status}`);
        return response
    });
}

/**
 * This function uploads all images to storage.
 * The images paths are where they get stored, and the images are the files themselves.
 * @param {Object} imageDict - contains paths as keys and images as values to be uploaded.
 * @return {Promise<void>} returns a Promise that will complete when all images have been successfully uploaded.
 */
export function uploadImagesToStorage(
    imageDict: { path: string; image: StudyImage }[]
): Promise<Response[]> {
    // A new Promise - Resolved when all the images are uploaded. Rejected if there's an error in any of the uploads.
    return Promise.all(
        imageDict.map(({image, path}) => uploadImage(image, path))
    );
}


/**
 * Inserts an image into the database using base64 encoded image data.
 *
 * @param {StudyImage} image - The image data to insert, encoded as a Buffer object.
 * @param {string} path - The path where the image should be stored in the database.
 *
 * @return {Promise} - A promise that resolves with the result of the insert operation. It can be a string or an error object.
 *
 * @throws {Error} - If there is an error while inserting the image.
 */
function uploadImage(
    image: StudyImage,
    path: string
): Promise<Response> {
    return fetch(
        API_URLS["UPLOAD_IMAGE_URL"],
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                path: path,
                image_data: image.buffer.toString("base64"),
            }),
            redirect: "follow",
        }
    ).then(response => {
        if (!response.ok)
            throw new Error(`Failed to upload study image. Status: ${response.status}`);
        return response
    });
}


/**
 * Updates the enabled status of a study in the database.
 *
 * @param {{id: string, enabled: boolean, lastModifiedTime: number}} study - The study object to be updated.
 * @param {string} study.id - The ID of the study. Must be a string.
 * @param {boolean} study.enabled - The new enabled status of the study.
 * @param {Date} study.lastModifiedTime - The last modified time of the study. Must be a Date object.
 * @throws {Error} Throws an error if the study ID is not a string or if lastModifiedTime is not a Date object.
 * @returns {Promise<void>} A promise that resolves when the update is successful.
 */
export function enableStudy(study: Study): Promise<Response> {
    return fetch(
        API_URLS["UPDATE_STUDY_ENABLED_URL"],
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: study.id,
                enabled: study.enabled,
                last_modified_time: study.lastModifiedTime,
            }),
        }
    ).then(response => {
        if (!response.ok) throw new Error(`Failed to update study. Status: ${response.status}`);
        return response
    })
}

export function deleteStudy(
    study: Study | BrokenStudy
): Promise<Response> {
    const requestOptions: RequestInit = {
        method: "DELETE",
        redirect: "follow",
    };

    return fetch(
        `${API_URLS["REMOVE_STUDY_URL"]}/${study.id}`,
        requestOptions
    ).then((response) => {
        if (!response.ok) throw new Error("Study deletion failed.");
        return response
    });
}

export function downloadStudyResultsToFile(study: Study | BrokenStudy) {
    downloadResults(study)
        .then(response => {
            notifyUser(
                "Download of study started.",
                NotificationType.SUCCESS
            )
        }).catch((error) => {
        console.error(error);
        notifyUser(
            "Error downloading results",
            NotificationType.ERROR
        )
    });
}


/**
 * Creates a Study object from JSON or a BrokenStudy object if an error occurs.
 *
 * @param {string} studyID - The ID of the study.
 * @param {Object} json - The JSON representing the study.
 * @returns {Study|BrokenStudy} - The Study object if created successfully, otherwise a BrokenStudy object.
 */
function extractStudyFromJson(
    studyID: String,
    json: {
        lastModifiedTime: number,
        sources: [],
        uiSettings: any,
        authorID: string,
        version: 1,
        posts: [],
        enabled: boolean,
        authorName: string,
        basicSettings: any,
        advancedSettings: any,
        sourcePostSelectionMethod: any,
        id: string,
        pagesSettings: any
    }
): Study | BrokenStudy {
    try {
        return Study.fromJSON(studyID, json);
    } catch (e) {
        console.error(
            `Failed to create Study object from JSON for ID ${studyID}:`,
            e
        );
        return BrokenStudy.fromJSON(studyID, json, e.message);
    }
}