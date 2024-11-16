import {createStudySummaryElement} from "../components/studySummary";
import {getAllStudies} from "../services/studyApiService";


window.addEventListener("load", loadStudySummaries);

/**
 * Downloads all studies and attaches a summary components of them in the overview.
 */
function loadStudySummaries() {
    // Query all studies from the database
    getAllStudies()
        .then((studies) => {
            // Get the container where the study summaries will be attached
            const container = document.getElementById("study-overview-container");

            // Iterate over the studies and append study summaries before the old content in the overview.
            studies.forEach((study) => container.appendChild(createStudySummaryElement(study)));
        })
        .catch((error) => {
            console.error("Error loading study summaries:", error);
            alert("Error loading study summaries. Please try again later.");
        });
}