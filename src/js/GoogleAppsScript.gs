function doPost(e) {
  console.log("doPost called with event object:", e);
  
  if (!e) {
    console.error("No event object received");
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "No event object received." })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Log parameters safely
  const params = e.parameter || {};
  const allParams = e.parameters || {};
  
  console.log("Parameters received:", JSON.stringify(params));
  console.log("All parameters received:", JSON.stringify(allParams));
  
  if (Object.keys(params).length === 0) {
    console.error("No parameters provided in the request");
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "No parameters provided." })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const formType = params.formType;
    console.log("Form type:", formType);
    
    if (formType === 'sponsorship') {
      return handleSponsorshipForm(e);
    } else if (formType === 'contact') {
      return handleContactForm(e);
    } else {
      console.error("Invalid form type:", formType);
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Invalid form type." })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error("Error occurred:", error);
    console.error("Stack trace:", error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: "An error occurred while processing your request.",
        details: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleSponsorshipForm(e) {
  // Get the active spreadsheet and sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, "Sponsorship Responses");
  
  // Validate input parameters
  if (!e || !e.parameter) {
    console.error("Sponsorship form: Missing parameters");
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: "Missing form parameters"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Validate and sanitize input data
  const data = validateAndSanitizeSponsorshipData(e.parameter, e.parameters);
  
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

  // Send email notification
  try {
    sendEmailNotification("Sponsorship", data);
  } catch (error) {
    console.error("Error sending email notification:", error);
  }

  // Return success response
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Sponsorship form submitted successfully!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleContactForm(e) {
  // Get the active spreadsheet and sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, "Contact Responses");
  
  // Validate input parameters
  if (!e || !e.parameter) {
    console.error("Contact form: Missing parameters");
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: "Missing form parameters"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Validate and sanitize input data
  const data = validateAndSanitizeContactData(e.parameter, e.parameters);
  
  // Append to Google Sheet
  sheet.appendRow([
    new Date(),        // Timestamp
    data.name,
    data.email,
    data.message
  ]);

  // Auto-resize columns
  sheet.autoResizeColumns(1, 4);

  // Send email notification
  try {
    sendEmailNotification("Contact", data);
  } catch (error) {
    console.error("Error sending email notification:", error);
  }

  // Return success response
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: "Contact form submitted successfully!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(spreadsheet, sheetName) {
  try {
    console.log("Getting or creating sheet:", sheetName);
    console.log("Spreadsheet:", spreadsheet ? spreadsheet.getName() : "No spreadsheet");
    
    if (!spreadsheet) {
      throw new Error("No spreadsheet provided");
    }
    
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.log("Creating new sheet:", sheetName);
      sheet = spreadsheet.insertSheet(sheetName);
      
      if (sheetName === "Sponsorship Responses") {
        // Add headers for sponsorship form
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
      } else if (sheetName === "Contact Responses") {
        // Add headers for contact form
        sheet.appendRow([
          "Timestamp",
          "Name",
          "Email",
          "Message"
        ]);
        // Format headers
        sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
      }
    } else {
      // Sheet exists - check if it has the old structure and update if needed
      console.log("Sheet exists, checking structure...");
      const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      if (sheetName === "Sponsorship Responses") {
        // Check if it has old attachment columns
        if (headerRow.length > 10) {
          console.log("Updating sponsorship sheet structure...");
          // Delete the old attachment columns (columns 11, 12, 13)
          sheet.deleteColumns(11, 3);
          // Update header row
          sheet.getRange(1, 1, 1, 10).setValues([[
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
          ]]);
          sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
        }
      } else if (sheetName === "Contact Responses") {
        // Check if it has old attachment columns
        if (headerRow.length > 4) {
          console.log("Updating contact sheet structure...");
          // Delete the old attachment columns (columns 5, 6, 7)
          sheet.deleteColumns(5, 3);
          // Update header row
          sheet.getRange(1, 1, 1, 4).setValues([[
            "Timestamp",
            "Name",
            "Email",
            "Message"
          ]]);
          sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
        }
      }
    }
    
    console.log("Sheet ready:", sheet.getName());
    return sheet;
    
  } catch (error) {
    console.error("Error in getOrCreateSheet:", error);
    throw error;
  }
}

function sendEmailNotification(formType, data) {
  try {
    const teamEmail = "team.avinya.adypu@gmail.com"; // Your team email
    const subject = `New ${formType} Form Submission - Team Avinya`;
    
    let body = "";
    
    if (formType === "Sponsorship") {
      body = `
🚗 New Sponsorship Form Submission - Team Avinya

📋 Submission Details:
• Name: ${data.fullName}
• Email: ${data.email}
• Company: ${data.company}
• Mobile: ${data.mobile}
• Website: ${data.website || 'N/A'}
• Location: ${data.location || 'N/A'}
• Amount: ${data.amount || 'N/A'}
• Support Type: ${data.supportType}
• Message: ${data.message || 'N/A'}

⏰ Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

🔗 View in Google Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
Team Avinya | Open Throttle Racing Club
ADYPU | Pune, India
      `;
    } else if (formType === "Contact") {
      body = `
📧 New Contact Form Submission - Team Avinya

📋 Submission Details:
• Name: ${data.name}
• Email: ${data.email}
• Message: ${data.message}

⏰ Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

🔗 View in Google Sheet: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

---
Team Avinya | Open Throttle Racing Club
ADYPU | Pune, India
      `;
    }
    
    // Send email
    MailApp.sendEmail({
      to: teamEmail,
      subject: subject,
      body: body
    });
    
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
}

function validateAndSanitizeSponsorshipData(params, allParams) {
  console.log("Validating sponsorship data:", params);
  
  // Check if params exists
  if (!params) {
    throw new Error("No parameters provided for sponsorship form");
  }
  
  // Required fields
  const requiredFields = ['fullName', 'email', 'company'];
  const missingFields = requiredFields.filter(field => !params[field]);
  
  if (missingFields.length > 0) {
    console.error("Missing fields:", missingFields);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('Invalid email format');
  }

  // Phone number validation - NO RESTRICTIONS (accepts any format)
  // Removed phone validation as requested

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

function validateAndSanitizeContactData(params, allParams) {
  console.log("Validating contact data:", params);
  
  // Check if params exists
  if (!params) {
    throw new Error("No parameters provided for contact form");
  }
  
  // Required fields
  const requiredFields = ['name', 'email', 'message'];
  const missingFields = requiredFields.filter(field => !params[field]);
  
  if (missingFields.length > 0) {
    console.error("Missing fields:", missingFields);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    throw new Error('Invalid email format');
  }

  // Sanitize and return data
  return {
    name: params.name.trim(),
    email: params.email.trim().toLowerCase(),
    message: params.message.trim()
  };
}

// Function to manually clean up existing sheets (run this once if needed)
function cleanupExistingSheets() {
  try {
    console.log("=== Cleaning up existing sheets ===");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Clean up Sponsorship Responses sheet
    let sponsorshipSheet = ss.getSheetByName("Sponsorship Responses");
    if (sponsorshipSheet) {
      console.log("Cleaning up Sponsorship Responses sheet...");
      const headerRow = sponsorshipSheet.getRange(1, 1, 1, sponsorshipSheet.getLastColumn()).getValues()[0];
      
      if (headerRow.length > 10) {
        // Delete attachment columns (columns 11, 12, 13)
        sponsorshipSheet.deleteColumns(11, 3);
        console.log("Deleted attachment columns from Sponsorship sheet");
      }
      
      // Update header
      sponsorshipSheet.getRange(1, 1, 1, 10).setValues([[
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
      ]]);
      sponsorshipSheet.getRange(1, 1, 1, 10).setFontWeight("bold");
      console.log("Updated Sponsorship sheet headers");
    }
    
    // Clean up Contact Responses sheet
    let contactSheet = ss.getSheetByName("Contact Responses");
    if (contactSheet) {
      console.log("Cleaning up Contact Responses sheet...");
      const headerRow = contactSheet.getRange(1, 1, 1, contactSheet.getLastColumn()).getValues()[0];
      
      if (headerRow.length > 4) {
        // Delete attachment columns (columns 5, 6, 7)
        contactSheet.deleteColumns(5, 3);
        console.log("Deleted attachment columns from Contact sheet");
      }
      
      // Update header
      contactSheet.getRange(1, 1, 1, 4).setValues([[
        "Timestamp",
        "Name",
        "Email",
        "Message"
      ]]);
      contactSheet.getRange(1, 1, 1, 4).setFontWeight("bold");
      console.log("Updated Contact sheet headers");
    }
    
    console.log("✅ Sheet cleanup completed!");
    
  } catch (error) {
    console.error("❌ Sheet cleanup failed:", error);
  }
}

// Test functions
function testFormSubmission() {
  console.log("=== Testing Form Submission ===");
  
  // Test sponsorship form
  const sponsorshipTestData = {
    formType: "sponsorship",
    fullName: "Test Sponsor",
    email: "sponsor@example.com",
    company: "Test Company",
    mobile: "1234567890",
    website: "https://example.com",
    location: "Test Location",
    amount: "1000",
    supportType: ["Financial", "In-Kind"],
    message: "Test sponsorship message"
  };

  console.log("Testing sponsorship form with data:", sponsorshipTestData);
  const sponsorshipResponse = doPost({
    parameter: sponsorshipTestData
  });

  console.log("Sponsorship Form Response:", sponsorshipResponse.getContent());

  // Test contact form
  const contactTestData = {
    formType: "contact",
    name: "Test Contact",
    email: "contact@example.com",
    message: "Test contact message"
  };

  console.log("Testing contact form with data:", contactTestData);
  const contactResponse = doPost({
    parameter: contactTestData
  });

  console.log("Contact Form Response:", contactResponse.getContent());
  
  console.log("=== Test Complete ===");
}
