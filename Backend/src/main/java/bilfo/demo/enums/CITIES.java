package bilfo.demo.enums;

public enum CITIES {
    ADANA,
    ADIYAMAN,
    AFYONKARAHISAR,
    AGRI,
    AKSARAY,
    AMASYA,
    ANKARA,
    ANTALYA,
    ARDAHAN,
    ARTVIN,
    AYDIN,
    BALIKESIR,
    BARTIN,
    BATMAN,
    BAYBURT,
    BILECIK,
    BINGOL,
    BITLIS,
    BOLU,
    BURDUR,
    BURSA,
    CANAKKALE,
    CANKIRI,
    CORUM,
    DENIZLI,
    DIYARBAKIR,
    DUZCE,
    EDIRNE,
    ELAZIG,
    ERZINCAN,
    ERZURUM,
    ESKISEHIR,
    GAZIANTEP,
    GIRESUN,
    GUMUSHANE,
    HAKKARI,
    HATAY,
    IGDIR,
    ISPARTA,
    ISTANBUL,
    IZMIR,
    KAHRAMANMARAS,
    KARABUK,
    KARAMAN,
    KARS,
    KASTAMONU,
    KAYSERI,
    KILIS,
    KIRIKKALE,
    KIRKLARELI,
    KIRSEHIR,
    KOCAELI,
    KONYA,
    KUTAHYA,
    MALATYA,
    MANISA,
    MARDIN,
    MERSIN,
    MUGLA,
    MUS,
    NEVSEHIR,
    NIGDE,
    ORDU,
    OSMANIYE,
    RIZE,
    SAKARYA,
    SAMSUN,
    SANLIURFA,
    SIIRT,
    SINOP,
    SIVAS,
    SIRNAK,
    TEKIRDAG,
    TOKAT,
    TRABZON,
    TUNCELI,
    USAK,
    VAN,
    YALOVA,
    YOZGAT,
    ZONGULDAK;

    public static CITIES turkishStringToCity(String city) {
        city = city.replace("İ", "I")
                .replace("ı", "i")
                .replace("Ö", "O")
                .replace("ö", "o")
                .replace("Ü", "U")
                .replace("ü", "u")
                .replace("Ç", "C")
                .replace("ç", "c")
                .replace("Ş", "S")
                .replace("ş", "s")
                .replace("Ğ", "G")
                .replace("ğ", "g")
                .toUpperCase().trim();
        return CITIES.valueOf(city);
    }
}