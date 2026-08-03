const SHEET_NAME = "Events";
const MENU_SHEET_NAME = "Menus";
const CUSTOMER_SHEET_NAME = "Customers";

const HEADERS = [
  "receivedAt",
  "eventId",
  "createdAt",
  "restaurantSlug",
  "tableSlug",
  "tableLabel",
  "sessionId",
  "sourcePath",
  "qualitativeText",
  "sliderPreferences",
  "importantTraits",
  "parsedPreferences",
  "recommendations",
  "pos"
];

const MENU_HEADERS = [
  "updatedAt",
  "restaurantSlug",
  "drinks",
  "barIngredients"
];

const CUSTOMER_HEADERS = [
  "receivedAt",
  "eventId",
  "createdAt",
  "email",
  "birthday",
  "sourcePath",
  "persona",
  "aboutYou",
  "sliderPreferences",
  "importantTraits",
  "qualitativeText",
  "parsedPreferences",
  "recommendations",
  "spiritsAndModifiers",
  "bartenderScript",
  "recipe",
  "feedback"
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);

  if (payload.recordType === "menu") {
    return saveMenu(payload);
  }

  if (payload.recordType === "customer") {
    return saveCustomer(payload);
  }

  const sheet = getSheet();
  const event = payload;

  sheet.appendRow([
    new Date().toISOString(),
    event.id || "",
    event.createdAt || "",
    event.restaurant?.slug || "",
    event.table?.slug || "",
    event.table?.label || "",
    event.session?.id || "",
    event.session?.sourcePath || "",
    event.guestInput?.qualitativeText || "",
    JSON.stringify(event.guestInput?.sliderPreferences || {}),
    JSON.stringify(event.guestInput?.importantTraits || {}),
    JSON.stringify(event.guestInput?.parsedPreferences || {}),
    JSON.stringify(event.recommendations || []),
    JSON.stringify(event.pos || {})
  ]);

  return jsonResponse({ ok: true });
}

function doGet(e) {
  if (String(e.parameter.type || "") === "menu") {
    return getMenu(e);
  }

  const restaurantSlug = String(e.parameter.restaurant || "").toLowerCase().trim();
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const events = rows
    .map(row => rowToEvent(headers, row))
    .filter(event => !restaurantSlug || event.restaurant.slug === restaurantSlug);

  return jsonResponse({
    ok: true,
    events
  });
}

function saveMenu(payload) {
  const restaurantSlug = String(payload.restaurantSlug || "").toLowerCase().trim();
  const drinks = Array.isArray(payload.drinks) ? payload.drinks : [];
  const barIngredients = Array.isArray(payload.barIngredients) ? payload.barIngredients : [];

  if (!restaurantSlug || !drinks.length) {
    return jsonResponse({ ok: false, error: "restaurantSlug and drinks are required" });
  }

  const sheet = getMenuSheet();
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;

  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][1] || "").toLowerCase().trim() === restaurantSlug) {
      targetRow = index + 1;
      break;
    }
  }

  const row = [
    new Date().toISOString(),
    restaurantSlug,
    JSON.stringify(drinks),
    JSON.stringify(barIngredients)
  ];

  if (targetRow === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(targetRow, 1, 1, MENU_HEADERS.length).setValues([row]);
  }

  return jsonResponse({ ok: true });
}

function getMenu(e) {
  const restaurantSlug = String(e.parameter.restaurant || "").toLowerCase().trim();
  const sheet = getMenuSheet();
  const rows = sheet.getDataRange().getValues();

  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][1] || "").toLowerCase().trim() === restaurantSlug) {
      return jsonResponse({
        ok: true,
        restaurantSlug,
        drinks: parseJson(rows[index][2], []),
        barIngredients: parseJson(rows[index][3], [])
      });
    }
  }

  return jsonResponse({
    ok: true,
    restaurantSlug,
    drinks: [],
    barIngredients: []
  });
}

function saveCustomer(event) {
  const sheet = getCustomerSheet();
  const customerId = String(event.customerRecordId || event.eventId || event.id || "").trim();
  const targetRow = findCustomerRow(sheet, customerId, event.email || "", event.saveAction || "");
  const row = customerEventToRow(event, getExistingCustomerRecord(sheet, targetRow));

  if (targetRow === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(targetRow, 1, 1, CUSTOMER_HEADERS.length).setValues([row]);
  }

  return jsonResponse({ ok: true });
}

function customerEventToRow(event, existing) {
  return [
    new Date().toISOString(),
    event.customerRecordId || event.eventId || event.id || existing.eventId || "",
    event.createdAt || existing.createdAt || "",
    event.email || existing.email || "",
    event.birthday || existing.birthday || "",
    event.sourcePath || existing.sourcePath || "",
    event.persona || existing.persona || "",
    event.aboutYou || existing.aboutYou || "",
    JSON.stringify(event.guestInput?.sliderPreferences || parseJson(existing.sliderPreferences, {})),
    JSON.stringify(event.guestInput?.importantTraits || parseJson(existing.importantTraits, {})),
    event.guestInput?.qualitativeText || existing.qualitativeText || "",
    JSON.stringify(event.guestInput?.parsedPreferences || parseJson(existing.parsedPreferences, {})),
    JSON.stringify(event.recommendations || parseJson(existing.recommendations, [])),
    JSON.stringify(event.spiritsAndModifiers || parseJson(existing.spiritsAndModifiers, [])),
    event.bartenderScript || existing.bartenderScript || "",
    JSON.stringify(event.recipe || parseJson(existing.recipe, {})),
    JSON.stringify(event.feedback || parseJson(existing.feedback, {}))
  ];
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function getMenuSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(MENU_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(MENU_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(MENU_HEADERS);
  } else {
    sheet.getRange(1, 1, 1, MENU_HEADERS.length).setValues([MENU_HEADERS]);
  }

  return sheet;
}

function getCustomerSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CUSTOMER_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CUSTOMER_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CUSTOMER_HEADERS);
  } else {
    sheet.getRange(1, 1, 1, CUSTOMER_HEADERS.length).setValues([CUSTOMER_HEADERS]);
  }

  return sheet;
}

function findCustomerRow(sheet, eventId, email, saveAction) {
  const eventIdRow = findCustomerRowByEventId(sheet, eventId);
  if (eventIdRow !== -1) {
    return eventIdRow;
  }

  if (String(saveAction || "").toLowerCase() === "details") {
    return findMostRecentCustomerRowByEmail(sheet, email);
  }

  return -1;
}

function findCustomerRowByEventId(sheet, eventId) {
  const normalizedEventId = String(eventId || "").trim();
  if (!normalizedEventId || sheet.getLastRow() < 2) {
    return -1;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const eventIdColumn = headers.indexOf("eventId") + 1;

  if (eventIdColumn > 0) {
    const row = findRowByValue(sheet, eventIdColumn, normalizedEventId);
    if (row !== -1) {
      return row;
    }
  }

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < values[rowIndex].length; columnIndex += 1) {
      if (String(values[rowIndex][columnIndex] || "").trim() === normalizedEventId) {
        return rowIndex + 2;
      }
    }
  }

  return -1;
}

function findMostRecentCustomerRowByEmail(sheet, email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || sheet.getLastRow() < 2) {
    return -1;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const emailColumn = headers.indexOf("email") + 1;

  if (emailColumn <= 0) {
    return -1;
  }

  const values = sheet.getRange(2, emailColumn, sheet.getLastRow() - 1, 1).getValues();

  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (String(values[index][0] || "").trim().toLowerCase() === normalizedEmail) {
      return index + 2;
    }
  }

  return -1;
}

function getExistingCustomerRecord(sheet, rowNumber) {
  if (rowNumber === -1) {
    return {};
  }

  const headers = sheet.getRange(1, 1, 1, CUSTOMER_HEADERS.length).getValues()[0];
  const values = sheet.getRange(rowNumber, 1, 1, CUSTOMER_HEADERS.length).getValues()[0];

  return headers.reduce((record, header, index) => {
    record[header] = values[index];
    return record;
  }, {});
}

function findRowByValue(sheet, columnNumber, value) {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue || sheet.getLastRow() < 2) {
    return -1;
  }

  const values = sheet.getRange(2, columnNumber, sheet.getLastRow() - 1, 1).getValues();

  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0] || "").trim() === normalizedValue) {
      return index + 2;
    }
  }

  return -1;
}

function rowToEvent(headers, row) {
  const record = headers.reduce((values, header, index) => {
    values[header] = row[index];
    return values;
  }, {});

  return {
    id: String(record.eventId || ""),
    createdAt: String(record.createdAt || ""),
    restaurant: {
      slug: String(record.restaurantSlug || "").toLowerCase()
    },
    table: record.tableSlug
      ? {
          slug: String(record.tableSlug || "").toLowerCase(),
          label: String(record.tableLabel || "")
        }
      : null,
    session: {
      id: String(record.sessionId || ""),
      sourcePath: String(record.sourcePath || "")
    },
    guestInput: {
      qualitativeText: String(record.qualitativeText || ""),
      sliderPreferences: parseJson(record.sliderPreferences, {}),
      importantTraits: parseJson(record.importantTraits, {}),
      parsedPreferences: parseJson(record.parsedPreferences, {})
    },
    recommendations: parseJson(record.recommendations, []),
    pos: parseJson(record.pos, {})
  };
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
