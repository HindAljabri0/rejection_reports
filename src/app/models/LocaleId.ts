export class LocaleId {
    public static defaultLocaleId = 'ar';

    public static setCurrentLocale(localeId: string) {
        localStorage.setItem('__localeId', localeId);
    }

    public static getCurrentLocale(): string {
        const storedLocaleId = localStorage.getItem('__localeId') as string;
        if (storedLocaleId == null) {
            return this.defaultLocaleId;
        }
        return storedLocaleId;
    }
}
