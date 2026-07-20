const SHEET_NAME = "Events";

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

function doPost(e) {
  const sheet = getSheet();
  const event = JSON.parse(e.postData.contents);

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
