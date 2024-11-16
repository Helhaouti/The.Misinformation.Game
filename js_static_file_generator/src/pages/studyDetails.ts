import {getStudy} from "../services/studyApiService";
import {NotificationType, notifyUser} from "../services/notificationService";
import {createStudyDetailsComponents} from "../components/studyDetails";

window.addEventListener("load", loadStudyDetails);


function loadStudyDetails() {
    let currentStudyId = window.location.pathname.split("/").pop()

    getStudy(currentStudyId)
        .then(study =>
            document.getElementById("study-info-container").append(...createStudyDetailsComponents(study))
        )
        .catch(error => {
            console.error("Error loading study details:", error);
            notifyUser(
                "Error loading study details. Invalid study id or unavailable server. Please try again later.",
                NotificationType.ERROR
            );
        });
}
