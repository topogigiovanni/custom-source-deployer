@ECHO OFF
SETLOCAL
SET destroot=.\dest
FOR /f "delims=" %%i IN ( ' dir /ad/b "%destroot%"' ) DO (robocopy ".\origin" "%destroot%\%%i" /IS /s 
ECHO "copiado em %destroot%\%%i" )
pause