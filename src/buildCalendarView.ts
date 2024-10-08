import addWidgetTextLine from "./addWidgetTextLine";
import buildCalendar from "./buildCalendar";
import countEvents from "./countEvents";
import createDateImage from "./createDateImage";
import isDateFromBoundingMonth from "./isDateFromBoundingMonth";
import isWeekend from "./isWeekend";
import createUrl from "./createUrl";
import { Settings } from "./settings";

/**
 * Builds the calendar view
 *
 * @param  {WidgetStack} stack - onto which the calendar is built
 */
async function buildCalendarView(
  date: Date,
  stack: WidgetStack,
  settings: Settings,
  {
    verticalAlign = 'center'
  }: {
    verticalAlign?: 'top' | 'center'
  } = {}
): Promise<void> {
  const rightStack = stack.addStack();
  rightStack.layoutVertically();

  if (verticalAlign === 'center') {
    rightStack.addSpacer();
  }

  const dateFormatter = new DateFormatter();
  dateFormatter.dateFormat = "MMMM";
  dateFormatter.locale = settings.locale.split("-")[0];

  // if calendar is on a small widget make it a bit smaller to fit
  const spacing = config.widgetFamily === "small" ? 18 : 19;

  // Current month line
  const monthLine = rightStack.addStack();
  // since dates are centered in their squares we need to add some space
  monthLine.addSpacer(4);
  const monthFontSize = settings.fontSize === 'small' 
    ? 12 
    : settings.fontSize === 'medium' 
      ? 14 
      : 16;
  addWidgetTextLine(dateFormatter.string(date).toUpperCase(), monthLine, {
    textColor: settings.theme.textColor,
    font: Font.boldSystemFont(monthFontSize),
  });

  const calendarStack = rightStack.addStack();
  calendarStack.spacing = 2;

  const { calendar, daysFromPrevMonth, daysFromNextMonth } = buildCalendar(
    date,
    settings
  );

  const { eventCounts, intensity } = await countEvents(
    date,
    daysFromPrevMonth,
    daysFromNextMonth,
    settings
  );

  const fontSize = settings.fontSize === 'small' 
    ? 10 
    : settings.fontSize === 'medium' 
      ? 11 
      : 12;

  for (let i = 0; i < calendar.length; i += 1) {
    const weekdayStack = calendarStack.addStack();
    weekdayStack.layoutVertically();

    for (let j = 0; j < calendar[i].length; j += 1) {
      const dayStack = weekdayStack.addStack();
      dayStack.size = new Size(spacing, spacing);
      dayStack.centerAlignContent();

      // splitting "month/day" or "D"
      // a day marker won't split so if we reverse and take first we get correct
      const [day, month] = calendar[i][j].split("/").reverse();
      // add callbacks to each date
      if (settings.individualDateTargets) {
        const callbackUrl = createUrl(day, month, date, settings);
        if (j > 0) dayStack.url = callbackUrl;
      }
      // if the day is today, highlight it
      if (calendar[i][j] === `${date.getMonth()}/${date.getDate()}`) {
        if (settings.markToday) {
          const highlightedDate = createDateImage(day, {
            backgroundColor: settings.theme.todayCircleColor,
            textColor: settings.theme.todayTextColor,
            intensity: 1,
            toFullSize: true,
            textSize: settings.fontSize,
          });
          dayStack.addImage(highlightedDate);
        } else {
          addWidgetTextLine(day, dayStack, {
            textColor: settings.theme.todayTextColor,
            font: Font.boldSystemFont(fontSize),
            align: "center",
          });
        }
        // j == 0, contains the letters, so this creates all the other dates
      } else if (j > 0 && calendar[i][j] !== " ") {
        const isCurrentMonth = isDateFromBoundingMonth(i, j, date, calendar);
        const toFullSize = !settings.smallerPrevNextMonth || isCurrentMonth;
        let textColor = isWeekend(i, settings.startWeekOnSunday)
          ? settings.theme.weekendDateColor
          : settings.theme.weekdayTextColor;
        if (!isCurrentMonth) textColor = settings.theme.textColorPrevNextMonth;

        const dateImage = createDateImage(day, {
          backgroundColor: settings.theme.eventCircleColor,
          textColor: textColor,
          intensity: settings.showEventCircles
            ? eventCounts.get(calendar[i][j]) * intensity
            : 0,
          toFullSize,
          style: settings.eventCircleStyle,
          textSize: settings.fontSize,
        });
        dayStack.addImage(dateImage);
      } else {
        // first line and empty dates from other months
        addWidgetTextLine(day, dayStack, {
          textColor: isWeekend(i, settings.startWeekOnSunday)
            ? settings.theme.weekendLetterColor
            : settings.theme.textColor,
          opacity: isWeekend(i, settings.startWeekOnSunday)
            ? settings.theme.weekendLetterOpacity
            : 1,
          font: Font.boldSystemFont(fontSize),
          align: "center",
        });
      }
    }
  }
  if (verticalAlign === 'center') {
    rightStack.addSpacer();
  }
}

export default buildCalendarView;
