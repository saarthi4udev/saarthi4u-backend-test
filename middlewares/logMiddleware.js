const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const MAX_RESPONSE_LOG_SIZE = 5000;
const MAX_REQUEST_LOG_SIZE = 2000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const EXCEL_FILE_PATH = path.join(logsDir, "api-logs.xlsx");

const truncateJSON = (obj, maxSize) => {
  let jsonString = JSON.stringify(obj);
  if (jsonString.length > maxSize) {
    return jsonString.substring(0, maxSize) + "...[truncated]";
  }
  return jsonString;
};

const writeLogToExcel = async (logData) => {
  try {
    let workbook;
    let worksheet;

    // Check if Excel file exists
    if (fs.existsSync(EXCEL_FILE_PATH)) {
      // Read existing workbook
      workbook = XLSX.readFile(EXCEL_FILE_PATH);
      worksheet = workbook.Sheets["Logs"];

      if (!worksheet) {
        // Create new worksheet if "Logs" sheet doesn't exist
        worksheet = XLSX.utils.json_to_sheet([logData]);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
      } else {
        // Convert existing worksheet to JSON, add new log, convert back
        const existingData = XLSX.utils.sheet_to_json(worksheet);
        existingData.push(logData);

        // Create new worksheet with updated data
        const newWorksheet = XLSX.utils.json_to_sheet(existingData);
        workbook.Sheets["Logs"] = newWorksheet;
      }
    } else {
      // Create new workbook and worksheet
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([logData]);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    }

    // Write the workbook to file
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
  } catch (error) {
    console.error("Excel log write error:", error.message);
  }
};

const loggerMiddleware = async (req, res, next) => {
  const start = Date.now();
  let userId = null;

  const authHeader = req.cookies?.token || req.header("Authorization");
  if (authHeader) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      userId = null;
    }
  }

  const reqBody = req.body
    ? truncateJSON(req.body, MAX_REQUEST_LOG_SIZE)
    : null;
  const params = req.params
    ? truncateJSON(req.params, MAX_REQUEST_LOG_SIZE)
    : null;

  // Intercept res.send
  const originalSend = res.send.bind(res);

  res.send = (body) => {
    let responseData;

    try {
      const parsedBody = typeof body === "object" ? body : JSON.parse(body);
      responseData = truncateJSON(parsedBody, MAX_RESPONSE_LOG_SIZE);
    } catch (error) {
      responseData = "[Unparsable or binary response]";
    }

    res.on("finish", async () => {
      const duration = Date.now() - start;

      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: duration,
        ipAddress: req.ip,
        body: reqBody,
        params: params,
        userId: userId,
        responseData: responseData,
      };

      // Writing log to Excel file instead of database
      await writeLogToExcel(logData);
    });

    return originalSend(body);
  };

  next();
};

module.exports = loggerMiddleware;