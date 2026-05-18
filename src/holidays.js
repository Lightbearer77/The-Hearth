// ─── Asatru Holiday Map ───
// Each holiday is anchored by either:
//   - A fixed Greek date (greekMonth + greekDay) — most stable, recommended
//   - A fixed Gregorian date (mmdd) — for solar events that we approximate
//
// The fmtGreek positions in comments are 2026 reference; the math will resolve
// correctly across any year since the Greek calendar is perpetual.

export const ASATRU_HOLIDAYS = [
  {
    id: "thorrablot",
    title: "Þorrablót",
    greekMonth: "M01",
    greekDay: 19,
    symbol: "❄",
    description: "Mid-winter feast honoring Þorri, the frost giant. A celebration of endurance through the deepest cold.",
    type: "blot",
  },
  {
    id: "disting",
    title: "Disting (Disablót)",
    greekMonth: "M02",
    greekDay: 4,
    symbol: "🌾",
    description: "Blessing of the Dísir — the female ancestral spirits. Marks the first stirring of the land and prepares for the coming growing season.",
    type: "blot",
  },
  {
    id: "ostara",
    title: "Ostara · Spring Equinox",
    greekMonth: "M03",
    greekDay: 23,
    symbol: "☀",
    description: "Spring equinox. The signal that winter is ending, not the start of summer. Honor renewal, fertility, and the returning sun.",
    type: "solar",
  },
  {
    id: "sigrblot",
    title: "Sigrblót",
    greekMonth: "M04",
    greekDay: 15,
    symbol: "⚔",
    description: "Victory blót. Sacrifice for the season's success — blessing of ships, weapons, and ventures. Marks the beginning of the active season.",
    type: "blot",
  },
  {
    id: "walpurgis",
    title: "Walpurgis · May Eve",
    greekMonth: "M05",
    greekDay: 9,
    symbol: "🔥",
    description: "Great fire festival. End of winter officially declared. Light bonfires, drive out the old, welcome the active half of the year.",
    type: "festival",
  },
  {
    id: "midsummer",
    title: "Midsummer · Summer Solstice",
    greekMonth: "M07",
    greekDay: 4,
    symbol: "☀",
    description: "Summer solstice. The sun at its peak. Honor light, abundance, and the height of life's power. Eta begins at maximum.",
    type: "solar",
  },
  {
    id: "freyfaxi",
    title: "Freyfaxi · Lammas",
    greekMonth: "M08",
    greekDay: 17,
    symbol: "🌾",
    description: "First harvest. Frey honored for the grain. The first fruits are cut and offered. The year begins its turn toward harvest.",
    type: "blot",
  },
  {
    id: "haustblot",
    title: "Haustblót · Fall Equinox",
    greekMonth: "M10",
    greekDay: 14,
    symbol: "🍂",
    description: "Autumn sacrifice. Gratitude for the harvest, preparation for winter, the Dísir honored again. Balance between light and dark.",
    type: "solar",
  },
  {
    id: "winternights",
    title: "Winter Nights · Vetrnætr",
    greekMonth: "M11",
    greekDay: 24,
    symbol: "⚱",
    description: "Threshold of the dark half. Honor the ancestors, the dead, and the spirits of place. Lambda's defining ritual — the month is named for this.",
    type: "blot",
  },
  {
    id: "einherjar",
    title: "Einherjar",
    greekMonth: "M12",
    greekDay: 7,
    symbol: "🗡",
    description: "Day to honor the war-dead — those who fell in battle, the Einherjar of Valhöll. Sets the inward, ancestor-facing tone of Mu.",
    type: "blot",
  },
  {
    id: "yule",
    title: "Yule · Winter Solstice",
    greekMonth: "M13",
    greekDay: 19,
    symbol: "✦",
    description: "Winter solstice. The longest night. Beginning of the 12 nights of Yule that run through to year-end. The sacred dark.",
    type: "solar",
  },
  {
    id: "planning_day",
    title: "Planning Day",
    greekMonth: "PLANNING",
    greekDay: 1,
    symbol: "✦",
    description: "Threshold day outside any month. Annual review, reckoning, and forward planning. The 12th night of Yule pivots forward into the new year.",
    type: "festival",
  },
];

// Returns a list of holidays for a specific ISO date by computing the Greek date.
// Imported elsewhere to overlay holidays onto calendar cells.
export const holidaysForGreekDate = (greekMonth, greekDay) => {
  return ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greekMonth && h.greekDay === greekDay
  );
};
