import winston, { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, printf } = format;

// Define custom colors for log levels
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray'
};

// Apply custom colors to winston
winston.addColors(customColors);

// Include metadata in the final console output
const consoleLogFormat = combine(
  colorize(),
  printf(({ level, message, timestamp, ...meta }) => {
    // meta contains everything other than level, message, timestamp
    const extras = Object.keys(meta).length
      ? ` ${JSON.stringify(meta, null, 2)}`
      : "";
    return `[${level}]: ${message} ${extras}`;
  })
);

const logger = createLogger({
  level: "debug",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      // Use the custom format that prints metadata
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;