@echo off
echo Installing backend dependencies...
cd backend
call npm install
echo.
echo Starting AKUMA Fluffy Hair server...
echo Open http://localhost:3000 in your browser
echo.
npm start
