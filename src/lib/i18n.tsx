/**
 * Lightweight i18n layer for the HUD.
 * Language choice is held in React context and persisted to localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "am", label: "አማርኛ", short: "AM" },
  { code: "om", label: "Afaan Oromoo", short: "OM" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "zh", label: "中文", short: "ZH" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const en: Dict = {
  // header / status
  missionClock: "Mission clock",
  tracked: "Tracked",
  search: "Search",
  systemOnline: "SYSTEM ONLINE",
  systemDegraded: "SYSTEM DEGRADED",
  objects: "OBJECTS",
  objectsTracked: "OBJECTS TRACKED",
  language: "Language",
  pauseSimulation: "Pause simulation",
  playSimulation: "Play simulation",
  timelineScrub: "Timeline scrub",
  scrub: "SCRUB",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "NO MATCHES IN CATALOG",
  // telemetry
  targetTelemetry: "Target telemetry",
  live: "LIVE",
  latitude: "SUB-POINT LAT",
  longitude: "SUB-POINT LON",
  velocity: "VELOCITY",
  altitude: "ALTITUDE",
  orbitalPeriod: "ORBITAL PERIOD",
  liveFeed: "LIVE FEED",
  issTrack: "ISS track",
  telemetry: "TELEMETRY",
  // layers
  layers: "LAYERS",
  mapLayers: "Map layers",
  terminator: "Sun / Terminator",
  orbiters: "Orbits",
  craters: "Night Lights",
  landingSites: "Surface Labels",
  temperature: "Thermal Map",
  surfaceGazetteer: "Surface gazetteer",
  // bodies
  Sun: "Sun",
  Mercury: "Mercury",
  Venus: "Venus",
  Earth: "Earth",
  Moon: "Moon",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
};

const am: Dict = {
  missionClock: "የተልዕኮ ሰዓት",
  tracked: "ተከታታይ",
  search: "ፍለጋ",
  systemOnline: "ሲስተም በመስመር ላይ",
  systemDegraded: "ሲስተም ተዳክሟል",
  objects: "ነገሮች",
  objectsTracked: "የተከታተሉ ነገሮች",
  language: "ቋንቋ",
  pauseSimulation: "ማስመሰያውን አቁም",
  playSimulation: "ማስመሰያውን አስጀምር",
  timelineScrub: "የጊዜ መስመር መቆጣጠሪያ",
  scrub: "ጊዜ ምረጥ",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "በመዝገቡ ውስጥ ተዛማጅ የለም",
  targetTelemetry: "የዒላማ ቴሌሜትሪ",
  live: "በቀጥታ",
  latitude: "ኬክሮስ",
  longitude: "ኬንትሮስ",
  velocity: "ፍጥነት",
  altitude: "ከፍታ",
  orbitalPeriod: "የምህዋር ጊዜ",
  liveFeed: "ቀጥታ ስርጭት",
  issTrack: "የISS ዱካ",
  telemetry: "ቴሌሜትሪ",
  layers: "ንብርብሮች",
  mapLayers: "የካርታ ንብርብሮች",
  terminator: "ፀሐይ / ተርሚነተር",
  orbiters: "ምህዋሮች",
  craters: "የሌሊት መብራቶች",
  landingSites: "የገጽ መለያዎች",
  temperature: "የሙቀት ካርታ",
  surfaceGazetteer: "የገጽ መዝገበ ስም",
  Sun: "ፀሐይ",
  Mercury: "ሜርኩሪ",
  Venus: "ቬኑስ",
  Earth: "ምድር",
  Moon: "ጨረቃ",
  Mars: "ማርስ",
  Jupiter: "ጁፒተር",
  Saturn: "ሳተርን",
  Uranus: "ዩራነስ",
  Neptune: "ኔፕቲዩን",
};

const om: Dict = {
  missionClock: "Sa'aatii ergama",
  tracked: "Hordofame",
  search: "Barbaadi",
  systemOnline: "SIRNI HOJII IRRA JIRA",
  systemDegraded: "SIRNI LAAFEERA",
  objects: "WANTOOTA",
  objectsTracked: "WANTOOTA HORDOFAMAN",
  language: "Afaan",
  pauseSimulation: "Fakkeessituu dhaabi",
  playSimulation: "Fakkeessituu jalqabi",
  timelineScrub: "To'annoo sarara yeroo",
  scrub: "YEROO FILADHU",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "GALMEE KEESSATTI HIN ARGMAMNE",
  targetTelemetry: "Telemetrii xiyyeeffannoo",
  live: "KALLATTII",
  latitude: "Latitiudii",
  longitude: "Loongitiudii",
  velocity: "Saffisa",
  altitude: "Ol'aantummaa",
  orbitalPeriod: "Yeroo naanna'uu",
  liveFeed: "Tamsaasa kallattii",
  issTrack: "Faana ISS",
  telemetry: "TELEMETRII",
  layers: "SADARKAALEE",
  mapLayers: "Sadarkaalee kaartaa",
  terminator: "Aduu / Terminaatara",
  orbiters: "Naannoowwan",
  craters: "Ifa halkanii",
  landingSites: "Maqaa lafaa",
  temperature: "Kaartaa ho'aa",
  surfaceGazetteer: "Galmee maqaa lafaa",
  Sun: "Aduu",
  Mercury: "Merkurii",
  Venus: "Veenas",
  Earth: "Lafa",
  Moon: "Ji'a",
  Mars: "Maarsi",
  Jupiter: "Juuppiter",
  Saturn: "Saaturn",
  Uranus: "Uraanas",
  Neptune: "Neeptiyuun",
};

const fr: Dict = {
  missionClock: "Horloge de mission",
  tracked: "Suivis",
  search: "Rechercher",
  systemOnline: "SYSTÈME EN LIGNE",
  systemDegraded: "SYSTÈME DÉGRADÉ",
  objects: "OBJETS",
  objectsTracked: "OBJETS SUIVIS",
  language: "Langue",
  pauseSimulation: "Mettre la simulation en pause",
  playSimulation: "Lancer la simulation",
  timelineScrub: "Parcourir la chronologie",
  scrub: "PARCOURIR",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "AUCUN RÉSULTAT DANS LE CATALOGUE",
  targetTelemetry: "Télémétrie cible",
  live: "DIRECT",
  latitude: "LATITUDE",
  longitude: "LONGITUDE",
  velocity: "VITESSE",
  altitude: "ALTITUDE",
  orbitalPeriod: "PÉRIODE ORBITALE",
  liveFeed: "FLUX DIRECT",
  issTrack: "Trajectoire ISS",
  telemetry: "TÉLÉMÉTRIE",
  layers: "COUCHES",
  mapLayers: "Couches de carte",
  terminator: "Soleil / Terminateur",
  orbiters: "Orbites",
  craters: "Lumières nocturnes",
  landingSites: "Étiquettes de surface",
  temperature: "Carte thermique",
  surfaceGazetteer: "Répertoire de surface",
  Sun: "Soleil",
  Mercury: "Mercure",
  Venus: "Vénus",
  Earth: "Terre",
  Moon: "Lune",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturne",
  Uranus: "Uranus",
  Neptune: "Neptune",
};

const ru: Dict = {
  missionClock: "Часы миссии",
  tracked: "Отслежено",
  search: "Поиск",
  systemOnline: "СИСТЕМА В СЕТИ",
  systemDegraded: "СИСТЕМА ОСЛАБЛЕНА",
  objects: "ОБЪЕКТЫ",
  objectsTracked: "ОТСЛЕЖИВАЕМЫЕ ОБЪЕКТЫ",
  language: "Язык",
  pauseSimulation: "Приостановить симуляцию",
  playSimulation: "Запустить симуляцию",
  timelineScrub: "Прокрутка временной шкалы",
  scrub: "ШКАЛА",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "В КАТАЛОГЕ НЕТ СОВПАДЕНИЙ",
  targetTelemetry: "Телеметрия цели",
  live: "ПРЯМОЙ ЭФИР",
  latitude: "ШИРОТА",
  longitude: "ДОЛГОТА",
  velocity: "СКОРОСТЬ",
  altitude: "ВЫСОТА",
  orbitalPeriod: "ПЕРИОД ОБРАЩЕНИЯ",
  liveFeed: "ПРЯМАЯ ТРАНСЛЯЦИЯ",
  issTrack: "Трасса МКС",
  telemetry: "ТЕЛЕМЕТРИЯ",
  layers: "СЛОИ",
  mapLayers: "Слои карты",
  terminator: "Солнце / Терминатор",
  orbiters: "Орбиты",
  craters: "Ночные огни",
  landingSites: "Метки поверхности",
  temperature: "Тепловая карта",
  surfaceGazetteer: "Справочник поверхности",
  Sun: "Солнце",
  Mercury: "Меркурий",
  Venus: "Венера",
  Earth: "Земля",
  Moon: "Луна",
  Mars: "Марс",
  Jupiter: "Юпитер",
  Saturn: "Сатурн",
  Uranus: "Уран",
  Neptune: "Нептун",
};

const zh: Dict = {
  missionClock: "任务时钟",
  tracked: "已跟踪",
  search: "搜索",
  systemOnline: "系统在线",
  systemDegraded: "系统降级",
  objects: "目标",
  objectsTracked: "跟踪目标数",
  language: "语言",
  pauseSimulation: "暂停模拟",
  playSimulation: "开始模拟",
  timelineScrub: "时间轴定位",
  scrub: "定位",
  speed1: "1x",
  speed10: "10x",
  speed100: "100x",
  noSearchMatches: "目录中没有匹配项",
  targetTelemetry: "目标遥测",
  live: "实时",
  latitude: "纬度",
  longitude: "经度",
  velocity: "速度",
  altitude: "高度",
  orbitalPeriod: "轨道周期",
  liveFeed: "实时信号",
  issTrack: "空间站轨迹",
  telemetry: "遥测",
  layers: "图层",
  mapLayers: "地图图层",
  terminator: "太阳 / 晨昏线",
  orbiters: "轨道",
  craters: "夜间灯光",
  landingSites: "地表标注",
  temperature: "热力图",
  surfaceGazetteer: "地表地名录",
  Sun: "太阳",
  Mercury: "水星",
  Venus: "金星",
  Earth: "地球",
  Moon: "月球",
  Mars: "火星",
  Jupiter: "木星",
  Saturn: "土星",
  Uranus: "天王星",
  Neptune: "海王星",
};

const DICTS: Record<LangCode, Dict> = { en, am, om, fr, ru, zh };

const STORAGE_KEY = "oi-lang";

interface I18nValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && stored in DICTS) setLangState(stored);
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable — selection still applies for this session */
    }
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang][key] ?? en[key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k) => en[k] ?? k };
  return ctx;
}
