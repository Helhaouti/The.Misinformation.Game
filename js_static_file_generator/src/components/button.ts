import {createElement} from "../utils/domElement";

// Enum-like object for button types
export enum ButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    DANGER = 'danger'
}


export function createButton(
    buttonType: ButtonType,
    innerText: string,
    onClickFunction?: Function,
    attributes?: any
) {
    return createElement(
        "button",
        Object.assign({
            onclick: onClickFunction,
            innerText: innerText,
            className: `
            mt-4 px-6 py-2 ${getButtonClass(buttonType)} text-white font-medium text-sm uppercase 
            rounded-lg shadow-md focus:outline-none focus:ring-2 
            focus:ring-opacity-50 transition duration-150 ease-in-out
            `,
        }, attributes)
    )
}

function getButtonClass(type: ButtonType) {
    switch (type) {
        case ButtonType.PRIMARY:
            return "bg-blue-500 hover:bg-blue-700 focus:ring-blue-500";
        case ButtonType.SECONDARY:
            return "bg-gray-500 hover:bg-gray-700 focus:ring-gray-500";
        case ButtonType.SUCCESS:
            return "bg-green-500 hover:bg-green-700 focus:ring-green-500";
        case ButtonType.DANGER:
            return "bg-red-500 hover:bg-red-700 focus:ring-red-500";
        default:
            return "bg-blue-500 hover:bg-blue-700 focus:ring-blue-500";
    }
}
