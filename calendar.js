var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/settings.ts
var params = JSON.parse(args.widgetParameter) || {};
var importedSettings = {};
try {
  importedSettings = importModule("calendar-settings");
} catch (e) {}
var defaultSettings = {
  debug: false,
  calendarApp: "calshow",
  backgroundImage: "transparent.jpg",
  calFilter: [],
  widgetBackgroundColor: "#000000",
  todayTextColor: "#000000",
  markToday: true,
  todayCircleColor: "#FFB800",
  showEventCircles: true,
  discountAllDayEvents: false,
  eventCircleColor: "#1E5C7B",
  weekdayTextColor: "#ffffff",
  weekendLetters: "#FFB800",
  weekendLetterOpacity: 1,
  weekendDates: "#FFB800",
  smallerPrevNextMonth: false,
  textColorPrevNextMonth: "#9e9e9e",
  locale: "en-US",
  textColor: "#ffffff",
  eventDateTimeOpacity: 0.7,
  widgetType: "cal",
  showAllDayEvents: true,
  showIconForAllDayEvents: true,
  showCalendarBullet: true,
  startWeekOnSunday: false,
  showEventsOnlyForToday: false,
  nextNumOfDays: 7,
  showCompleteTitle: false,
  showEventLocation: true,
  showEventTime: true,
  clock24Hour: false,
  showPrevMonth: true,
  showNextMonth: true,
  individualDateTargets: false,
  flipped: false,
};
var settings = __spreadValues(
  __spreadValues(__spreadValues({}, defaultSettings), importedSettings),
  params
);
var settings_default = settings;

// src/setWidgetBackground.ts
function setWidgetBackground(widget, imageName) {
  const imageUrl = getImageUrl(imageName);
  const image = Image.fromFile(imageUrl);
  widget.backgroundImage = image;
}
function getImageUrl(name) {
  const fm = FileManager.iCloud();
  const dir = fm.documentsDirectory();
  return fm.joinPath(dir, `${name}`);
}
var setWidgetBackground_default = setWidgetBackground;

// src/addWidgetTextLine.ts
function addWidgetTextLine(
  text,
  widget,
  {
    textColor = "#ffffff",
    textSize = 12,
    opacity = 1,
    align,
    font,
    lineLimit = 0,
  }
) {
  const textLine = widget.addText(text);
  textLine.textColor = new Color(textColor, 1);
  textLine.lineLimit = lineLimit;
  if (typeof font === "string") {
    textLine.font = new Font(font, textSize);
  } else {
    textLine.font = font;
  }
  textLine.textOpacity = opacity;
  switch (align) {
    case "left":
      textLine.leftAlignText();
      break;
    case "center":
      textLine.centerAlignText();
      break;
    case "right":
      textLine.rightAlignText();
      break;
    default:
      textLine.leftAlignText();
      break;
  }
}
var addWidgetTextLine_default = addWidgetTextLine;

// src/getMonthBoundaries.ts
function getMonthBoundaries(date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { firstOfMonth, lastOfMonth };
}
var getMonthBoundaries_default = getMonthBoundaries;

// src/getMonthOffset.ts
function getMonthOffset(date, offset) {
  const newDate = new Date(date);
  let offsetMonth = date.getMonth() + offset;
  if (offsetMonth < 0) {
    offsetMonth += 12;
    newDate.setFullYear(date.getFullYear() - 1);
  } else if (offsetMonth > 11) {
    offsetMonth -= 12;
    newDate.setFullYear(date.getFullYear() + 1);
  }
  newDate.setMonth(offsetMonth, 1);
  return newDate;
}
var getMonthOffset_default = getMonthOffset;

// src/getWeekLetters.ts
function getWeekLetters(locale = "en-US", startWeekOnSunday = false) {
  let week = [];
  for (let i = 1; i <= 7; i += 1) {
    const day = new Date(`February 0${i}, 2021`);
    week.push(day.toLocaleDateString(locale, { weekday: "narrow" }));
  }
  week = week.map((day) => [day.slice(0, 1).toUpperCase()]);
  if (startWeekOnSunday) {
    const sunday = week.pop();
    week.unshift(sunday);
  }
  return week;
}
var getWeekLetters_default = getWeekLetters;

// src/buildCalendar.ts
function buildCalendar(
  date = new Date(),
  {
    locale,
    showPrevMonth = true,
    showNextMonth = true,
    startWeekOnSunday = false,
  }
) {
  const currentMonth = getMonthBoundaries_default(date);
  const prevMonth = getMonthBoundaries_default(
    getMonthOffset_default(date, -1)
  );
  const calendar = getWeekLetters_default(locale, startWeekOnSunday);
  let daysFromPrevMonth = 0;
  let daysFromNextMonth = 0;
  let index = 1;
  let offset = 1;
  let firstDay =
    currentMonth.firstOfMonth.getDay() !== 0
      ? currentMonth.firstOfMonth.getDay()
      : 7;
  if (startWeekOnSunday) {
    index = 0;
    offset = 0;
    firstDay = firstDay % 7;
  }
  let dayStackCounter = 0;
  for (; index < firstDay; index += 1) {
    if (showPrevMonth) {
      calendar[index - offset].push(
        `${prevMonth.lastOfMonth.getMonth()}/${
          prevMonth.lastOfMonth.getDate() - firstDay + 1 + index
        }`
      );
      daysFromPrevMonth += 1;
    } else {
      calendar[index - offset].push(" ");
    }
    dayStackCounter = (dayStackCounter + 1) % 7;
  }
  for (
    let indexDate = 1;
    indexDate <= currentMonth.lastOfMonth.getDate();
    indexDate += 1
  ) {
    calendar[dayStackCounter].push(`${date.getMonth()}/${indexDate}`);
    dayStackCounter = (dayStackCounter + 1) % 7;
  }
  let longestColumn = calendar.reduce(
    (acc, dayStacks) => (dayStacks.length > acc ? dayStacks.length : acc),
    0
  );
  if (showNextMonth && longestColumn < 6) {
    longestColumn += 1;
  }
  const nextMonth = getMonthOffset_default(date, 1);
  calendar.forEach((dayStacks, index2) => {
    while (dayStacks.length < longestColumn) {
      if (showNextMonth) {
        daysFromNextMonth += 1;
        calendar[index2].push(`${nextMonth.getMonth()}/${daysFromNextMonth}`);
      } else {
        calendar[index2].push(" ");
      }
    }
  });
  return { calendar, daysFromPrevMonth, daysFromNextMonth };
}
var buildCalendar_default = buildCalendar;

// src/countEvents.ts
async function countEvents(
  date,
  extendToPrev = 0,
  extendToNext = 0,
  settings2
) {
  const { firstOfMonth } = getMonthBoundaries_default(date);
  const { startDate, endDate } = extendBoundaries(
    firstOfMonth,
    extendToPrev,
    extendToNext
  );
  let events = await CalendarEvent.between(startDate, endDate);
  events = trimEvents(events, settings2);
  const eventCounts = /* @__PURE__ */ new Map();
  events.forEach((event) => {
    if (event.isAllDay) {
      const date2 = event.startDate;
      do {
        updateEventCounts(date2, eventCounts);
        date2.setDate(date2.getDate() + 1);
      } while (date2 < event.endDate);
    } else {
      updateEventCounts(event.startDate, eventCounts);
    }
  });
  const intensity = calculateIntensity(eventCounts);
  return { eventCounts, intensity };
}
function trimEvents(events, settings2) {
  let trimmedEvents = events;
  if (settings2.calFilter.length) {
    trimmedEvents = events.filter((event) =>
      settings2.calFilter.includes(event.calendar.title)
    );
  }
  if (settings2.discountAllDayEvents || !settings2.showAllDayEvents) {
    trimmedEvents = trimmedEvents.filter((event) => !event.isAllDay);
  }
  return trimmedEvents;
}
function extendBoundaries(first, extendToPrev, extendToNext) {
  const startDate = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate() - extendToPrev
  );
  const endDate = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    first.getDate() + extendToNext
  );
  return { startDate, endDate };
}
function updateEventCounts(date, eventCounts) {
  if (eventCounts.has(`${date.getMonth()}/${date.getDate()}`)) {
    eventCounts.set(
      `${date.getMonth()}/${date.getDate()}`,
      eventCounts.get(`${date.getMonth()}/${date.getDate()}`) + 1
    );
  } else {
    eventCounts.set(`${date.getMonth()}/${date.getDate()}`, 1);
  }
}
function calculateIntensity(eventCounts) {
  const counter = eventCounts.values();
  const counts = [];
  for (const count of counter) {
    counts.push(count);
  }
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  let intensity = 1 / (max - min + 1);
  intensity = intensity < 0.3 ? 0.3 : intensity;
  return intensity;
}
var countEvents_default = countEvents;

// src/createDateImage.ts
function createDateImage(
  text,
  { backgroundColor, textColor, intensity, toFullSize }
) {
  const size = toFullSize ? 50 : 35;
  const drawing = new DrawContext();
  drawing.respectScreenScale = true;
  const contextSize = 50;
  drawing.size = new Size(contextSize, contextSize);
  drawing.opaque = false;
  drawing.setFillColor(new Color(backgroundColor, intensity));
  drawing.fillEllipse(
    new Rect(
      (contextSize - (size - 2)) / 2,
      (contextSize - (size - 2)) / 2,
      size - 2,
      size - 2
    )
  );
  drawing.setFont(Font.boldSystemFont(size * 0.5));
  drawing.setTextAlignedCenter();
  drawing.setTextColor(new Color(textColor, 1));
  const textBox = new Rect(
    (contextSize - size) / 2,
    (contextSize - size * 0.5) / 2 - 3,
    size,
    size * 0.5
  );
  drawing.drawTextInRect(text, textBox);
  return drawing.getImage();
}
var createDateImage_default = createDateImage;

// src/isDateFromBoundingMonth.ts
function isDateFromBoundingMonth(row, column, date, calendar) {
  const [month] = calendar[row][column].split("/");
  const currentMonth = date.getMonth().toString();
  return month === currentMonth;
}
var isDateFromBoundingMonth_default = isDateFromBoundingMonth;

// src/isWeekend.ts
function isWeekend(index, startWeekOnSunday = false) {
  if (startWeekOnSunday) {
    switch (index) {
      case 0:
      case 6:
        return true;
      default:
        return false;
    }
  }
  return index > 4;
}
var isWeekend_default = isWeekend;

// src/createUrl.ts
function createUrl(day, month, date, settings2) {
  let url;
  let year;
  const currentMonth = date.getMonth();
  if (currentMonth === 11 && Number(month) === 1) {
    year = date.getFullYear() + 1;
  } else if (currentMonth === 0 && Number(month) === 11) {
    year = date.getFullYear() - 1;
  } else {
    year = date.getFullYear();
  }
  if (settings2.calendarApp === "calshow") {
    const appleDate = new Date("2001/01/01");
    const timestamp =
      (new Date(`${year}/${Number(month) + 1}/${day}`).getTime() -
        appleDate.getTime()) /
      1e3;
    url = `calshow:${timestamp}`;
  } else if (settings2.calendarApp === "x-fantastical3") {
    url = `${settings2.calendarApp}://show/calendar/${year}-${
      Number(month) + 1
    }-${day}`;
  } else {
    url = "";
  }
  return url;
}
var createUrl_default = createUrl;

// src/buildCalendarView.ts
async function buildCalendarView(date, stack, settings2) {
  const rightStack = stack.addStack();
  rightStack.addSpacer();
  rightStack.layoutVertically();
  const dateFormatter = new DateFormatter();
  dateFormatter.dateFormat = "MMMM";
  dateFormatter.locale = settings2.locale.split("-")[0];
  const spacing = config.widgetFamily === "small" ? 18 : 19;
  const monthLine = rightStack.addStack();
  monthLine.addSpacer(4);
  addWidgetTextLine_default(
    dateFormatter.string(date).toUpperCase(),
    monthLine,
    {
      textColor: settings2.textColor,
      textSize: 14,
      font: Font.boldSystemFont(13),
    }
  );
  const calendarStack = rightStack.addStack();
  calendarStack.spacing = 2;
  const { calendar, daysFromPrevMonth, daysFromNextMonth } =
    buildCalendar_default(date, settings2);
  const { eventCounts, intensity } = await countEvents_default(
    date,
    daysFromPrevMonth,
    daysFromNextMonth,
    settings2
  );
  for (let i = 0; i < calendar.length; i += 1) {
    const weekdayStack = calendarStack.addStack();
    weekdayStack.layoutVertically();
    for (let j = 0; j < calendar[i].length; j += 1) {
      const dayStack = weekdayStack.addStack();
      dayStack.size = new Size(spacing, spacing);
      dayStack.centerAlignContent();
      const [day, month] = calendar[i][j].split("/").reverse();
      if (settings2.individualDateTargets) {
        const callbackUrl = createUrl_default(day, month, date, settings2);
        if (j > 0) dayStack.url = callbackUrl;
      }
      if (calendar[i][j] === `${date.getMonth()}/${date.getDate()}`) {
        if (settings2.markToday) {
          const highlightedDate = createDateImage_default(day, {
            backgroundColor: settings2.todayCircleColor,
            textColor: settings2.todayTextColor,
            intensity: 1,
            toFullSize: true,
          });
          dayStack.addImage(highlightedDate);
        } else {
          addWidgetTextLine_default(day, dayStack, {
            textColor: settings2.todayTextColor,
            font: Font.boldSystemFont(10),
            align: "center",
          });
        }
      } else if (j > 0 && calendar[i][j] !== " ") {
        const isCurrentMonth = isDateFromBoundingMonth_default(
          i,
          j,
          date,
          calendar
        );
        const toFullSize = !settings2.smallerPrevNextMonth || isCurrentMonth;
        let textColor = isWeekend_default(i, settings2.startWeekOnSunday)
          ? settings2.weekendDates
          : settings2.weekdayTextColor;
        if (!isCurrentMonth) textColor = settings2.textColorPrevNextMonth;
        const dateImage = createDateImage_default(day, {
          backgroundColor: settings2.eventCircleColor,
          textColor,
          intensity: settings2.showEventCircles
            ? eventCounts.get(calendar[i][j]) * intensity
            : 0,
          toFullSize,
        });
        dayStack.addImage(dateImage);
      } else {
        addWidgetTextLine_default(day, dayStack, {
          textColor: isWeekend_default(i, settings2.startWeekOnSunday)
            ? settings2.weekendLetters
            : settings2.textColor,
          opacity: isWeekend_default(i, settings2.startWeekOnSunday)
            ? settings2.weekendLetterOpacity
            : 1,
          font: Font.boldSystemFont(10),
          align: "center",
        });
      }
    }
  }
  rightStack.addSpacer();
}
var buildCalendarView_default = buildCalendarView;

// src/getEventIcon.ts
function getEventIcon(event) {
  if (event.attendees === null) {
    return "\u25CF ";
  }
  const status = event.attendees.filter((attendee) => attendee.isCurrentUser)[0]
    .status;
  switch (status) {
    case "accepted":
      return "\u2713 ";
    case "tentative":
      return "~ ";
    case "declined":
      return "\u2718 ";
    default:
      return "\u25CF ";
  }
}
var getEventIcon_default = getEventIcon;

// src/getImageFromBase64.ts
function getImageFromBase64(base64String) {
  const data = Data.fromBase64String(base64String);
  return Image.fromData(data);
}
var getImageFromBase64_default = getImageFromBase64;

// src/iconAllDay.ts
var base64Image =
  "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";
function iconFullDay() {
  return getImageFromBase64_default(base64Image);
}
var iconAllDay_default = iconFullDay;

// src/formatDuration.ts
function formatDuration(startDate, endDate, { clock24Hour, locale }) {
  if (clock24Hour) {
    const formatter = Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
    });
    return `${formatter.format(startDate)}-${formatter.format(endDate)}`;
  } else {
    const formatter = Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const startDayParts = formatter.formatToParts(startDate);
    const endDayParts = formatter.formatToParts(endDate);
    const startPeriod = startDayParts.find((p) => p.type === "dayPeriod").value;
    const endPeriod = endDayParts.find((p) => p.type === "dayPeriod").value;
    if (startPeriod === endPeriod) {
      if (isPeriodFirst(startDayParts)) {
        log(
          `${joinDateParts(startDayParts)}-${joinDateParts(
            endDayParts.filter((p) => p.type !== "dayPeriod")
          )}`
        );
        return `${joinDateParts(startDayParts)}-${joinDateParts(
          endDayParts.filter((p) => p.type !== "dayPeriod")
        )}`;
      }
    }
    return `${joinDateParts(startDayParts)}-${joinDateParts(endDayParts)}`;
  }
}
function joinDateParts(parts) {
  return parts.map((p) => p.value).join("");
}
function isPeriodFirst(parts) {
  for (let part of parts) {
    if (part.type === "dayPeriod") return true;
    if (part.type === "hour" || part.type === "minute") return false;
  }
}
var formatDuration_default = formatDuration;

// src/formatEvent.ts
function formatEvent(
  stack,
  event,
  {
    eventDateTimeOpacity,
    textColor,
    showCalendarBullet,
    showCompleteTitle,
    showEventLocation,
    showEventTime,
    showIconForAllDayEvents,
    clock24Hour,
    locale,
  }
) {
  const eventLine = stack.addStack();
  const backgroundColor = new Color(event.calendar.color.hex, 0.3);
  eventLine.backgroundColor = backgroundColor;
  eventLine.layoutVertically();
  eventLine.cornerRadius = 5;
  eventLine.setPadding(3, 3, 3, 3);
  eventLine.size = new Size(150, 0);
  let lineCount = 0;
  const titleStack = eventLine.addStack();
  if (showCalendarBullet) {
    const icon = getEventIcon_default(event);
    addWidgetTextLine_default(icon, titleStack, {
      textColor: event.calendar.color.hex,
      font: Font.mediumSystemFont(13),
      lineLimit: showCompleteTitle ? 0 : 1,
    });
  }
  addWidgetTextLine_default(event.title, titleStack, {
    textColor,
    font: Font.mediumSystemFont(13),
    lineLimit: showCompleteTitle ? 0 : 1,
  });
  if (showIconForAllDayEvents && event.isAllDay) {
    titleStack.addSpacer();
    const icon = titleStack.addImage(iconAllDay_default());
    icon.imageSize = new Size(15, 15);
    icon.rightAlignImage();
    icon.tintColor = new Color(textColor);
  }
  lineCount++;
  if (showEventLocation && event.location) {
    addWidgetTextLine_default(event.location, eventLine.addStack(), {
      textColor,
      opacity: eventDateTimeOpacity,
      font: Font.mediumSystemFont(12),
      lineLimit: showCompleteTitle ? 0 : 1,
    });
    lineCount++;
  }
  if (showEventTime) {
    let time = "";
    if (!event.isAllDay) {
      time = formatDuration_default(event.startDate, event.endDate, {
        clock24Hour,
        locale,
      });
    }
    if (time) {
      const timeStack = eventLine.addStack();
      addWidgetTextLine_default(time, timeStack, {
        textColor,
        opacity: eventDateTimeOpacity,
        font: Font.regularSystemFont(12),
      });
      lineCount++;
    }
  }
  return lineCount;
}
var formatEvent_default = formatEvent;

// src/formatString.ts
function formatString(format, ...args2) {
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args2[number] != "undefined" ? args2[number] : match;
  });
}
var formatString_default = formatString;

// src/i18n.ts
var translation = {
  en: {
    today: "Today",
    tomorrow: "Tomorrow",
    daysAfter: "{0} days after",
  },
  zh_CN: {
    today: "\u4ECA\u5929",
    tomorrow: "\u660E\u5929",
    daysAfter: "{0}\u5929\u540E",
  },
  zh: {
    today: "\u4ECA\u5929",
    tomorrow: "\u660E\u5929",
    daysAfter: "{0}\u5929\u5F8C",
  },
  ja: {
    today: "\u4ECA\u65E5",
    tomorrow: "\u660E\u65E5",
    daysAfter: "{0}\u65E5\u5F8C",
  },
};
function tr(locale, key, ...args2) {
  locale = locale.replace("-", "_");
  let trValue;
  if (locale in translation) {
    trValue = translation[locale][key];
  } else if (locale.split("_")[0] in translation) {
    trValue = translation[locale.split("_")[0]][key];
  } else {
    trValue = translation["en"][key];
  }
  if (args2.length) return formatString_default(trValue, ...args2);
  else return trValue;
}
var i18n_default = tr;

// src/dateToReadableDiff.ts
function dateToReadableDiff(d1, locale = "en-GB") {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const diff = d1.valueOf() - now.valueOf();
  const dateDiff = Math.floor(diff / (1e3 * 60 * 60 * 24));
  if (dateDiff < 0) {
    return "";
  } else if (dateDiff == 0) {
    return i18n_default(locale, "today");
  } else if (dateDiff == 1) {
    return i18n_default(locale, "tomorrow");
  } else if (dateDiff > 1 && dateDiff <= 3) {
    return i18n_default(locale, "daysAfter", dateDiff);
  } else {
    return d1.toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }
}
var dateToReadableDiff_default = dateToReadableDiff;

// src/buildEventsView.ts
async function buildEventsView(
  events,
  stack,
  settings2,
  {
    horizontalAlign = "left",
    verticalAlign = "center",
    eventSpacer = 4,
    lineSpaceLimit = 7,
    showMsg = true,
  } = {}
) {
  const leftStack = stack.addStack();
  if (horizontalAlign === "left") {
    stack.addSpacer();
  }
  leftStack.layoutVertically();
  if (verticalAlign === "bottom" || verticalAlign === "center") {
    leftStack.addSpacer();
  }
  if (events.length !== 0) {
    const groupStack = /* @__PURE__ */ new Map();
    const numEvents = events.length;
    const showLocation = settings2.showEventLocation;
    let spaceLeft = lineSpaceLimit;
    let i = 0;
    while (spaceLeft > 0 && i < numEvents) {
      let stack2;
      let eventDate = dateToReadableDiff_default(
        events[i].startDate,
        settings2.locale
      );
      if (groupStack.has(eventDate)) {
        stack2 = groupStack.get(eventDate);
      } else {
        if (spaceLeft <= 1) {
          break;
        }
        stack2 = leftStack.addStack();
        stack2.layoutVertically();
        groupStack.set(eventDate, stack2);
        addWidgetTextLine_default(eventDate, stack2, {
          textColor: settings2.textColorPrevNextMonth,
          font: Font.regularSystemFont(13),
        });
        stack2.url = createUrl_default(
          events[i].startDate.getDate().toString(),
          events[i].startDate.getMonth().toString(),
          events[i].startDate,
          settings2
        );
        spaceLeft--;
      }
      const showTime = settings2.showEventTime;
      const spaceUsed = formatEvent_default(
        stack2,
        events[i],
        __spreadProps(__spreadValues({}, settings2), {
          showEventLocation: spaceLeft >= 3 ? showLocation : false,
          showEventTime: spaceLeft >= 2 ? showTime : false,
        })
      );
      spaceLeft -= spaceUsed;
      if (spaceLeft > 0 && i < numEvents) {
        stack2.addSpacer(eventSpacer);
      }
      i++;
    }
  } else if (showMsg) {
    addWidgetTextLine_default(`No more events.`, leftStack, {
      textColor: settings2.textColor,
      opacity: settings2.eventDateTimeOpacity,
      font: Font.regularSystemFont(15),
    });
  }
  if (verticalAlign === "top" || verticalAlign === "center") {
    leftStack.addSpacer();
  }
}
var buildEventsView_default = buildEventsView;

// src/getEvents.ts
async function getEvents(date, settings2) {
  let events = [];
  if (settings2.showEventsOnlyForToday) {
    events = await CalendarEvent.today([]);
  } else {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() + settings2.nextNumOfDays);
    events = await CalendarEvent.between(date, dateLimit);
  }
  if (settings2.calFilter.length) {
    events = events.filter((event) =>
      settings2.calFilter.includes(event.calendar.title)
    );
  }
  const futureEvents = [];
  for (const event of events) {
    if (
      event.isAllDay &&
      settings2.showAllDayEvents &&
      event.startDate.getTime() >
        new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
    ) {
      futureEvents.push(event);
    } else if (
      !event.isAllDay &&
      event.endDate.getTime() > date.getTime() &&
      !event.title.startsWith("Canceled:")
    ) {
      futureEvents.push(event);
    }
  }
  return futureEvents;
}
var getEvents_default = getEvents;

// src/buildLargeWidget.ts
async function buildLargeWidget(date, events, stack, settings2) {
  const leftSide = stack.addStack();
  stack.addSpacer();
  const rightSide = stack.addStack();
  leftSide.layoutVertically();
  rightSide.layoutVertically();
  rightSide.addSpacer();
  rightSide.centerAlignContent();
  const leftSideEvents = events.slice(0, 8);
  const rightSideEvents = events.slice(8, 12);
  await buildEventsView_default(leftSideEvents, leftSide, settings2, {
    lineSpaceLimit: 16,
    eventSpacer: 6,
  });
  await buildCalendarView_default(date, rightSide, settings2);
  rightSide.addSpacer();
  await buildEventsView_default(rightSideEvents, rightSide, settings2, {
    lineSpaceLimit: 12,
    eventSpacer: 6,
    verticalAlign: "top",
    showMsg: false,
  });
}
var buildLargeWidget_default = buildLargeWidget;

// src/buildWidget.ts
async function buildWidget(settings2) {
  const widget = new ListWidget();
  widget.backgroundColor = new Color(settings2.widgetBackgroundColor, 1);
  setWidgetBackground_default(widget, settings2.backgroundImage);
  widget.setPadding(16, 16, 16, 16);
  const today = new Date();
  const globalStack = widget.addStack();
  const events = await getEvents_default(today, settings2);
  switch (config.widgetFamily) {
    case "small":
      if (settings2.widgetType === "events") {
        await buildEventsView_default(events, globalStack, settings2);
      } else {
        await buildCalendarView_default(today, globalStack, settings2);
      }
      break;
    case "large":
      await buildLargeWidget_default(today, events, globalStack, settings2);
      break;
    default:
      if (settings2.flipped) {
        await buildCalendarView_default(today, globalStack, settings2);
        globalStack.addSpacer(10);
        await buildEventsView_default(events, globalStack, settings2);
      } else {
        await buildEventsView_default(events, globalStack, settings2);
        await buildCalendarView_default(today, globalStack, settings2);
      }
      break;
  }
  return widget;
}
var buildWidget_default = buildWidget;

// src/index.ts
async function main() {
  if (config.runsInWidget) {
    const widget = await buildWidget_default(settings_default);
    Script.setWidget(widget);
    Script.complete();
  } else if (settings_default.debug) {
    Script.complete();
    const widget = await buildWidget_default(settings_default);
    await widget.presentMedium();
  } else {
    const appleDate = new Date("2001/01/01");
    const timestamp = (new Date().getTime() - appleDate.getTime()) / 1e3;
    const callback = new CallbackURL(
      `${settings_default.calendarApp}:` + timestamp
    );
    callback.open();
    Script.complete();
  }
}

await main();
