import { BrokenStudy, Study } from "../model/study";

// noinspection ExceptionCaughtLocallyJS
/**
 * Provides methods to interact with the database's API.
 */
export class DatabaseAPI {
  static BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

    /**
     * Object containing URLs for API endpoints.
     *
     * @type {Object}
     * @property {string} QUERY_STUDY_URL - URL for querying a study from the database.
     * @property {string} QUERY_ALL_STUDIES_URL - URL for querying all studies from the database.
     * @property {string} INSERT_STUDY_URL - URL for inserting a new study into the database.
     * @property {string} UPLOAD_IMAGE_URL - URL for uploading study images in base64 format to the database.
     * @property {string} UPLOAD_RESULTS_URL - URL for uploading study results to the database.
     * @property {string} GET_RESULTS_URL - URL for getting all study results from the database.
     * @property {string} UPDATE_STUDY_ENABLED_URL - URL for updating the enabled status of a study in the database.
     */
    static API_URLS = {
        QUERY_STUDY_URL: `${DatabaseAPI.BASE_URL}/study/get/`,
        QUERY_ALL_STUDIES_URL: `${DatabaseAPI.BASE_URL}/study/all`,
        INSERT_STUDY_URL: `${DatabaseAPI.BASE_URL}/study/upload`,
        UPLOAD_IMAGE_URL: `${DatabaseAPI.BASE_URL}/study/upload-base64-image`,
        UPLOAD_RESULTS_URL: `${DatabaseAPI.BASE_URL}/result/upload`,
        GET_RESULTS_URL: `${DatabaseAPI.BASE_URL}/result/get_all`,
        UPDATE_STUDY_ENABLED_URL: `${DatabaseAPI.BASE_URL}/study/enable`,
        DELETE_STUDY_URL: `${DatabaseAPI.BASE_URL}/study/delete`,
    };

  /**
   * Fetches JSON data from the given URL.
   *
   * @param {string} url - The URL to fetch JSON data from.
   * @return {Promise} - A promise that resolves with the fetched JSON data or rejects with an error.
   * @throws {Error} - An error is thrown if the network response was not ok or if there was an error fetching JSON.
   */
  static async fetchJsonData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch JSON from ${url}:`, error);
      throw error;
    }
  }

  /**
   * Creates a Study object from JSON or a BrokenStudy object if an error occurs.
   *
   * @param {string} studyID - The ID of the study.
   * @param {Object} json - The JSON representing the study.
   * @returns {Study|BrokenStudy} - The Study object if created successfully, otherwise a BrokenStudy object.
   */
  static studyOrBrokenFromJson(studyID, json) {
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

  /**
   * Queries a study from the database based on the given study ID.
   *
   * @param {string} studyID - The ID of the study to query.
   * @returns {Promise<Object>} A promise that resolves to the queried study object.
   * @throws {Error} If the query fails or encounters an error.
   */
  static async queryStudy(studyID) {
    try {
      const study = await DatabaseAPI.fetchJsonData(
        DatabaseAPI.API_URLS.QUERY_STUDY_URL + studyID
      );
      return DatabaseAPI.studyOrBrokenFromJson(studyID, study);
    } catch (error) {
      console.error(`Failed to query study ${studyID}:`, error);
      throw error;
    }
  }

  /**
   * Queries all studies from the API.
   *
   * @param {Object} user - The user object.
   * @throws {Error} If no user object is provided.
   * @returns {Promise<Array<Object>>} The list of studies found in the database.
   * @throws {Error} If an error occurred while querying the studies.
   */
  static async queryAllStudies(user) {
    if (!user) {
      throw new Error("No user provided");
    }

    try {
      const studies = await DatabaseAPI.fetchJsonData(
        DatabaseAPI.API_URLS.QUERY_ALL_STUDIES_URL
      );
      return studies.map((study) =>
        DatabaseAPI.studyOrBrokenFromJson(study.id, study)
      );
    } catch (error) {
      console.error("Failed to query all studies:", error);
      throw error;
    }
  }

  /**
   * Insert a study into the database.
   *
   * @param {object} json_study - The study object to be inserted formatted in JSON.
   * @return {Promise} - A promise that resolves when the study has been successfully inserted.
   *                     The resolved value is not defined.
   * @throws {Error} - If the insertion of the study fails.
   */
  static async insertStudy(json_study) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_study),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        DatabaseAPI.API_URLS.INSERT_STUDY_URL,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to insert study. Status: ${response.status}`);
      }
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error("Failed to insert study:", error);
      throw error;
    }
  }

    /**
     * Inserts an image into the database using base64 encoded image data.
     *
     * @param {Buffer} image - The image data to insert, encoded as a Buffer object.
     * @param {string} path - The path where the image should be stored in the database.
     *
     * @return {Promise} - A promise that resolves with the result of the insert operation. It can be a string or an error object.
     *
     * @throws {Error} - If there is an error while inserting the image.
     */
    static async insertImageB64(image, path) {
        console.log(`Creating an insertion promise image: ${path}`);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      path: path,
      image_data: image.buffer.toString("base64"),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(DatabaseAPI.API_URLS.UPLOAD_IMAGE_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  /**
   * Uploads the results of a game to the database.
   *
   * @param {string} study - The ID of the study.
   * @param {Object} game_json - The JSON object representing the game results.
   * @return {Promise} A Promise that resolves with the upload result or rejects with an error.
   */
  static async uploadResults(study, game_json) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(game_json);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return await fetch(DatabaseAPI.API_URLS.UPLOAD_RESULTS_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
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
  static async updateStudyEnabled(study) {
    if (
      !study ||
      typeof study.id !== "string" ||
      typeof study.enabled !== "boolean" ||
      typeof study.lastModifiedTime !== "number"
    ) {
      throw new Error(
        "Invalid study object. Ensure it has id (string), enabled (boolean), and lastModifiedTime (number)."
      );
    }

    const requestBody = {
      id: study.id,
      enabled: study.enabled,
      last_modified_time: study.lastModifiedTime,
    };
    const body = JSON.stringify(requestBody);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    };

    try {
      const response = await fetch(
        DatabaseAPI.API_URLS.UPDATE_STUDY_ENABLED_URL,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to update study. Status: ${response.status}`);
      }
      console.log("Result: ", await response.text());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches all results for a given study ID from the database API.
   *
   * @param {number} study_id - The ID of the study for which results are to be fetched.
   * @return {Promise} - A promise that resolves with the fetched results.
   */
  static async get_all_results_for_study(study_id) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

        try {
            const response = await fetch(
                `${DatabaseAPI.API_URLS.GET_RESULTS_URL}/${study_id}`,
                requestOptions
            );
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes the study with the given study_id from the database.
     *
     * @param {String} study_id - The ID of the study to be deleted.
     * @returns {Promise} - A promise that resolves if the study is successfully deleted,
     * otherwise rejects with the response object.
     */
    static async delete_study(study_id) {
        return new Promise((resolve, reject) => {

            const requestOptions = {
                method: "DELETE",
                redirect: "follow"
            };

            fetch(`${DatabaseAPI.API_URLS.DELETE_STUDY_URL}/${study_id}`, requestOptions)
                .then(async (response) => {
                    if (response.ok) {
                        const responseBody = await response.json();
                        resolve(responseBody);  // Resolve with the parsed response
                    } else {
                        const errorBody = await response.json();
                        reject(errorBody);  // Reject with the parsed error
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);  // Reject with the caught error
                });
        });
    }
}