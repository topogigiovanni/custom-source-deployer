@ECHO OFF
REM http://stackoverflow.com/questions/2524928/dos-batch-iterate-through-a-delimited-string
SETLOCAL EnableDelayedExpansion

REM SET str=store1 store2 store3 store4 store5 store6
SET str=dnastore gstore gweb trello 

set servers=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24

echo %str%

call :parse "%str%"

goto :end

:parse

set list=%1
set list=%list:"=%

FOR /f "tokens=1* delims= " %%a IN ("%list%") DO (
  if not "%%a" == "" call :sub %%a
  if not "%%b" == "" call :parse "%%b"
)

goto :eos

:sub

echo %1

goto :eos

:end
pause

:eos
endlocal

