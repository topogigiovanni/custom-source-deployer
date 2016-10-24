REM http://stackoverflow.com/questions/11419046/how-do-i-return-a-value-from-a-function-in-a-batch-file
@echo off

set myvar=
echo %myvar%
call :myfunction myvar
echo %myvar%
goto eof

:myfunction
set %1=filled
goto eof

:eof
pause