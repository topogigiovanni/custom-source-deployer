@ECHO OFF
SETLOCAL EnableDelayedExpansion

SET origin=.\origin\Widgets
cd /d %origin%
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)

SET origin=..\..\origin\Themes
cd /d %origin%
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)

GOTO End


:End
PAUSE

:Eos
endlocal
