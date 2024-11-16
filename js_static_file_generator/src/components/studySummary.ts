import {createElement} from "../utils/domElement"
import {BrokenStudy, Study} from "../models/study";
import {ButtonType, createButton} from "./button";

/**
 * Generates an HTML representation of a study summary.
 * @param {Object} study - The study object.
 * @param {string} study.id - The unique identifier for the study.
 * @param {boolean} study.enabled - A flag indicating whether the study is enabled.
 * @param {Object} study.basicSettings - Basic settings for the study.
 * @param {string} study.basicSettings.name - The name of the study.
 * @param {string} study.basicSettings.description - The description of the study (can contain HTML).
 * @param {string} [study.error] - Error message if the study is broken.
 * @returns {HTMLElement} A DOM element representing the study summary, which can be appended to the DOM.
 */
export function createStudySummaryElement(
    study: Study | BrokenStudy
): HTMLElement {
    let containerWrapper = createElement("div", {
        className: `w-full p-4 md:w-1/2 lg:w-1/3`
    });

    let container = createElement("div", {
        className: `bg-white shadow-lg rounded-lg overflow-hidden ${
            study instanceof BrokenStudy ?
                "border-red-800"
                : study.enabled
                    ? "border-green-600"
                    : "border-gray-400"
        } p-6 text-center`
    });

    // Add enabled indicator if the study is enabled
    if (study instanceof Study && study.enabled) container.appendChild(
        createElement("span", {
            className: "inline-block w-3.5 h-3.5 mr-2 bg-green-500 rounded-full",
            title: "Study is Enabled",
        })
    );

    if (study instanceof Study) {
        container.appendChild(createElement(
            "h5",
            {
                innerText: study.basicSettings.name,
                className: "text-xl font-medium text-gray-700",
            }
        ));

        container.appendChild(createElement("p", {
            className: "text-gray-600 mt-2",
            innerHTML: study.basicSettings.description,
        }));
    }

    if (study instanceof BrokenStudy) containerWrapper.appendChild(createElement(
        "div",
        {className: "mt-3"},
        createElement("b", {}, "This study is broken: "),
        study.error
    ));

    container.appendChild(createButton(
        ButtonType.PRIMARY,
        "details",
        () => location.href = `/dash/studies/${study.id}`)
    );

    containerWrapper.appendChild(container);

    return containerWrapper;
}