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
  "drinks"
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
    JSON.stringify(drinks)
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
        drinks: parseJson(rows[index][2], [])
      });
    }
  }

  return jsonResponse({
    ok: true,
    restaurantSlug,
    drinks: []
  });
}

function saveCustomer(event) {
  const sheet = getCustomerSheet();
  const row = customerEventToRow(event);
  const targetRow = findRowByValue(sheet, 2, event.id || "");

  if (targetRow === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(targetRow, 1, 1, CUSTOMER_HEADERS.length).setValues([row]);
  }

  return jsonResponse({ ok: true });
}

function customerEventToRow(event) {
  return [
    new Date().toISOString(),
    event.id || "",
    event.createdAt || "",
    event.email || "",
    event.birthday || "",
    event.sourcePath || "",
    event.persona || "",
    event.aboutYou || "",
    JSON.stringify(event.guestInput?.sliderPreferences || {}),
    JSON.stringify(event.guestInput?.importantTraits || {}),
    event.guestInput?.qualitativeText || "",
    JSON.stringify(event.guestInput?.parsedPreferences || {}),
    JSON.stringify(event.recommendations || []),
    JSON.stringify(event.spiritsAndModifiers || []),
    event.bartenderScript || "",
    JSON.stringify(event.recipe || {}),
    JSON.stringify(event.feedback || {})
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
  }

  return sheet;
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
