import Toastify from "toastify-js";

export enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error"
}

export function notifyUser(
    text: string,
    state: NotificationType,
    onclick?: () => void
): void {
    const toast = Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            "backgroundColor": getBackgroundColor(state),
        },
        className: `toast-${state}`,
        stopOnFocus: true,
        onClick: onclick
    });
    toast.showToast();
}

function getBackgroundColor(state: NotificationType): string {
    switch (state) {
        case NotificationType.SUCCESS:
            return "#28a745"; // Shade of Green
        case NotificationType.WARNING:
            return "#ffc107"; // Shade of Yellow
        case NotificationType.INFO:
            return "#17a2b8"; // Shade of Blue
        case NotificationType.ERROR:
            return "#dc3545"; // Shade of Red
        default:
            return "#6c757d"; // Shade of Grey
    }
}
