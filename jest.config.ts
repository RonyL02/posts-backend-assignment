/*@type {import('ts-jest/dist/types').InitialOptionsTsJest} 
export default {
    preset: "ts-jest", // שימוש בפריסט של ts-jest לבדיקות ב-TypeScript
    testEnvironment: "node", // סביבת עבודה מתאימה ל-Node.js
    roots: ["<rootDir>/tests"], // מיקום תיקיית הבדיקות (ניתן לשנות אם יש תיקייה אחרת)
    moduleFileExtensions: ["ts", "js"], // סיומות הקבצים ש-Jest יתמוך בהם
    testMatch: ["**.test.ts"], // התאמת קבצים עם הסיומת test.ts
   // verbose: true, // הפעלת פלט מפורט של תוצאות הבדיקות
    globals: {
      "ts-jest": {
        isolatedModules: true, // שיפור ביצועים אם לא נעשה שימוש ב-TypeScript מורכב
      },
    },
  };
  */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
};
