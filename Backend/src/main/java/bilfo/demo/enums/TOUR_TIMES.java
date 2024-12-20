package bilfo.demo.enums;

public enum TOUR_TIMES {
    NINE_AM,
    ELEVEN_AM,
    ONE_THIRTY_PM,
    FOUR_PM,
    WHOLE_DAY;

    public String toString() {
        return switch (this) {
            case NINE_AM, WHOLE_DAY -> "09.00";
            case ELEVEN_AM -> "11.00";
            case ONE_THIRTY_PM -> "13.30";
            case FOUR_PM -> "16.00";
        };
    }
}