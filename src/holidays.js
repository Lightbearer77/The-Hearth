// ─── Asatru Holidays & AFA Days of Remembrance ───
// Each entry is anchored by a Greek date (greekMonth + greekDay).
// Reminders fire visually on the calendar 14, 7, and 1 day before.
//
// Two categories:
//   type: 'solar' | 'blot' | 'festival'  — Asatru wheel of the year
//   type: 'remembrance'                  — AFA Days of Remembrance

const DEFAULT_REMINDERS = [14, 7, 1];

export const ASATRU_HOLIDAYS = [
  // ─── Wheel of the Year ───
  {
    id: "thorrablot",
    title: "Þorrablót",
    greekMonth: "M01",
    greekDay: 19,
    symbol: "❄",
    description: "Mid-winter feast honoring Þorri, the frost giant. A celebration of endurance through the deepest cold.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "disting",
    title: "Disting · Disablót",
    greekMonth: "M02",
    greekDay: 4,
    symbol: "🌾",
    description: "Blessing of the Dísir — the female ancestral spirits. Marks the first stirring of the land and prepares for the coming growing season.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "ostara",
    title: "Ostara · Spring Equinox",
    greekMonth: "M03",
    greekDay: 23,
    symbol: "☀",
    description: "Spring equinox. The signal that winter is ending, not the start of summer. Honor renewal, fertility, and the returning sun.",
    type: "solar",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "sigrblot",
    title: "Sigrblót",
    greekMonth: "M04",
    greekDay: 15,
    symbol: "⚔",
    description: "Victory blót. Sacrifice for the season's success — blessing of ships, weapons, and ventures. Marks the beginning of the active season.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "walpurgis",
    title: "Walpurgis · May Eve",
    greekMonth: "M05",
    greekDay: 9,
    symbol: "🔥",
    description: "Great fire festival. End of winter officially declared. Light bonfires, drive out the old, welcome the active half of the year.",
    type: "festival",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "midsummer",
    title: "Midsummer · Summer Solstice",
    greekMonth: "M07",
    greekDay: 4,
    symbol: "☀",
    description: "Summer solstice. The sun at its peak. Honor light, abundance, and the height of life's power. Eta begins at maximum.",
    type: "solar",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "freyfaxi",
    title: "Freyfaxi · Lammas",
    greekMonth: "M08",
    greekDay: 17,
    symbol: "🌾",
    description: "First harvest. Frey honored for the grain. The first fruits are cut and offered. The year begins its turn toward harvest.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "haustblot",
    title: "Haustblót · Fall Equinox",
    greekMonth: "M10",
    greekDay: 14,
    symbol: "🍂",
    description: "Autumn sacrifice. Gratitude for the harvest, preparation for winter, the Dísir honored again. Balance between light and dark.",
    type: "solar",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "winternights",
    title: "Winter Nights · Vetrnætr",
    greekMonth: "M11",
    greekDay: 24,
    symbol: "⚱",
    description: "Threshold of the dark half. Honor the ancestors, the dead, and the spirits of place. Lambda's defining ritual — the month is named for this.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "einherjar",
    title: "Einherjar",
    greekMonth: "M12",
    greekDay: 7,
    symbol: "🗡",
    description: "Day to honor the war-dead — those who fell in battle, the Einherjar of Valhöll. Sets the inward, ancestor-facing tone of Mu.",
    type: "blot",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "yule",
    title: "Yule · Winter Solstice",
    greekMonth: "M13",
    greekDay: 19,
    symbol: "✦",
    description: "Winter solstice. The longest night. Beginning of the 12 nights of Yule that run through to year-end. The sacred dark.",
    type: "solar",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "planning_day",
    title: "Planning Day",
    greekMonth: "PLANNING",
    greekDay: 1,
    symbol: "✦",
    description: "Threshold day outside any month. Annual review, reckoning, and forward planning. The 12th night of Yule pivots forward into the new year.",
    type: "festival",
    reminders: [7, 1],
  },

  // ─── AFA Days of Remembrance ───
  // Honoring those who held to the old ways. The rune ᛏ (Tiwaz) marks
  // the warrior code, honor, and justice — the spirit of these days.
  {
    id: "rem_raudr",
    title: "Goði Rauðr the Strong",
    greekMonth: "M01",
    greekDay: 9,
    symbol: "ᛏ",
    description: "Norwegian goði who resisted forced conversion under Olaf Tryggvason. Tortured and killed for refusing to abandon his gods.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_blot_sveinn",
    title: "King Blót-Sveinn of Sweden",
    greekMonth: "M01",
    greekDay: 18,
    symbol: "ᛏ",
    description: "11th-century king of Sweden who restored the old worship at the Temple of Uppsala after the Christian king Inge was deposed.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_eanfrith",
    title: "King Eanfrith of Bernicia",
    greekMonth: "M02",
    greekDay: 4,
    symbol: "ᛏ",
    description: "7th-century Anglo-Saxon king who returned to the worship of his ancestors after a period of nominal Christianity.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_eyvind",
    title: "Eyvind Kinnrifa",
    greekMonth: "M02",
    greekDay: 12,
    symbol: "ᛏ",
    description: "Norwegian heathen tortured to death under Olaf Tryggvason's forced conversion. Refused baptism to the end.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_olvir",
    title: "Goði Ölvir of Egg",
    greekMonth: "M03",
    greekDay: 12,
    symbol: "ᛏ",
    description: "Norwegian goði who held the public blóts during the Christianization era. Killed by Olaf Tryggvason for organizing a heathen feast.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_winguric",
    title: "Winguric",
    greekMonth: "M04",
    greekDay: 1,
    symbol: "ᛏ",
    description: "Gothic chieftain who led the defense of ancestral Gothic religion against Christian persecution among his people.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_hakon",
    title: "Jarl Hákon Sigurðarson",
    greekMonth: "M04",
    greekDay: 15,
    symbol: "ᛏ",
    description: "Last great pagan ruler of Norway. Restored heathen worship and led the people against Christianization. Killed in 995.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_stubba",
    title: "John 'Stubba' Yeowell",
    greekMonth: "M04",
    greekDay: 16,
    symbol: "ᛏ",
    description: "British Odinist, founder of the Odinic Rite in 1972. Pivotal figure in the modern heathen revival.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_atharid",
    title: "Atharid",
    greekMonth: "M04",
    greekDay: 18,
    symbol: "ᛏ",
    description: "Gothic leader who took part in the resistance against the forced conversion of Gothic pagans.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_jarnskeggja",
    title: "Járnskeggja",
    greekMonth: "M05",
    greekDay: 17,
    symbol: "ᛏ",
    description: "Norwegian chieftain who led resistance at the Thing against Olaf Tryggvason's forced Christianization. Killed by Olaf's men.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_hoskuld",
    title: "John 'Hoskuld' Gibbs-Bailey",
    greekMonth: "M06",
    greekDay: 2,
    symbol: "ᛏ",
    description: "Co-founder of the Odinic Rite alongside Stubba. British Odinist pioneer of the modern revival.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_athanaric",
    title: "King Athanaric of the Visigoths",
    greekMonth: "M06",
    greekDay: 20,
    symbol: "ᛏ",
    description: "4th-century Gothic king who defended Gothic pagan religion against Christian persecution within his people.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_klasson",
    title: "Erik Klasson",
    greekMonth: "M06",
    greekDay: 24,
    symbol: "ᛏ",
    description: "Modern AFA folk member honored for service to the gods and the kindred.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_sveinbjorn",
    title: "Sveinbjörn Beinteinsson",
    greekMonth: "M07",
    greekDay: 17,
    symbol: "ᛏ",
    description: "Icelandic Allsherjargoði and co-founder of Ásatrúarfélagið in 1972. Pivotal in re-establishing Asatru as a recognized faith.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_rud_mills",
    title: "Alexander Rud Mills",
    greekMonth: "M07",
    greekDay: 28,
    symbol: "ᛏ",
    description: "Australian author of 'The Odinist Religion' (1930). Early 20th-century pioneer of organized Odinism.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_osric",
    title: "King Osric of Deira",
    greekMonth: "M08",
    greekDay: 17,
    symbol: "ᛏ",
    description: "7th-century Anglo-Saxon king who returned to the old gods. Killed in battle against Cadwallon.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_radbod",
    title: "King Radbod of Frisia",
    greekMonth: "M08",
    greekDay: 25,
    symbol: "ᛏ",
    description: "Frisian king who at the baptismal font chose his ancestors in their hall over a Christian heaven without them.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_hermann",
    title: "Prince Hermann of the Cherusci",
    greekMonth: "M09",
    greekDay: 28,
    symbol: "ᛏ",
    description: "Arminius. Defeated three Roman legions at Teutoburg Forest in 9 AD, preserving Germanic independence.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_else",
    title: "Else Christensen",
    greekMonth: "M10",
    greekDay: 3,
    symbol: "ᛏ",
    description: "Danish-American founder of the Odinist Fellowship and publisher of 'The Odinist' magazine. Major figure in the 20th-century revival.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_thorsteinn",
    title: "Goði Þorsteinn Guðjónsson",
    greekMonth: "M10",
    greekDay: 25,
    symbol: "ᛏ",
    description: "Icelandic goði and notable figure in Ásatrúarfélagið's development.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_von_list",
    title: "Meister Guido von List",
    greekMonth: "M10",
    greekDay: 26,
    symbol: "ᛏ",
    description: "Austrian author, mystic, and runologist whose work shaped much of modern Germanic spirituality and runology.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_loyal_saxons",
    title: "The Loyal Saxons",
    greekMonth: "M11",
    greekDay: 2,
    symbol: "ᛏ",
    description: "The 4,500 Saxon nobles executed at the Massacre of Verden in 782 for refusing Christian conversion under Charlemagne.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_mcnallen",
    title: "Birthday of Stephen McNallen",
    greekMonth: "M11",
    greekDay: 8,
    symbol: "ᛏ",
    description: "Founder of the Asatru Folk Assembly. Central figure of the modern American Asatru revival.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_aoric",
    title: "King Aoric",
    greekMonth: "M11",
    greekDay: 16,
    symbol: "ᛏ",
    description: "Gothic king who defended traditional Gothic religion during the Christianization pressure on the Goths.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_ragnvald",
    title: "Ragnvald Odinskarl",
    greekMonth: "M11",
    greekDay: 20,
    symbol: "ᛏ",
    description: "'Odin's man.' Norse heathen who refused conversion. His byname declares whose man he died as.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_sigridr",
    title: "Queen Sigríðr of Sweden",
    greekMonth: "M12",
    greekDay: 5,
    symbol: "ᛏ",
    description: "Sigríðr the Haughty. Refused Olaf Tryggvason's demand to convert as a condition of marriage. Held to her gods.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_sexraed",
    title: "King Sexræd",
    greekMonth: "M12",
    greekDay: 14,
    symbol: "ᛏ",
    description: "Anglo-Saxon king of the East Saxons who returned to the old worship. Killed in battle defending the ancestral faith.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_egill",
    title: "Egill Skallagrímsson",
    greekMonth: "M13",
    greekDay: 7,
    symbol: "ᛏ",
    description: "Icelandic skald, warrior, and farmer. Central figure of Egil's Saga. Exemplar of the Norse warrior-poet ideal.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
  {
    id: "rem_saeward",
    title: "King Sæward",
    greekMonth: "M13",
    greekDay: 16,
    symbol: "ᛏ",
    description: "Anglo-Saxon king who returned to the old gods with his brother Sexræd. Killed in battle defending the ancestral faith.",
    type: "remembrance",
    reminders: DEFAULT_REMINDERS,
  },
];

// ─── Lookup helpers ───

// Holidays falling on a specific Greek date.
export const holidaysForGreekDate = (greekMonth, greekDay) => {
  return ASATRU_HOLIDAYS.filter(
    h => h.greekMonth === greekMonth && h.greekDay === greekDay
  );
};

// Internal: Greek date -> Gregorian ISO. Inlined to avoid circular import.
const greekToGregLocal = (monthId, day, year) => {
  if (monthId === "PLANNING") {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const dec = isLeap ? 30 : 31;
    return `${year}-12-${String(dec).padStart(2, "0")}`;
  }
  const monthOrder = ["M01","M02","M03","M04","M05","M06","M07","M08","M09","M10","M11","M12","M13"];
  const idx = monthOrder.indexOf(monthId);
  if (idx < 0) return null;
  const doy = idx * 28 + day;
  const date = new Date(year, 0, doy);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
};

const subtractDays = (isoDate, days) => {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

// Returns an array of reminder objects for a given ISO date.
// Each: { holiday, daysAway, holidayDate }
export const remindersForDate = (isoDate, year) => {
  const reminders = [];
  for (const h of ASATRU_HOLIDAYS) {
    if (!h.reminders || h.reminders.length === 0) continue;
    const holidayISO = greekToGregLocal(h.greekMonth, h.greekDay, year);
    if (!holidayISO) continue;
    for (const daysBefore of h.reminders) {
      const reminderISO = subtractDays(holidayISO, daysBefore);
      if (reminderISO === isoDate) {
        reminders.push({ holiday: h, daysAway: daysBefore, holidayDate: holidayISO });
      }
    }
  }
  return reminders;
};

export const hasReminderOn = (isoDate, year) => {
  return remindersForDate(isoDate, year).length > 0;
};
