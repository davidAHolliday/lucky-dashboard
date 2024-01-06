
export function formatDate(inputDate) {
    // Create a new Date object from the input string
    const date = new Date(inputDate);

    // Extract day, month, and year components from the Date object
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if the day is a single digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = date.getFullYear();

    // Format the components into dd/mm/yyyy format
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}


// export const baseUrl = "https://dashboard-advance-task-manager.wm.r.appspot.com"

export const baseUrl = "http://localhost:8080"
   
