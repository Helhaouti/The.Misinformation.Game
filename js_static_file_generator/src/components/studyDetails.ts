import { BrokenStudy, Study } from "../models/study";
import { createElement } from "../utils/domElement";
import { createDateFromUnixEpochTimeSeconds } from "../utils/time";
import { ButtonType, createButton } from "./button";
import { deleteStudy, downloadStudyResultsToFile, enableStudy } from "../services/studyApiService";
import { NotificationType, notifyUser } from "../services/notificationService";
import { Modal } from "flowbite"

export function createStudyDetailsComponents(study: Study | BrokenStudy): HTMLElement[] {
    let components: HTMLElement[] = [];

    components.push(createElement("h1",
        {
            className: "block font-semibold text-4xl mb-6",
            innerText: study instanceof Study ? study.basicSettings.name : study.name,
        }
    ));

    if (study instanceof Study) {
        components.push(createElement(
            "p",
            { className: "mt-2" },
            createElement("b", { innerText: "Study ID: " }),
            createElement(
                "a",
                {
                    className: "text-blue-500 underline",
                    innerText: study.id
                }
            ),
        ));
        components.push(createElement(
            "p",
            { className: "mt-2" },
            createElement("b", { innerText: "Enabled: " }),
            createElement("a", {
                innerText: study.enabled
                    ? "Yes, the study is enabled."
                    : "No, the study is disabled."
            }),
        ));
    }
    let lastModified: Date = createDateFromUnixEpochTimeSeconds(study.lastModifiedTime);
    components.push(createElement(
        "p",
        { className: "mt-2" },
        createElement("b", { innerText: "Last Modified: " }),
        createElement("a", {
            innerText: `${lastModified.toLocaleString("en-US", { weekday: "long" })}, ${lastModified.toLocaleString()}`
        }),
    ));
    components.push(createElement(
        "p",
        { className: "mt-2" },
        createElement("b", { innerText: "Actions: " }),
    ));

    if (study instanceof Study) components.push(createButton(
        ButtonType.PRIMARY,
        "Enable Study",
        () => enableStudy(study)
            .then(_ => notifyUser(
                "Enabling study complete.",
                NotificationType.SUCCESS
            ))
            .catch(err => notifyUser(
                err.message,
                NotificationType.ERROR
            ))
    ));
    components.push(createButton(
        ButtonType.PRIMARY,
        "Download results",
        () => downloadStudyResultsToFile(study)
    ));
    components.push(createButton(
        ButtonType.PRIMARY,
        "Update study",
        () => new Modal(document.getElementById("upload-modal")).show()
    ));
    components.push(createButton(
        ButtonType.PRIMARY,
        "Delete study",
        () => deleteStudy(study)
            .then(response => {
                notifyUser(
                    "Deleting study complete.",
                    NotificationType.SUCCESS
                )
                window.location.href = "/dash/studies/"
            })
            .catch(err => notifyUser(
                err.message,
                NotificationType.ERROR
            ))
    ));

    return components
}