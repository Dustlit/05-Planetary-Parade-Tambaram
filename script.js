document.addEventListener("DOMContentLoaded", () => {
    const attendeesInput = document.getElementById("attendees");
    const kidsInput = document.getElementById("kids");
    const amountDisplay = document.getElementById("amount");
    const submitButton = document.getElementById("submitButton");

    const originalPrice = 500;
    const kidsPrice = 100;

    const calculateAmount = () => {
        const attendees = parseInt(attendeesInput.value) || 0;
        const kids = parseInt(kidsInput.value) || 0;
        const totalAmount = attendees * originalPrice + kids * kidsPrice;
        amountDisplay.textContent = `Total Amount: ₹${totalAmount.toFixed(2)}`;
    };

    attendeesInput.addEventListener("input", calculateAmount);
    kidsInput.addEventListener("input", calculateAmount);

    const registrationForm = document.getElementById("registrationForm");
    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const attendees = attendeesInput.value;
        const kids = kidsInput.value;
        const eventDate = document.querySelector('input[name="event_date"]:checked')?.value;

        if (!name || !phone || !attendees || !eventDate) {
            alert("Please fill in all required fields, including selecting an event date.");
            return;
        }

        // Disable the submit button to prevent multiple clicks
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const currentDate = new Date();
        const utcOffsetInMilliseconds = currentDate.getTimezoneOffset() * 60000;
        const istOffsetInMilliseconds = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(currentDate.getTime() + utcOffsetInMilliseconds + istOffsetInMilliseconds);

        const formData = {
            name,
            phone,
            attendees,
            kids,
            event_date: eventDate,
            timestamp: istDate.toISOString(),
            submission_date: istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        };

        // Calculate total amount
        const totalAmount = (parseInt(attendees) * originalPrice) + (parseInt(kids) * kidsPrice);

        // Basic Auth credentials
        const username = "vwf5leqf";
        const password = "zasxz4yg8kuzn3fb5ftz";
        const encodedCredentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch("https://sheetdb.io/api/v1/yn7b1xmpzeztl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${encodedCredentials}`
                },
                body: JSON.stringify({ data: formData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Redirect to thankyou.html with query parameters
const queryParams = new URLSearchParams({
    name: encodeURIComponent(name),
    phone: encodeURIComponent(phone),
    attendees: encodeURIComponent(attendees),
    kids: encodeURIComponent(kids),
    amount: encodeURIComponent(totalAmount),
    event_date: encodeURIComponent(eventDate), // Add event date
    time: encodeURIComponent(istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))
});

window.location.href = `thankyou.html?${queryParams.toString()}`;
        } catch (error) {
            console.error("Error submitting data to SheetDB:", error);
            alert("An error occurred while submitting your data. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        }
    });

    document.querySelectorAll("[id^='copyButton']").forEach((button) => {
        button.addEventListener("click", () => {
            const upiNumberElement = button.previousElementSibling.querySelector("span");
            const upiNumber = upiNumberElement.textContent;

            navigator.clipboard.writeText(upiNumber)
                .then(() => {
                    button.textContent = "Copied";
                    setTimeout(() => {
                        button.textContent = "Copy UPI";
                    }, 3000);
                })
                .catch(err => {
                    console.error("Failed to copy UPI Number:", err);
                });
        });
    });
});