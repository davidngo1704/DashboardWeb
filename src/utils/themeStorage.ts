export interface ThemeConfig {
    menuMode: string;
    inlineMenuPosition: string;
    colorMode: string;
    inputStyle: string;
    isRTL: boolean;
    ripple: boolean;
    menuTheme: string;
    topbarTheme: string;
    theme: string;
}

const STORAGE_KEY = 'theme-config';

const defaultConfig: ThemeConfig = {
    menuMode: 'static',
    inlineMenuPosition: 'bottom',
    colorMode: 'light',
    inputStyle: 'filled',
    isRTL: false,
    ripple: true,
    menuTheme: 'light',
    topbarTheme: 'blue',
    theme: 'indigo'
};

/**
 * Kiểm tra localStorage có khả dụng không
 */
const isLocalStorageAvailable = (): boolean => {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

/**
 * Đọc cấu hình theme từ localStorage
 * Trả về giá trị mặc định nếu không tồn tại hoặc có lỗi
 */
export const loadThemeConfig = (): ThemeConfig => {
    if (!isLocalStorageAvailable()) {
        return defaultConfig;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return defaultConfig;
        }

        const parsed = JSON.parse(stored);
        
        // Đảm bảo tất cả các field cần thiết đều có
        return {
            menuMode: parsed.menuMode ?? defaultConfig.menuMode,
            inlineMenuPosition: parsed.inlineMenuPosition ?? defaultConfig.inlineMenuPosition,
            colorMode: parsed.colorMode ?? defaultConfig.colorMode,
            inputStyle: parsed.inputStyle ?? defaultConfig.inputStyle,
            isRTL: parsed.isRTL ?? defaultConfig.isRTL,
            ripple: parsed.ripple ?? defaultConfig.ripple,
            menuTheme: parsed.menuTheme ?? defaultConfig.menuTheme,
            topbarTheme: parsed.topbarTheme ?? defaultConfig.topbarTheme,
            theme: parsed.theme ?? defaultConfig.theme
        };
    } catch (error) {
        console.error('Error loading theme config from localStorage:', error);
        return defaultConfig;
    }
};

/**
 * Lưu cấu hình theme vào localStorage
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
    if (!isLocalStorageAvailable()) {
        console.warn('localStorage is not available');
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
        console.error('Error saving theme config to localStorage:', error);
    }
};

