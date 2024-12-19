package bilfo.demo.enums;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

public enum DAY {
    NOT_ASSIGNED,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;

    public static DAY getCurrentDay() {
        return getDayOfWeek(Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));
    }

    public static DAY getDayOfWeek(Date date) {
        return switch (date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getDayOfWeek()) {
            case MONDAY -> DAY.MONDAY;
            case TUESDAY -> DAY.TUESDAY;
            case WEDNESDAY -> DAY.WEDNESDAY;
            case THURSDAY -> DAY.THURSDAY;
            case FRIDAY -> DAY.FRIDAY;
            case SATURDAY -> DAY.SATURDAY;
            case SUNDAY -> DAY.SUNDAY;
        };
    }

    public static Date getStartOfWeek(Date date)
    {
        DAY day = getDayOfWeek(date);
        return add(date, -(day.ordinal() - 1));
    }

    public static Date add(Date date, int amount) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, amount);
        return calendar.getTime();
    }

    public static int dayDifference(Date date1, Date date2)
    {
        return (int) Math.abs(ChronoUnit.DAYS.between(date1.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), date2.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()));
    }
}
