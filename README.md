# Final Project

מערכת Web להפצת תכני וידאו בסגנון Netflix, במסגרת קורס פיתוח אפליקציות אינטרנטיות.

## טכנולוגיות

- Node.js
- Express
- MongoDB ו-Mongoose
- HTML5, CSS3 ו-JavaScript
- ארכיטקטורת MVC

## התקנה

1. התקינו את חבילות הפרויקט:

   ```bash
   npm install
   ```

2. העתיקו את `.env.example` לקובץ חדש בשם `.env`.
3. הגדירו בקובץ `.env` את כתובת החיבור ל-MongoDB ומחרוזת סודית עבור ה-Session.
4. הפעילו את השרת:

   ```bash
   npm start
   ```

5. פתחו בדפדפן את `http://localhost:3000`.

## הרשאות

המשתמש הראשון שנרשם למערכת מקבל תפקיד מנהל. משתמשים נוספים מקבלים תפקיד משתמש רגיל.

## מבנה הפרויקט

```text
models/       MongoDB models
controllers/  Request handling and application logic
routes/       Express routes
views/        HTML views
public/       Client-side CSS, JavaScript and images
config/       Project configuration
server.js     Application entry point
```

## Sample content

Run this command once to add sample movies and series to MongoDB:

```bash
npm run seed
```

Running the command again does not create duplicate titles.
