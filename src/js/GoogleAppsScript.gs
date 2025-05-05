function doPost(e) {
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "No parameters provided." })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  try {
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Responses");
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet("Responses");
      // Add headers
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Company",
        "Mobile",
        "Website",
        "Location",
        "Amount",
        "Support Type",
        "Message"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
    }

    // Validate and sanitize input data
    const data = validateAndSanitizeData(e.parameter, e.parameters);
    
    // Append to Google Sheet
    sheet.appendRow([
      new Date(),        // Timestamp
      data.fullName,
      data.email,
      data.company,
      data.mobile,
      data.website,
      data.location,
      data.amount,
      data.supportType,
      data.message
    ]);

    // Auto-resize columns
    sheet.autoResizeColumns(1, 10);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Form submitted successfully!"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log detailed error information
    console.error("Error occurred:", error);
    console.error("Stack trace:", error.stack);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "An error occurred while processing your request.",
        details: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function validateAndSanitizeData(params, allParams) {
  // Required fields
  const requiredFields = ['fullName', 'email', 'company'];
  const missingFields = requiredFields.filter(field => !params[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('Invalid email format');
  }

  // Phone number validation (if provided)
  if (params.mobile && !/^\+91\d{10}$/.test(params.mobile)) {
    throw new Error('Invalid phone number format. Please use +91XXXXXXXXXX');
  }

  // Website validation (if provided)
  if (params.website && !/^https?:\/\/.+/.test(params.website)) {
    throw new Error('Invalid website URL. Please include http:// or https://');
  }

  // Donation amount validation (if provided)
  if (params.amount && (!/^\d+$/.test(params.amount) || parseInt(params.amount) <= 0)) {
    throw new Error('Invalid donation amount. Please enter a positive number.');
  }

  // Handle support type (multiple values)
  let supportType = allParams && allParams.supportType;
  if (Array.isArray(supportType)) {
    supportType = supportType.join(", ");
  } else if (!supportType) {
    supportType = "None selected";
  }

  // Sanitize and return data
  return {
    fullName: params.fullName.trim(),
    email: params.email.trim().toLowerCase(),
    company: params.company.trim(),
    mobile: params.mobile ? params.mobile.trim() : "N/A",
    website: params.website ? params.website.trim() : "N/A",
    location: params.location ? params.location.trim() : "N/A",
    amount: params.amount ? params.amount.trim() : "N/A",
    supportType: supportType,
    message: params.message ? params.message.trim() : "N/A"
  };
}

// Helper function to test the script
function testFormSubmission() {
  const testData = {
    fullName: "Test User",
    email: "test@example.com",
    company: "Test Company",
    mobile: "+911234567890",
    website: "https://example.com",
    location: "Test Location",
    amount: "1000",
    supportType: ["Financial", "In-Kind"],
    message: "Test message"
  };

  const response = doPost({
    parameter: testData
  });

  console.log(response.getContent());
}
