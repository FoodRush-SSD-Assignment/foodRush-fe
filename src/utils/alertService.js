import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Custom SweetAlert styling to match app theme
const customStyling = {
  confirmButtonColor: "#C83C3C", // Primary app color
  cancelButtonColor: "#6B7280", // Gray color for cancel
  popup: "rounded-lg",
  title: "font-bold text-gray-800",
  htmlContainer: "text-gray-600",
};

// Success alert with app styling
export const showSuccess = (title, text) => {
  MySwal.fire({
    icon: "success",
    iconColor: "#4BB543", // Keep success icon green
    title,
    text,
    timer: 1000,
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
      popup: customStyling.popup,
      title: customStyling.title,
      htmlContainer: customStyling.htmlContainer,
    },
  });
};

// Error alert with app styling
export const showError = (title, text) => {
  MySwal.fire({
    icon: "error",
    iconColor: "#C83C3C", // Match primary color for error icon
    title,
    text,
    confirmButtonColor: customStyling.confirmButtonColor,
    customClass: {
      popup: customStyling.popup,
      title: customStyling.title,
      htmlContainer: customStyling.htmlContainer,
      confirmButton: "font-semibold",
    },
  });
};

// Confirmation alert with app styling
export const showConfirmation = async (title, text) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: "warning",
    iconColor: "#F59E0B", // Amber color for warning
    showCancelButton: true,
    confirmButtonColor: customStyling.confirmButtonColor,
    cancelButtonColor: customStyling.cancelButtonColor,
    confirmButtonText: "Yes!",
    customClass: {
      popup: customStyling.popup,
      title: customStyling.title,
      htmlContainer: customStyling.htmlContainer,
      confirmButton: "font-semibold",
      cancelButton: "font-medium",
    },
    buttonsStyling: true,
  });

  return result.isConfirmed;
};

// Loading alert with app styling
export const showLoading = (title = "Loading...") => {
  MySwal.fire({
    title,
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: customStyling.popup,
      title: customStyling.title,
      htmlContainer: customStyling.htmlContainer,
    },
    // Apply red color to the loading spinner
    didRender: (popup) => {
      try {
        const spinnerColor = "#C83C3C";
        const spinner = popup.querySelector(".swal2-loader");
        if (spinner) {
          spinner.style.borderLeftColor = spinnerColor;
        }
      } catch (e) {
        console.error("Error styling loader:", e);
      }
    },
  });
};

// Close any active alert
export const closeAlert = () => {
  Swal.close();
};
