type TgUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
};

export const tg = (window as any).Telegram?.WebApp;

export const initTelegram = () => {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('#FFE066');
  tg.setBackgroundColor?.('#ffffff');
};

export const getTgUser = (): TgUser | null => {
  return tg?.initDataUnsafe?.user ?? null;
};

export const isAdmin = (): boolean => {
    if (import.meta.env.DEV) return true;
  const user = getTgUser();
  const adminId = Number(import.meta.env.VITE_ADMIN_TELEGRAM_ID);
  return !!user && user.id === adminId;
};

export const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  tg?.HapticFeedback?.impactOccurred(style);
};

export const closeApp = () => tg?.close();